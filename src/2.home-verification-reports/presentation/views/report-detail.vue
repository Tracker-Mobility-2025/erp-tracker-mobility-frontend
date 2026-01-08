<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import useVerificationReportStore from '../../application/verification-report.store.js';
import { useNotification } from '../../../shared-v2/composables/use-notification.js';
import Toolbar from '../../../shared-v2/presentation/components/toolbar.vue';

// Import all report card components
import VerificationInfoCard from '../components/verification-info-card.vue';
import ApplicantClientInfoCard from '../components/applicant-client-info-card.vue';
import AddressInfoCard from '../components/address-info-card.vue';

import AnnexePhotographicRegistry from '../components/annexe-photographic-registry.vue';
import EmailSendDialog from '../components/email-send-dialog.vue';

// Composables
const route = useRoute();
const reportStore = useVerificationReportStore();
const { showSuccess, showError } = useNotification();

// State
const report = ref(null);
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');
const emailDialogVisible = ref(false);

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
    simulateLoadingProgress();
    
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

const simulateLoadingProgress = () => {
  const progressInterval = setInterval(() => {
    if (loadingStep.value < loadingSteps.length - 1) {
      loadingStep.value++;
    } else {
      clearInterval(progressInterval);
    }
  }, 500);
  
  setTimeout(() => {
    clearInterval(progressInterval);
  }, 2000);
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

const handleExportPDF = () => {
  // TODO: Implementar exportación a PDF
  showSuccess('Exportación a PDF en desarrollo', 'Info');
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
        <!-- Section 0: Verification Info (Highlighted) -->
        <verification-info-card
          :verifier="report.verifierName"
          :address="report.address?.address"
          :district="report.address?.district"
          :province="report.address?.province"
          :department="report.address?.department"
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
