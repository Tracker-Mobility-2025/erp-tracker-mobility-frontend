<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import useVerificationReportStore from '../../application/verification-report.store.js';
import { useNotification } from '../../../shared-v2/composables/use-notification.js';
import { ReportApi } from '../../infrastructure/report.api.js';
import Toolbar from '../../../shared-v2/presentation/components/toolbar.vue';

// Import all report card components
import VerificationInfoCard from '../components/verification-info-card.vue';
import ApplicantClientInfoCard from '../components/applicant-client-info-card.vue';
import AddressInfoCard from '../components/address-info-card.vue';
import InterviewDetailsCard from '../components/interview-details-card.vue';
import ContactReferencesCard from '../components/contact-references-card.vue';
import LandlordInterviewCard from '../components/landlord-interview-card.vue';
import ObservationsCard from '../components/observations-card.vue';
import SummaryCard from '../components/summary-card.vue';
import GlossaryCard from '../components/glossary-card.vue';
import CasuisticsCard from '../components/casuistics-card.vue';

import AnnexePhotographicRegistry from '../components/annexe-photographic-registry.vue';
import EmailSendDialog from '../components/email-send-dialog.vue';

// Composables
const route = useRoute();
const reportStore = useVerificationReportStore();
const reportApi = new ReportApi();
const { showSuccess, showError } = useNotification();

// State
const report = ref(null);
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');
const emailDialogVisible = ref(false);
const landlordInterviewCardRef = ref(null);
const isDownloadingReport = ref(false);

// Computed
const canExportPDF = computed(() => {
  if (!report.value) return false;
  // No permitir exportación si falta la entrevista con el arrendador o no hay reportId
  return report.value.finalResult !== 'ENTREVISTA_ARRENDADOR_FALTANTE' && 
         !!report.value.reportId;
});

const canEditInterview = computed(() => {
  if (!report.value) return false;
  // Permitir edición si el resultado es ENTREVISTA_ARRENDADOR_FALTANTE
  return report.value.finalResult === 'ENTREVISTA_ARRENDADOR_FALTANTE';
});

const isEditBlockedByFinalResult = computed(() => {
  if (!report.value) return false;
  // Bloquear si hay resultado final diferente a ENTREVISTA_ARRENDADOR_FALTANTE
  return !!report.value.finalResult && report.value.finalResult !== 'ENTREVISTA_ARRENDADOR_FALTANTE';
});

const showInterviewAlert = computed(() => {
  return report.value?.finalResult === 'ENTREVISTA_ARRENDADOR_FALTANTE';
});

// Loading steps
const loadingStep = ref(0);
const loadingSteps = [
  { icon: 'pi-file', label: 'Cargando reporte' },
  { icon: 'pi-images', label: 'Cargando anexos' },
  { icon: 'pi-check', label: 'Completado' }
];

// Methods
const getReportById = async (reportId) => {
  try {
    const result = await reportStore.fetchById(reportId);
    
    if (result.success && result.data) {
      report.value = result.data;
      isLoading.value = false;
    } else {
      throw new Error(result.message || 'Reporte no encontrado');
    }
  } catch (error) {
    console.error('Error al recuperar reporte:', error);
    hasError.value = true;
    isLoading.value = false;
    errorMessage.value = error.message || 'No se pudo cargar el reporte. Intente nuevamente.';
  }
};

const clearData = () => {
  // Limpiar datos SÍNCRONAMENTE (inmediato, sin await)
  report.value = null;
  hasError.value = false;
  errorMessage.value = '';
  loadingStep.value = 0;
  emailDialogVisible.value = false;
};

const loadData = async (reportId) => {
  if (!reportId) {
    hasError.value = true;
    isLoading.value = false;
    errorMessage.value = 'ID de reporte no proporcionado';
    return;
  }
  
  isLoading.value = true;
  await getReportById(reportId);
};

const retryLoading = () => {
  const reportId = route.params.reportId;
  hasError.value = false;
  clearData();
  loadData(reportId);
};

const handleViewPhoto = (photo) => {
  // TODO: Implementar visualizador de fotos
  console.log('Ver foto:', photo);
};

const handleViewAnnex = (annex) => {
  // TODO: Implementar visualizador de anexos
  console.log('Ver anexo:', annex);
};

const handleDownloadAnnex = (annex) => {
  // TODO: Implementar descarga de anexos
  console.log('Descargar anexo:', annex);
};

const handleSendEmail = () => {
  emailDialogVisible.value = true;
};

const handleEmailSaveRequested = async (emailData) => {
  // TODO: Implementar envío de email
  console.log('Enviar email:', emailData);
  showSuccess('Email enviado exitosamente', 'Éxito');
  emailDialogVisible.value = false;
};

const handleEmailCancelRequested = () => {
  emailDialogVisible.value = false;
};

const handleExportPDF = async () => {
  // Validar si falta la entrevista con el arrendador
  if (report.value?.finalResult === 'ENTREVISTA_ARRENDADOR_FALTANTE') {
    showError(
      'Debe completar la entrevista con el arrendador antes de descargar el informe. Por favor, complete los datos de la entrevista en la sección "Detalles de la entrevista" y vuelva a intentarlo.',
      'Entrevista pendiente',
      6000
    );
    return;
  }

  if (!report.value?.reportId) {
    showError('No se puede descargar el reporte: ID de reporte no disponible');
    return;
  }

  isDownloadingReport.value = true;
  
  try {
    // Obtener URL de descarga del reporte
    const response = await reportApi.getReportDownloadUrl(report.value.reportId);
    
    // El backend retorna { reportId, reportUrl }
    const downloadUrl = response.data?.reportUrl;
    
    if (!downloadUrl) {
      showError('No se pudo obtener la URL de descarga del reporte');
      return;
    }
    
    // Abrir URL en nueva pestaña para descargar
    window.open(downloadUrl, '_blank');
    
    showSuccess('Reporte descargado exitosamente', 'Descarga completada');
  } catch (error) {
    console.error('[ReportDetail] Error al descargar reporte:', error);
    showError('No se pudo descargar el reporte. Intente nuevamente.', 'Error de descarga');
  } finally {
    isDownloadingReport.value = false;
  }
};

const handleUpdateInterviewDetailsRequested = async (payload) => {
  try {
    isLoading.value = true;

    // Función para limpiar strings
    const cleanString = (v) => {
      if (v === null || v === undefined || v === '' || v === '-' || v === 'No especificado') {
        return '';
      }
      return String(v).trim();
    };

    // Obtener el orderId desde el reporte
    const orderId = report.value?.orderId;

    if (!orderId) {
      showError(
        'El backend no está enviando el orderId. Por favor, contacte al administrador del sistema.',
        'Error de configuración'
      );
      throw new Error('No se pudo obtener el ID de la orden desde el reporte');
    }

    // Preparar datos en el formato que espera el Command
    const commandData = {
      tenantName: cleanString(payload?.tenantName),
      ownHouse: cleanString(payload?.ownHouse),
      serviceClientPays: cleanString(payload?.serviceClientPays),
      clientPaysPunctual: cleanString(payload?.clientPaysPunctual),
      clientRentalTime: cleanString(payload?.clientRentalTime),
      clientFloorNumber: cleanString(payload?.clientFloorNumber),
      interviewObservation: cleanString(payload?.interviewObservation)
    };

    // Enviar actualización al backend (el store creará el Command)
    const result = await reportStore.updateLandlordInterview(orderId, commandData);

    if (result.success) {
      showSuccess('Entrevista con el arrendador actualizada exitosamente', 'Éxito');
      
      // Recargar todo el reporte para obtener los datos actualizados del backend
      await getReportById(route.params.reportId);
    } else {
      throw new Error(result.message || 'Error al actualizar la entrevista');
    }
  } catch (error) {
    console.error('Error al actualizar entrevista:', error);
    showError(
      error.message || 'No se pudo actualizar la entrevista. Intente nuevamente.',
      'Error al guardar'
    );
  } finally {
    isLoading.value = false;
  }
};

const scrollToInterviewCard = () => {
  if (landlordInterviewCardRef.value) {
    landlordInterviewCardRef.value.$el.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }
};

// Lifecycle
onMounted(async () => {
  const reportId = route.params.reportId;
  clearData();
  await loadData(reportId);
});

// Watch for route changes
watch(() => route.params.reportId, async (newId) => {
  if (newId) {
    clearData(); // Limpiar INMEDIATAMENTE (síncrono)
    await loadData(newId); // Luego cargar (asíncrono)
  }
});
</script>

<template>
  <div class="h-full w-full flex flex-column">
    <!-- Toolbar -->
    <toolbar
      :title="report ? `Reporte ${report.reportCode || 'N/A'}` : 'Detalle del Reporte'"
      :description="'Visualiza toda la información del reporte de verificación domiciliaria'"
      :show-back-button="true"
    >
      <template #actions>
        <pv-button
          v-if="!isLoading && !hasError"
          label="Enviar Email"
          icon="pi pi-envelope"
          class="p-button-outlined mr-2"
          @click="handleSendEmail"
        />
        <pv-button
          v-if="!isLoading && !hasError"
          label="Exportar PDF"
          icon="pi pi-file-pdf"
          class="p-button-outlined"
          :loading="isDownloadingReport"
          :disabled="!canExportPDF || isDownloadingReport"
          v-tooltip.top="!canExportPDF ? 'Complete la entrevista con el arrendador para exportar el PDF' : 'Exportar informe a PDF'"
          @click="handleExportPDF"
        />
      </template>
    </toolbar>

    <!-- Content -->
    <div class="flex-1 p-4 overflow-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-column align-items-center justify-content-center h-full">
        <pv-progress-spinner />
        <div class="mt-4 text-center">
          <div class="flex align-items-center gap-3 mb-3">
            <i :class="`pi ${loadingSteps[loadingStep].icon} text-2xl text-primary`"></i>
            <p class="text-xl font-semibold m-0">{{ loadingSteps[loadingStep].label }}</p>
          </div>
          <pv-progress-bar mode="indeterminate" style="height: 6px; width: 300px" />
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="flex flex-column align-items-center justify-content-center h-full">
        <i class="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
        <h2 class="text-2xl font-bold text-900 mb-2">Error al cargar el reporte</h2>
        <p class="text-lg text-600 mb-4">{{ errorMessage }}</p>
        <pv-button
          label="Reintentar"
          icon="pi pi-refresh"
          class="p-button-outlined"
          @click="retryLoading"
        />
      </div>

      <!-- Report Content -->
      <div v-else-if="report" class="flex flex-column gap-4">
        <!-- Alert: Entrevista con Arrendador Faltante -->
        <pv-message v-if="showInterviewAlert" severity="warn" :closable="false" class="mb-2">
          <div class="flex align-items-center w-full gap-4">
            <i class="pi pi-exclamation-triangle text-2xl"></i>
            <div class="flex-1">
              <p class="font-bold text-base m-0 mb-1">Entrevista con el Arrendador Pendiente</p>
              <p class="m-0 text-sm">Este reporte requiere que complete la entrevista con el arrendador antes de poder ser finalizado y exportado.</p>
            </div>
            <pv-button 
              label="Ir a la Entrevista" 
              icon="pi pi-arrow-down"
              class="p-button-warning ml-auto flex-shrink-0"
              @click="scrollToInterviewCard"
            />
          </div>
        </pv-message>

        <!-- Section 0: Verification Info (Highlighted) -->
        <verification-info-card
          :verifier="report.verifierName"
          :address-location="report.addressLocation"
          :visit-date="report.visitDate"
          :result="report.finalResult"
        />

        <!-- Section 1: Applicant & Client Info -->
        <applicant-client-info-card
          :company-name="report.companyName"
          :company-ruc="report.companyRuc"
          :company-executive-name="report.companyExecutiveName"
          :request-date="report.requestDate"
          :final-result="report.finalResult"
          :client-full-name="report.clientFullName"
          :client-interviewed-name="report.clientName"
          :clientRelation="report.residence?.livesWith"
          :client-document-type="report.clientDocumentType"
          :client-document-number="report.clientDocumentNumber"
        />

        <!-- Section 2: Address Info -->
        <address-info-card
          :department="report.addressDepartment"
          :province="report.addressProvince"
          :district="report.addressDistrict"
          :full-address="report.addressStreet"
          :verified-address="report.exactClientAddress"
        />

        <!-- Section 3: Interview Details -->
        <interview-details-card
          :lives-with="report.residence?.livesWith"
          :is-resident="report.residence?.isResident"
          :time-living-text="report.residence?.timeLivingText"
          :dwelling-type="report.dwelling?.dwellingType"
          :residence-type="report.dwelling?.residenceType"
          :apartment-information="report.dwelling?.apartmentInformation"
          :type-furnished="report.dwelling?.typeFurnished"
          :roof-type="report.dwelling?.roofType"
          :facade-color="report.dwelling?.facadeColor"
          :dwelling-material="report.dwelling?.dwellingMaterial"
          :dwelling-condition="report.dwelling?.dwellingCondition"
          :zone-type="report.zone?.zoneType"
          :zone-characteristics="report.zone?.zoneCharacteristics || []"
          :area-risk="report.zone?.areaRisk || []"
          :access-type="report.zone?.accessType"
          :garage-type="report.garage?.garageType"
          :distance-to-dwelling="report.garage?.distanceToDwelling"
        />

        <!-- Section 4: Contact References -->
        <contact-references-card
          :references="report.contactReferences || []"
          :landlord-name="report.landlordName"
          :landlord-phone="report.landlordPhoneNumber"
        />

        <!-- Section 5: Landlord Interview Details -->
        <landlord-interview-card
          ref="landlordInterviewCardRef"
          v-if="report.interviewDetails || report.finalResult === 'ENTREVISTA_ARRENDADOR_FALTANTE'"
          :client-name-according-to-landlord="report.interviewDetails?.clientNameAccordingToLandlord"
          :own-home="report.interviewDetails?.ownHome"
          :services-paid-by-client="report.interviewDetails?.servicesPaidByClient"
          :is-the-client-punctual-with-payments="report.interviewDetails?.isTheClientPunctualWithPayments"
          :time-living-according-to-landlord="report.interviewDetails?.timeLivingAccordingToLandlord"
          :floor-occupied-by-client="report.interviewDetails?.floorOccupiedByClient"
          :interview-observation="report.interviewDetails?.interviewObservation"
          :can-edit="canEditInterview"
          :blocked-by-final-result="isEditBlockedByFinalResult"
          @update-interview-details-requested="handleUpdateInterviewDetailsRequested"
        />

        <!-- Section 6: Summary -->
        <summary-card
          :summary="report.summary"
        />

        <!-- Section 7: Observations -->
        <observations-card
          :observations="report.observations || []"
        />

        <!-- Section 8: Glossary -->
        <glossary-card
          :glossary="report.glossary || []"
        />

        <!-- Section 9: Casuistics -->
        <casuistics-card
          :casuistics="report.casuistics || []"
        />
       
        <!-- Section 12: Annexe 01 - Photographic Registry -->
        <annexe-photographic-registry
          title="ANEXO 01: Registro fotográfico del candidato"
          icon="pi-user"
          :description="report.annexe01Description"
          description-label="Descripción del candidato"
          :photos="report.annexe01Photos || []"
          @view-photo="handleViewPhoto"
        />

        <!-- Section 13: Annexe 02 - Domicile Photographic Registry -->
        <annexe-photographic-registry
          title="ANEXO 02: Registro fotográfico del domicilio"
          icon="pi-images"
          :description="report.annexe02Description"
          description-label="Descripción de los alrededores"
          :photos="report.annexe02Photos || []"
          @view-photo="handleViewPhoto"
        />

        <!-- Section 14: Annexe 03 - Garage Photographic Registry -->
        <annexe-photographic-registry
          title="ANEXO 03: Registro fotográfico de la cochera"
          icon="pi-car"
          :description="report.annexe03Description"
          description-label="Descripción de la cochera"
          :photos="report.annexe03Photos || []"
          @view-photo="handleViewPhoto"
        />

        <!-- Section 15: Annexe 04 - Rooms Photographic Registry -->
        <annexe-photographic-registry
          title="ANEXO 04: Registro fotográfico de las habitaciones del domicilio"
          icon="pi-home"
          :description="report.annexe04Description"
          description-label="Descripción de las habitaciones"
          :photos="report.annexe04Photos || []"
          @view-photo="handleViewPhoto"
        />

        <!-- Section 16: Annexe 05 - Surroundings Photographic Registry -->
        <annexe-photographic-registry
          title="ANEXO 05: Registro fotográfico de alrededores del domicilio"
          icon="pi-map-marker"
          :description="report.annexe05Description"
          description-label="Descripción de los alrededores"
          :photos="report.annexe05Photos || []"
          @view-photo="handleViewPhoto"
        />

        <!-- Section 17: Annexe 06 - Datacrim Photo -->
        <annexe-photographic-registry
          title="ANEXO 06: Foto datacrim"
          icon="pi-id-card"
          :description="report.annexe06Description"
          description-label="Información adicional"
          :photos="report.annexe06Photos || []"
          @view-photo="handleViewPhoto"
        />
      </div>
    </div>

    <!-- Email Send Dialog -->
    <email-send-dialog
      :visible="emailDialogVisible"
      :recipient-email="report?.applicantEmail || ''"
      :subject="`Reporte de Verificación ${report?.reportCode || ''}`"
      :message="`Adjunto encontrará el reporte de verificación domiciliaria.`"
      :report-code="report?.reportCode || 'N/A'"
      @cancel-requested="handleEmailCancelRequested"
      @save-requested="handleEmailSaveRequested"
    />
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>
