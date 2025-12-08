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
      // Servicios API
      verificationRequestsApi: null,
      requestObservationsApiService: null,
      downloadReportApiService: null,

      // Item de la solicitud
      item: null,

      // Datos del reporte generado
      reportData: null,

      // Estados de carga
      isLoading: true,
      hasError: false,
      errorMessage: '',
      
      // Progreso de carga
      loadingStep: 0,
      loadingSteps: [
        { icon: 'pi-file-o', label: 'Datos de la solicitud' },
        { icon: 'pi-users', label: 'Información del cliente' },
        { icon: 'pi-building', label: 'Datos del solicitante' }
      ],

      // Estados de modo edición para subsanar observaciones
      editModeEnabled: false,
      currentObservation: null
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

    // Formatear fecha para visualización
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

    // Obtener detalles de la solicitud por ID
    getRequestDetailsByOrderId(orderId) {
      this.isLoading = true;
      this.hasError = false;
      this.loadingStep = 0;
      
      this.simulateLoadingProgress();
      
      this.verificationRequestsApi.getById(orderId).then(response => {
        this.item = new VerificationRequest(response.data);
        this.loadingStep = this.loadingSteps.length;
        
        setTimeout(() => {
          this.isLoading = false;
          console.log('Solicitud cargada:', this.item.orderCode);
        }, 300);
      })
      .catch(error => {
        console.error('Error al obtener detalles de la solicitud:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Error al cargar los detalles de la solicitud. Por favor, intente nuevamente.';
      });
    },

    simulateLoadingProgress() {
      const progressInterval = setInterval(() => {
        if (this.loadingStep < this.loadingSteps.length - 1) {
          this.loadingStep++;
        } else {
          clearInterval(progressInterval);
        }
      }, 600);
      
      setTimeout(() => {
        clearInterval(progressInterval);
      }, 4000);
    },

    // Retorna el color personalizado para el estado
    getStatusColor(status) {
      switch (status) {
        case 'PENDIENTE':
          return '#A8A8A8';
        case 'ASIGNADO':
          return '#1976D2';
        case 'EN_PROCESO':
          return '#FFC107';
        case 'COMPLETADA':
          return '#4CAF50';
        case 'CANCELADA':
          return '#D32F2F';
        case 'OBSERVADO':
          return '#FB8C00';
        case 'SUBSANADA':
          return '#66BB6A';
        case 'ENTREVISTA_ARRENDADOR_FALTANTE':
          return '#9C27B0';
        default:
          return '#E0E0E0';
      }
    },

    shouldUseWhiteText(status) {
      return ['ASIGNADO', 'COMPLETADA', 'CANCELADA', 'OBSERVADO', 'SUBSANADA', 'ENTREVISTA_ARRENDADOR_FALTANTE'].includes(status);
    },

    // Manejar subsanación de observación - Habilitar modo edición
    handleSubsanarObservation(observation) {
      // Guardar la observación actual
      this.currentObservation = observation;

      // Habilitar modo edición
      this.editModeEnabled = true;

      // Mostrar mensaje informativo
      this.showToast({
        severity: 'info',
        summary: 'Modo edición activado',
        detail: `Puedes editar los campos necesarios para subsanar la observación: ${this.getObservationTypeLabel(observation.observationType)}`,
        life: 5000
      });

      // Scroll a la sección correspondiente según el tipo de observación
      this.$nextTick(() => {
        if (observation.observationType === 'DOCUMENTO_IDENTIDAD') {
          // Scroll a la sección de datos del cliente
          const clientSection = document.querySelector('[data-section="client-details"]');
          if (clientSection) {
            clientSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else if (observation.observationType === 'RECIBO_SERVICIO') {
          // Scroll a la sección de documentos
          const documentsSection = document.querySelector('[data-section="documents-details"]');
          if (documentsSection) {
            documentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    },

    // Obtener etiqueta del tipo de observación
    getObservationTypeLabel(type) {
      const labels = {
        'DOCUMENTO_IDENTIDAD': 'Documento de identidad',
        'RECIBO_SERVICIO': 'Recibo de servicio'
      };
      return labels[type] || type;
    },

    // Cancelar modo edición
    cancelEditMode() {
      this.editModeEnabled = false;
      this.currentObservation = null;
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
            fullName: this.item.client?.landlord?.fullName || '',
            phoneNumber: this.item.client?.landlord?.phoneNumber || ''
          } : null,
          location: {
            department: this.item.client?.location?.department || '',
            province: this.item.client?.location?.province || '',
            district: this.item.client?.location?.district || '',
            homeAddress: this.item.client?.location?.homeAddress || '',
            mapLocation: this.item.client?.location?.mapLocation || ''
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

    // Limpiar archivos seleccionados en el componente de documentos
    clearDocumentSelections(documentsComponent) {
      if (!documentsComponent) return;

      documentsComponent.selectedFiles = {};
      documentsComponent.previewUrls = {};
    },

    // Obtener mensaje de error específico para subsanación
    getSubsanacionErrorMessage(error) {
      let errorMessage = 'No se pudieron guardar los cambios. Por favor, intente nuevamente.';

      if (error.response) {
        const status = error.response.status;
        const backendMessage = error.response.data?.message || '';

        if (status === 400) {
          errorMessage = 'Los datos ingresados no son válidos. Por favor, verifique la información.';
        } else if (status === 404) {
          errorMessage = 'No se encontró la solicitud o el documento a actualizar.';
        } else if (status === 500) {
          errorMessage = 'Error en el servidor. Por favor, contacte al administrador.';
        } else if (backendMessage) {
          errorMessage = backendMessage;
        }
      }

      return errorMessage;
    },

    // =============================
    // FIN HELPERS: saveSubsanacion
    // =============================

    // Descargar reporte de verificación en PDF
    downloadReport() {
      // Validar que tenemos una solicitud válida
      if (!this.item || !this.item.reportId) {
        this.showToast({
          severity: 'warn',
          summary: 'Solicitud no disponible',
          detail: 'No se puede descargar el reporte porque la solicitud no está cargada. Por favor, recargue la página e intente nuevamente.',
          life: 4000
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

      // Obtener la URL de descarga del reporte
      this.downloadReportApiService.getReportDownloadUrl(this.item.reportId)
        .then(response => {
          console.log('Respuesta del servidor:', response.data);

          // Crear instancia del modelo con los datos recibidos
          this.reportData = new DownloadReport(response.data);

          // Verificar que se recibió una URL válida
          if (!this.reportData.reportUrl) {
            throw new Error('El servidor no proporcionó una URL de descarga válida');
          }

          // Abrir el PDF en una nueva pestaña del navegador
          window.open(this.reportData.reportUrl, '_blank');

          // Mostrar mensaje de éxito
          this.showToast({
            severity: 'success',
            summary: 'Documento descargado',
            detail: 'El reporte se ha abierto correctamente.',
            life: 3000
          });

          console.log('URL del reporte:', this.reportData.reportUrl);
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

    this.verificationRequestsApi = new VerificationRequestsApi('/orders');
    this.requestObservationsApiService = new RequestObservationsApiService('/orders');
    this.downloadReportApiService = new DownloadReportApiService('/reports');
    this.getRequestDetailsByOrderId(orderId);
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
        />
      </div>

      <!-- Datos de domicilio -->
      <request-location-details :location="item.client?.location" />

      <!-- Documentos adjuntos -->
      <div data-section="documents-details">
        <request-documents-details
          ref="documentsDetailsComponent"
          :documents="item.client?.documents"
          :edit-mode="editModeEnabled"
        />
      </div>

      <!-- Datos del arrendador -->
      <request-landlord-details
        :landlord="item.client?.landlord"
        :is-tenant="item.client?.isTenant"
      />

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