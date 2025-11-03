<script>
import {VerificationRequestsApi} from "../services/verification-requests-api.service.js";
import {DownloadReportApiService} from "../../../tracker-mobility/verification-reports/services/download-report-api.service.js";
import {VerificationRequest} from "../models/verification-request.entity.js";
import RequestApplicantDetails from "../components/request-applicant-details.component.vue";
import RequestClientDetails from "../components/request-client-details.component.vue";
import RequestLocationDetails from "../components/request-location-details.component.vue";
import RequestLandlordDetails from "../components/request-landlord-details.component.vue";
import RequestDocumentsDetails from "../components/request-documents-details.component.vue";
import RequestObservationsDetails from "../components/request-observations-details.component.vue";

export default {
  name: 'verification-request-details',

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
      downloadReportApiService: null,

      // Item de la solicitud
      item: null,

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
        console.error('Error al parsear fecha:', error);
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
        console.error('Error al formatear fecha:', error);
        return 'Error';
      }
    },

    // Obtener detalles de la solicitud por ID
    getRequestDetailsByOrderId(orderId) {
      console.log(`Obtener detalles de la solicitud con ID: `, orderId);
      
      this.isLoading = true;
      this.hasError = false;
      this.loadingStep = 0;
      
      this.simulateLoadingProgress();
      
      this.verificationRequestsApi.getById(orderId).then(response => {
        this.item = new VerificationRequest(response.data);
        this.loadingStep = this.loadingSteps.length;
        
        setTimeout(() => {
          this.isLoading = false;
          console.log('Detalles de la solicitud obtenidos:', this.item);
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

    getStatusSeverity(status) {
      switch (status) {
        case 'PENDIENTE':
          return 'warn';
        case 'ASIGNADO':
          return 'info';
        case 'EN_PROCESO':
          return 'info';
        case 'FINALIZADO':
          return 'success';
        default:
          return 'info';
      }
    },

    // Manejar subsanación de observación - Habilitar modo edición
    handleSubsanarObservation(observation) {
      console.log('Habilitando modo edición para subsanar observación:', observation);

      // Guardar la observación actual
      this.currentObservation = observation;

      // Habilitar modo edición
      this.editModeEnabled = true;

      // Mostrar mensaje informativo
      this.$toast.add({
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

    // Guardar cambios de subsanación
    async saveSubsanacion() {
      console.log('Guardando cambios de subsanación...', this.currentObservation);

      // Obtener componentes con datos editados
      const clientComponent = this.$refs.clientDetailsComponent;
      const documentsComponent = this.$refs.documentsDetailsComponent;

      console.log('Datos del cliente editados:', clientComponent?.localClient);
      console.log('Archivos seleccionados:', documentsComponent?.selectedFiles);

      // TODO: Implementar lógica para subsanar la observación
      // 1. Validar datos editados
      // 2. Preparar estructura de datos según API (ver estructura en comentario abajo)
      // 3. Enviar con FormData si hay archivos, o JSON si solo hay datos
      // 4. Usar: await this.verificationRequestsApi.update(this.item.id, data)
      // 5. Actualizar estado de la observación a 'RESUELTA'
      // 6. Recargar datos: await this.getRequestDetailsByOrderId(this.item.id)
      // 7. Desactivar modo edición y limpiar archivos

      /* Estructura esperada por el backend PATCH /orders/{id}:
      {
        "client": {
          "name": "María",
          "lastName": "López",
          "phoneNumber": "923456789",
          "identityDocument": {
            "documentType": "DNI",
            "documentNumber": "12345678"
          }
        }
      }

      Para archivos usar FormData:
      formData.append('order', new Blob([JSON.stringify(orderData)], { type: 'application/json' }));
      formData.append('files', file);
      */

      this.$toast.add({
        severity: 'info',
        summary: 'Funcionalidad pendiente',
        detail: 'La lógica de guardado está pendiente de implementación',
        life: 3000
      });
    },

    // Descargar reporte de verificación en PDF
    downloadReport() {
      // Validar que tenemos una solicitud válida
      if (!this.item || !this.item.id) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Solicitud no disponible',
          detail: 'No se puede descargar el reporte porque la solicitud no está cargada. Por favor, recargue la página e intente nuevamente.',
          life: 4000
        });
        return;
      }

      // Mostrar mensaje de progreso
      this.$toast.add({
        severity: 'info',
        summary: 'Generando reporte PDF',
        detail: 'Estamos preparando el documento. Esto puede tomar unos segundos.',
        life: 3000
      });

      // Llamar al servicio para generar el reporte usando POST
      this.downloadReportApiService.downloadReport(this.item.id)
        .then(response => {
          console.log('Respuesta del servidor:', response.data);

          // Verificar que la respuesta contenga la URL del reporte
          if (response.data && response.data.reportUrl) {
            const reportUrl = response.data.reportUrl;

            // Abrir el PDF en una nueva pestaña
            window.open(reportUrl, '_blank');

            this.$toast.add({
              severity: 'success',
              summary: 'Reporte generado exitosamente',
              detail: 'El documento PDF se abrirá en una nueva pestaña. Puede descargarlo o imprimirlo desde allí.',
              life: 5000
            });
          } else {
            // Si no hay URL en la respuesta
            this.$toast.add({
              severity: 'error',
              summary: 'Error al generar el reporte',
              detail: 'No se recibió la URL del documento. Por favor, intente nuevamente.',
              life: 5000
            });
          }
        })
        .catch(error => {
          console.error('Error al generar el reporte:', error);

          // Procesar el error para mostrar un mensaje amigable
          const errorMessage = this.getDownloadErrorMessage(error);

          this.$toast.add({
            severity: 'error',
            summary: 'No se pudo generar el reporte',
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
    console.log(`Cargar detalles de la solicitud con ID: ${orderId}`);

    this.verificationRequestsApi = new VerificationRequestsApi('/orders');
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
          <pv-tag
            :value="item.status"
            :severity="getStatusSeverity(item.status)"
            class="text-sm"
          />
          <pv-button
            v-if="item.status === 'FINALIZADO'"
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