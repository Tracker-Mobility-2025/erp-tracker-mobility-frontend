<script>
import {VerificationRequestsApi} from "../services/verification-requests-api.service.js";
import {RequestObservationsApiService} from "../services/request-observations-api.service.js";
import {DownloadReportApiService} from "../../../tracker-mobility/verification-reports/services/download-report-api.service.js";
import {DownloadReport} from "../../../tracker-mobility/verification-reports/models/download-report.entity.js";
import {VerificationRequest} from "../models/verification-request.entity.js";
import {NotificationMixin} from "../../../shared/utils/notification.utils.js";
import RequestApplicantDetails from "../components/request-applicant-details.component.vue";
import RequestClientDetails from "../components/request-client-details.component.vue";
import RequestLocationDetails from "../components/request-location-details.component.vue";
import RequestLandlordDetails from "../components/request-landlord-details.component.vue";
import RequestDocumentsDetails from "../components/request-documents-details.component.vue";
import RequestObservationsDetails from "../components/request-observations-details.component.vue";

// Constantes de configuración
const STATUS_COLORS = {
  'PENDIENTE': '#A8A8A8',
  'ASIGNADO': '#1976D2',
  'EN_PROCESO': '#FFC107',
  'COMPLETADA': '#4CAF50',
  'CANCELADA': '#D32F2F',
  'OBSERVADO': '#FB8C00',
  'SUBSANADA': '#66BB6A',
  'ENTREVISTA_ARRENDADOR_FALTANTE': '#9C27B0'
};

const STATUS_WHITE_TEXT = ['ASIGNADO', 'COMPLETADA', 'CANCELADA', 'OBSERVADO', 'SUBSANADA', 'ENTREVISTA_ARRENDADOR_FALTANTE'];

const OBSERVATION_TYPE_LABELS = {
  'DOCUMENTO_IDENTIDAD_BORROSO': 'Documento de identidad - Borroso o ilegible',
  'RECIBO_SERVICIO_BORROSO': 'Recibo de servicio - Borroso o ilegible',
  'FOTO_FACHADA_BORROSA': 'Foto fachada vivienda - Borrosa o ilegible',
  'UBICACION_INCORRECTA': 'Ubicación en mapa - Enlace incorrecto',
  'DATOS_CLIENTE_INCOMPLETOS': 'Datos del cliente - Incorrectos',
  'DATOS_ARRENDADOR_INCOMPLETOS': 'Datos del arrendador - Incorrectos',
  'DOCUMENTO_IDENTIDAD': 'Documento de identidad',
  'RECIBO_SERVICIO': 'Recibo de servicio',
  'OTROS': 'Otros'
};

const OBSERVATION_SECTION_MAP = {
  'DOCUMENTO_IDENTIDAD_BORROSO': 'documents-details',
  'RECIBO_SERVICIO_BORROSO': 'documents-details',
  'FOTO_FACHADA_BORROSA': 'documents-details',
  'DOCUMENTO_IDENTIDAD': 'documents-details',
  'RECIBO_SERVICIO': 'documents-details',
  'DATOS_CLIENTE_INCOMPLETOS': 'client-details',
  'DATOS_ARRENDADOR_INCOMPLETOS': 'landlord-details',
  'UBICACION_INCORRECTA': 'location-details'
  //'OTROS': 'client-details'
};

const LOADING_STEPS = [
  { icon: 'pi-file-o', label: 'Datos de la solicitud' },
  { icon: 'pi-users', label: 'Información del cliente' },
  { icon: 'pi-building', label: 'Datos del solicitante' }
];

export default {
  name: 'verification-request-details',

  mixins: [NotificationMixin],

  components: {
    RequestApplicantDetails,
    RequestClientDetails,
    RequestLocationDetails,
    RequestLandlordDetails,
    RequestDocumentsDetails,
    RequestObservationsDetails
  },

  data() {
    return {
      verificationRequestsApi: new VerificationRequestsApi('/orders'),
      requestObservationsApiService: new RequestObservationsApiService('/orders'),
      downloadReportApiService: new DownloadReportApiService('/reports'),
      item: null,
      downloadReportData: new DownloadReport({}),
      isLoading: true,
      hasError: false,
      errorMessage: '',
      loadingStep: 0,
      loadingSteps: LOADING_STEPS,
      editModeEnabled: false,
      currentObservation: null,
      loadingProgressInterval: null
    };
  },

  methods: {
    // Parsear fecha string a objeto Date local (sin conversión de zona horaria)
    parseLocalDate(dateString) {
      if (!dateString) return null;
      
      try {
        // Si es formato ISO (YYYY-MM-DD), parsear como fecha local
        if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
          const [datePart] = dateString.split('T');
          const [year, month, day] = datePart.split('-').map(Number);
          return new Date(year, month - 1, day);
        }
        
        if (dateString instanceof Date) {
          return dateString;
        }
        
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
      } catch (error) {
        return null;
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'No disponible';
      try {
        const date = this.parseLocalDate(dateString);
        if (!date || isNaN(date.getTime())) return 'Fecha inválida';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      } catch (error) {
        return 'Error';
      }
    },

    async getRequestDetailsByOrderId(orderId) {
      this.isLoading = true;
      this.hasError = false;
      this.loadingStep = 0;
      this.simulateLoadingProgress();
      
      try {
        const response = await this.verificationRequestsApi.getById(orderId);
        this.item = new VerificationRequest(response.data);
        this.loadingStep = this.loadingSteps.length;
        await new Promise(resolve => setTimeout(resolve, 300));
        this.isLoading = false;
        console.log('Solicitud cargada:', this.item.orderCode);
      } catch (error) {
        console.error('Error al obtener detalles de la solicitud:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Error al cargar los detalles de la solicitud. Por favor, intente nuevamente.';
      }
    },

    simulateLoadingProgress() {
      this.clearLoadingInterval();
      this.loadingProgressInterval = setInterval(() => {
        if (this.loadingStep < this.loadingSteps.length - 1) {
          this.loadingStep++;
        } else {
          this.clearLoadingInterval();
        }
      }, 600);
      setTimeout(() => this.clearLoadingInterval(), 4000);
    },

    clearLoadingInterval() {
      if (this.loadingProgressInterval) {
        clearInterval(this.loadingProgressInterval);
        this.loadingProgressInterval = null;
      }
    },

    getStatusColor(status) {
      return STATUS_COLORS[status] || '#E0E0E0';
    },

    shouldUseWhiteText(status) {
      return STATUS_WHITE_TEXT.includes(status);
    },

    handleSubsanarObservation(observation) {
      this.currentObservation = observation;
      this.editModeEnabled = true;

      this.showToast({
        severity: 'info',
        summary: 'Modo edición activado',
        detail: `Puedes editar los campos necesarios para subsanar la observación: ${this.getObservationTypeLabel(observation.observationType)}`,
        life: 5000
      });

      this.$nextTick(() => {
        const sectionName = OBSERVATION_SECTION_MAP[observation.observationType] || 'client-details';
        const targetSection = document.querySelector(`[data-section="${sectionName}"]`);
        
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    },

    getObservationTypeLabel(type) {
      return OBSERVATION_TYPE_LABELS[type] || type;
    },

    cancelEditMode() {
      Object.assign(this, { editModeEnabled: false, currentObservation: null });
    },

    // Guardar cambios de subsanación (método principal orquestador)
    async saveSubsanacion() {
      try {
        // Validaciones iniciales
        const validationError = this.validateSubsanacion();
        if (validationError) {
          this.showToast({
            severity: 'error',
            summary: 'Error de validación',
            detail: validationError,
            life: 3000
          });
          return;
        }

        const clientComponent = this.$refs.clientDetailsComponent;
        const documentsComponent = this.$refs.documentsDetailsComponent;

        this.showToast({
          severity: 'info',
          summary: 'Procesando subsanación',
          detail: 'Guardando los cambios realizados...',
          life: 2000
        });

        // 1. Actualizar detalles de la orden (PATCH)
        const orderDetailsPayload = this.buildOrderDetailsPayload(clientComponent);
        await this.requestObservationsApiService.updateOrderDetails(this.item.id, orderDetailsPayload);

        // 2. Actualizar documentos si existen archivos seleccionados
        await this.updateDocumentsFromComponent(documentsComponent);

        // 3. Actualizar la observación a RESUELTA
        await this.updateObservationStatusToResolved();

        // 4. Limpiar selecciones de archivos
        this.clearDocumentSelections(documentsComponent);

        // 5. Mensaje de éxito y recarga
        this.showToast('success', 'Subsanación guardada', 'Los cambios se han guardado correctamente y la observación ha sido resuelta');

        this.cancelEditMode();
        await this.getRequestDetailsByOrderId(this.item.id);

      } catch (error) {
        console.error('Error al guardar la subsanación:', error);
        const errorMessage = this.getSubsanacionErrorMessage(error);

        this.showToast('error', 'Error al guardar', errorMessage);
      }
    },

    // =============================
    // HELPERS: saveSubsanacion
    // =============================

    // Validar que existen los datos necesarios para guardar la subsanación
    validateSubsanacion() {
      if (!this.item || !this.item.id) {
        return 'No se encontró la solicitud para actualizar';
      }
      if (!this.currentObservation) {
        return 'No se encontró la observación a subsanar';
      }
      return null;
    },

    // Construir el payload para actualizar los detalles de la orden
    buildOrderDetailsPayload(clientComponent) {
      const locationComponent = this.$refs.locationDetailsComponent;
      const landlordComponent = this.$refs.landlordDetailsComponent;

      const payload = {
        applicantCompany: {
          applicantCompanyId: this.item.applicantCompany?.applicantCompanyId || 0,
          companyName: this.item.applicantCompany?.companyName || '',
          executiveName: this.item.applicantCompany?.executiveName || '',
          ruc: this.item.applicantCompany?.ruc || '',
          corporateEmail: this.item.applicantCompany?.corporateEmail || '',
          contactPhoneNumber: this.item.applicantCompany?.contactPhoneNumber || ''
        },
        client: {
          name: clientComponent?.localClient?.name || this.item.client?.name || '',
          lastName: clientComponent?.localClient?.lastName || this.item.client?.lastName || '',
          phoneNumber: clientComponent?.localClient?.phoneNumber || this.item.client?.phoneNumber || '',
          isTenant: this.item.client?.isTenant || false,
          landlord: this.item.client?.isTenant ? {
            fullName: landlordComponent?.localLandlord?.fullName || this.item.client?.landlord?.fullName || '',
            phoneNumber: landlordComponent?.localLandlord?.phoneNumber || this.item.client?.landlord?.phoneNumber || ''
          } : null,
          location: {
            department: this.item.client?.location?.department || '',
            province: this.item.client?.location?.province || '',
            district: this.item.client?.location?.district || '',
            homeAddress: this.item.client?.location?.homeAddress || '',
            mapLocation: locationComponent?.localLocation?.mapLocation || this.item.client?.location?.mapLocation || ''
          }
        }
      };

      return payload;
    },

    // Actualizar documentos desde el componente de documentos
    async updateDocumentsFromComponent(documentsComponent) {
      const selectedFiles = documentsComponent?.selectedFiles || {};
      const documentIds = Object.keys(selectedFiles);

      if (documentIds.length === 0) {
        return;
      }

      for (const documentId of documentIds) {
        const file = selectedFiles[documentId];
        const originalDocument = this.item.client?.documents?.find(doc => doc.id === parseInt(documentId, 10));

        if (!originalDocument) {
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', originalDocument.type || '');

        await this.requestObservationsApiService.updateDocument(this.item.id, documentId, formData);
      }
    },

    // Actualizar el estado de la observación a RESUELTA
    async updateObservationStatusToResolved() {
      if (!this.currentObservation?.id) {
        return;
      }

      const observationPayload = {
        observationType: this.currentObservation.observationType,
        description: this.currentObservation.description,
        status: 'RESUELTA'
      };

      await this.requestObservationsApiService.updateObservation(
        this.item.id,
        this.currentObservation.id,
        observationPayload
      );
    },

    clearDocumentSelections(documentsComponent) {
      if (!documentsComponent) return;
      Object.assign(documentsComponent, { selectedFiles: {}, previewUrls: {} });
    },

    getSubsanacionErrorMessage(error) {
      if (!error.response) return 'No se pudieron guardar los cambios. Por favor, intente nuevamente.';
      
      const { status, data } = error.response;
      const backendMessage = data?.message || '';
      
      if (backendMessage) return backendMessage;
      if (status === 400) return 'Los datos ingresados no son válidos. Por favor, verifique la información.';
      if (status === 404) return 'No se encontró la solicitud o el documento a actualizar.';
      if (status === 500) return 'Error en el servidor. Por favor, contacte al administrador.';
      
      return 'No se pudieron guardar los cambios. Por favor, intente nuevamente.';
    },

    // =============================
    // FIN HELPERS: saveSubsanacion
    // =============================

    // Descargar o imprimir el reporte de verificación en formato PDF
    downloadReport() {
      // Validar que tenemos una solicitud válida
      if (!this.item || !this.item.reportId) {
        this.showToast({
          severity: 'warn',
          summary: 'Reporte no disponible',
          detail: 'No se puede descargar el reporte porque la solicitud no está cargada. Por favor, recargue la página e intente nuevamente.',
          life: 4000
        });
        return;
      }

      // Validar si falta la entrevista con el arrendador (solo si es inquilino)
      if (this.item.client?.isTenant && this.item.status === 'ENTREVISTA_ARRENDADOR_FALTANTE') {
        this.showToast({
          severity: 'warn',
          summary: 'Entrevista pendiente',
          detail: 'El verificador debe completar la entrevista con el arrendador antes de generar el informe. Por favor, espere a que el verificador complete esta información.',
          life: 6000
        });
        return;
      }

      // Mostrar mensaje de preparación
      this.showToast({
        severity: 'info',
        summary: 'Preparando descarga',
        detail: 'Estamos preparando su documento...',
        life: 3000
      });

      // Obtener el ID del reporte
      const reportId = this.item.reportId;

      // Obtener la URL de descarga del reporte
      this.downloadReportApiService.getReportDownloadUrl(reportId)
        .then(response => {
          console.log('Respuesta del servidor (download-url):', response.data);

          // Crear instancia del modelo con los datos recibidos
          this.downloadReportData = new DownloadReport(response.data);

          // Verificar si la URL es null (reporte no generado aún)
          if (!this.downloadReportData.reportUrl || this.downloadReportData.reportUrl === null) {
            console.log('URL de descarga es null. Generando reporte...');
            
            // Mostrar mensaje de generación
            this.showToast({
              severity: 'info',
              summary: 'Generando reporte',
              detail: 'El reporte no ha sido generado previamente. Generando PDF, por favor espere...',
              life: 4000
            });

            // Generar el reporte
            return this.downloadReportApiService.generateVerificationReport(reportId)
              .then(generateResponse => {
                console.log('Reporte generado exitosamente:', generateResponse.data);
                
                // Volver a obtener la URL de descarga después de generar
                return this.downloadReportApiService.getReportDownloadUrl(reportId);
              })
              .then(retryResponse => {
                console.log('Respuesta del servidor (retry download-url):', retryResponse.data);
                
                // Actualizar con la nueva URL
                this.downloadReportData = new DownloadReport(retryResponse.data);
                
                // Verificar nuevamente que se recibió una URL válida
                if (!this.downloadReportData.reportUrl) {
                  throw new Error('No se pudo generar la URL de descarga después de crear el reporte');
                }
                
                // Abrir el PDF en una nueva pestaña del navegador
                window.open(this.downloadReportData.reportUrl, '_blank');

                // Mostrar mensaje de éxito
                this.showToast({
                  severity: 'success',
                  summary: 'Reporte generado y descargado',
                  detail: 'El reporte se ha generado y abierto correctamente.',
                  life: 3000
                });

                console.log('URL del reporte generado:', this.downloadReportData.reportUrl);
              });
          }

          // Si ya existe URL, abrir directamente
          window.open(this.downloadReportData.reportUrl, '_blank');

          // Mostrar mensaje de éxito
          this.showToast({
            severity: 'success',
            summary: 'Documento descargado',
            detail: 'El reporte se ha abierto correctamente.',
            life: 3000
          });

          console.log('URL del reporte:', this.downloadReportData.reportUrl);
        })
        .catch(error => {
          console.error('Error al obtener el reporte:', error);

          // Procesar el error para mostrar un mensaje amigable
          const errorMessage = this.getDownloadErrorMessage(error);

          this.showToast({
            severity: 'error',
            summary: 'Error al descargar',
            detail: errorMessage,
            life: 6000
          });
        });
    },

    // Función para traducir errores de descarga a mensajes amigables
    getDownloadErrorMessage(error) {
      const backendMessage = error.response?.data?.message || error.message || '';
      const statusCode = error.response?.status;

      // Errores específicos
      if (backendMessage.includes('not found') || statusCode === 404) {
        return 'El reporte solicitado no existe. Por favor, verifique que la solicitud esté completada correctamente.';
      }

      if (backendMessage.includes('template') || backendMessage.includes('generate')) {
        return 'Error al generar el documento PDF. Por favor, verifique que todos los datos de la solicitud estén completos.';
      }

      if (backendMessage.includes('timeout')) {
        return 'El tiempo de espera se agotó al generar el documento. Por favor, intente nuevamente.';
      }

      // Errores por código HTTP
      switch (statusCode) {
        case 400:
          return 'Los datos de la solicitud no son válidos para generar el PDF. Por favor, verifique la información.';
        case 401:
          return 'No tiene autorización para descargar este reporte. Por favor, contacte al administrador.';
        case 403:
          return 'No tiene permisos suficientes para descargar este reporte. Contacte al administrador.';
        case 500:
          return 'Error interno del servidor al generar el PDF. Por favor, intente nuevamente en unos momentos.';
        case 503:
          return 'El servicio de generación de PDF no está disponible temporalmente. Por favor, intente más tarde.';
        default:
          break;
      }

      // Mensaje genérico
      return 'No se pudo generar el reporte PDF. Por favor, intente nuevamente. Si el problema persiste, contacte al administrador.';
    }
  },

  created() {
    const orderId = this.$route.query.id;
    this.getRequestDetailsByOrderId(orderId);
  },

  beforeUnmount() {
    this.clearLoadingInterval();
  }
}
</script>

<template>
  <pv-toast />
  
  <div class="request-container flex flex-column p-4 h-full w-full overflow-auto">

    <!-- Breadcrumb -->
    <div class="text-base mb-3">
      <router-link
          :to="{ name: 'my-service-orders' }"
          class="font-bold text-gray-900 no-underline hover:underline cursor-pointer"
      >
        Solicitudes de verificación
      </router-link>
      <span class="text-gray-500 font-bold"> / </span>
      <span class="text-blue-700 font-bold hover:underline cursor-pointer">
        Detalle de la solicitud
      </span>
    </div>

    <!-- Cabecera con código y fecha -->
    <div class="flex align-content-center justify-content-between mt-4 mb-2" v-if="item">
      <h2 class="text-2xl xl:font-bold font-extrabold text-gray-900">
        Solicitud: <span class="text-blue-700 xl:font-bold">{{ item.orderCode || 'No disponible' }}</span>
      </h2>
      <div class="flex flex-column align-items-end gap-2">
        <span class="font-medium text-gray-900">
          Fecha de solicitud: {{ formatDate(item.requestDate) }}
        </span>
        <div class="flex align-items-center gap-2">
          <span 
            class="status-tag"
            :style="{
              backgroundColor: getStatusColor(item.status),
              color: shouldUseWhiteText(item.status) ? '#FFFFFF' : '#000000'
            }"
          >
            {{ item.status.replace(/_/g, ' ') }}
          </span>
          <pv-button
            v-if="item.status === 'COMPLETADA'"
            icon="pi pi-download"
            label="Descargar reporte"
            class="p-button-success p-button-sm"
            @click="downloadReport"
          />
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-content">
        <pv-progress-spinner 
          size="48" 
          stroke-width="4" 
          animation-duration="1.2s" 
          class="loading-spinner"
        />
        <div class="loading-text">
          <h3 class="loading-title">Cargando solicitud de verificación</h3>
          <p class="loading-subtitle">{{ loadingSteps[loadingStep]?.label || 'Preparando datos...' }}</p>
        </div>
      </div>
    </div>

    <!-- Estado de error -->
    <div v-else-if="hasError" class="flex justify-content-center align-items-center h-20rem">
      <pv-message severity="error" :closable="false">
        <template #default>
          <div class="flex flex-column align-items-center">
            <i class="pi pi-exclamation-triangle text-4xl mb-3"></i>
            <span>{{ errorMessage }}</span>
            <pv-button 
              label="Reintentar" 
              icon="pi pi-refresh" 
              class="mt-3"
              @click="getRequestDetailsByOrderId($route.query.id)"
            />
          </div>
        </template>
      </pv-message>
    </div>

    <!-- Contenido principal -->
    <div v-else-if="item" class="request-content flex flex-column gap-4">

      <!-- Banner de modo edición -->
      <pv-message v-if="editModeEnabled" severity="warn" :closable="false">
        <template #default>
          <div class="flex flex-wrap justify-content-between align-items-center w-full gap-3">
            <div class="flex align-items-center gap-2 flex-1">
              <i class="pi pi-pencil text-xl"></i>
              <div>
                <strong>Modo edición activo</strong>
                <p class="m-0 mt-1">Subsanando observación: {{ getObservationTypeLabel(currentObservation?.observationType) }}</p>
              </div>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <pv-button
                label="Guardar cambios"
                icon="pi pi-check"
                class="p-button-success"
                @click="saveSubsanacion"
              />
              <pv-button
                label="Cancelar"
                icon="pi pi-times"
                class="p-button-secondary"
                @click="cancelEditMode"
              />
            </div>
          </div>
        </template>
      </pv-message>

      <!-- Observaciones -->
      <request-observations-details
        :observations="item.observations"
        @subsanar-observation="handleSubsanarObservation"
      />

      <!-- Datos del solicitante -->
      <request-applicant-details :applicant-company="item.applicantCompany" />

      <!-- Datos del cliente -->
      <div data-section="client-details">
        <request-client-details
          ref="clientDetailsComponent"
          :client="item.client"
          :edit-mode="editModeEnabled"
          :observation-type="currentObservation?.observationType"
        />
      </div>

      <!-- Datos de domicilio -->
      <div data-section="location-details">
        <request-location-details
          ref="locationDetailsComponent"
          :location="item.client?.location"
          :edit-mode="editModeEnabled"
          :observation-type="currentObservation?.observationType"
        />
      </div>

      <!-- Documentos adjuntos -->
      <div data-section="documents-details">
        <request-documents-details
          ref="documentsDetailsComponent"
          :documents="item.client?.documents"
          :edit-mode="editModeEnabled"
          :observation-type="currentObservation?.observationType"
        />
      </div>

      <!-- Datos del arrendador -->
      <div data-section="landlord-details">
        <request-landlord-details
          ref="landlordDetailsComponent"
          :landlord="item.client?.landlord"
          :is-tenant="item.client?.isTenant"
          :edit-mode="editModeEnabled"
          :observation-type="currentObservation?.observationType"
        />
      </div>

    </div>

  </div>

</template>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  background: #fafafa;
  border-radius: 8px;
  margin: 1rem 0;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
}

.loading-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.loading-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
}

/* Estilos para el banner de modo edición */
:deep(.p-message .p-message-wrapper) {
  width: 100%;
}

:deep(.p-message .p-message-wrapper .p-message-text) {
  width: 100%;
}

@media (max-width: 768px) {
  .loading-container {
    min-height: 40vh;
  }
  
  .card-header :deep(.p-button) {
    flex: 1;
  }
}
</style>