<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useVerificationReportStore from '../../application/verification-report.store.js';
import { useNotification } from '../../../shared-v2/composables/use-notification.js';
import Toolbar from '../../../shared-v2/presentation/components/toolbar.vue';

// Import all report card components
import {
  VisitDetailsCard,
  ApplicantDataCard,
  CustomerDataCard,
  CustomerAddressCard,
  ResidenceDetailsCard,
  LandlordDataCard,
  LandlordInterviewDetailsCard,
  ReportObservationsCard,
  ReportSummaryCard,
  ReportGlossaryCard,
  ReportCasuistryCard,
  AnnexePhotographicRegistry,
  EmailSendDialog
} from '../components';

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

const retryLoading = () => {
  const reportId = route.query.id;
  hasError.value = false;
  isLoading.value = true;
  loadingStep.value = 0;
  getReportById(reportId);
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
  const reportId = route.query.id;
  
  if (!reportId) {
    hasError.value = true;
    isLoading.value = false;
    errorMessage.value = 'ID de reporte no proporcionado';
    return;
  }
  
  await getReportById(reportId);
});
</script>

<template>
  <div class="h-full w-full flex flex-column">
    <!-- Toolbar -->
    <toolbar
      :title="report ? `Reporte ${report.code || 'N/A'}` : 'Detalle del Reporte'"
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
        <!-- Section 1: Visit Details -->
        <visit-details-card
          :verifier="report.verifierName"
          :google-maps-link="report.googleMapsLink"
          :verification-date="report.verificationDate"
          :result="report.status"
        />

        <!-- Section 2: Applicant Data -->
        <applicant-data-card
          :business-name="report.applicantBusinessName"
          :ruc="report.applicantRuc"
          :request-date="report.requestDate"
        />

        <!-- Section 3: Customer Data -->
        <customer-data-card
          :full-name="report.candidateFullName"
          :document-type="report.candidateDocumentType"
          :document-number="report.candidateDocumentNumber"
          :phone-number="report.candidatePhoneNumber"
        />

        <!-- Section 4: Customer Address -->
        <customer-address-card
          :address="report.candidateAddress"
          :district="report.candidateDistrict"
          :province="report.candidateProvince"
          :department="report.candidateDepartment"
          :reference="report.candidateReference"
        />

        <!-- Section 5: Residence Details -->
        <residence-details-card
          :residence-type="report.residenceType"
          :dwelling-type="report.dwellingType"
          :garage-type="report.garageType"
          :residence-time="report.residenceTime"
        />

        <!-- Section 6: Landlord Data -->
        <landlord-data-card
          :full-name="report.landlordFullName"
          :phone-number="report.landlordPhoneNumber"
          :relationship="report.landlordRelationship"
        />

        <!-- Section 7: Landlord Interview Details -->
        <landlord-interview-details-card
          :interview-date="report.landlordInterviewDate"
          :interview-time="report.landlordInterviewTime"
          :observations="report.landlordInterviewObservations"
          :status="report.landlordInterviewStatus"
        />

        <!-- Section 8: Report Observations -->
        <report-observations-card
          :observations="report.observations"
        />

        <!-- Section 9: Report Summary -->
        <report-summary-card
          :total-photos="report.totalPhotos || 0"
          :total-annexes="report.totalAnnexes || 0"
          :report-status="report.status"
          :created-at="report.createdAt"
          :updated-at="report.updatedAt"
        />

        <!-- Section 10: Report Glossary -->
        <report-glossary-card
          :glossary-items="report.glossaryItems || []"
        />

        <!-- Section 11: Report Casuistry -->
        <report-casuistry-card
          :casuistry-type="report.casuistryType"
          :description="report.casuistryDescription"
          :recommendations="report.casuistryRecommendations"
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
      :subject="`Reporte de Verificación ${report?.code || ''}`"
      :message="`Adjunto encontrará el reporte de verificación domiciliaria.`"
      :report-code="report?.code || 'N/A'"
      @cancel-requested="handleEmailCancelRequested"
      @save-requested="handleEmailSaveRequested"
    />
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>
