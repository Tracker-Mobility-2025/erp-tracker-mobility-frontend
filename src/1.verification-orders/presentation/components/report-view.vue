<template>
  <div class="report-view-container">
    <!-- Encabezado del Reporte -->
    <Card class="report-header-card mb-4">
      <template #content>
        <div class="flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h2 class="m-0 mb-2">Reporte de Verificación</h2>
            <div class="flex align-items-center gap-3 flex-wrap">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-barcode"></i>
                <span class="font-semibold">{{ order.orderCodeValue }}</span>
              </div>
              <Divider layout="vertical" />
              <div class="flex align-items-center gap-2">
                <i class="pi pi-user"></i>
                <span>{{ order.clientFullName }}</span>
              </div>
              <Divider layout="vertical" />
              <Tag :value="getStatusLabel(order.status)" :severity="getStatusSeverity(order.status)" />
            </div>
          </div>

          <div class="report-actions flex gap-2">
            <Button 
              label="Exportar PDF" 
              icon="pi pi-file-pdf"
              severity="danger"
              @click="exportPDF"
              :loading="exporting" />
            
            <Button 
              label="Exportar Excel" 
              icon="pi pi-file-excel"
              severity="success"
              @click="exportExcel"
              :loading="exporting" />
          </div>
        </div>

        <!-- Barra de Progreso de Completitud -->
        <div class="completeness-section mt-4">
          <div class="flex justify-content-between align-items-center mb-2">
            <span class="font-semibold">Completitud del Reporte</span>
            <span class="text-primary font-bold">{{ order.reportCompleteness }}%</span>
          </div>
          <ProgressBar :value="order.reportCompleteness" :showValue="false" />
          <div class="completeness-details mt-2 text-sm text-color-secondary">
            <i class="pi pi-info-circle mr-1"></i>
            <span v-if="order.isReportComplete">Reporte completo y listo para envío</span>
            <span v-else>Faltan algunas secciones por completar</span>
          </div>
        </div>
      </template>
    </Card>

    <!-- Tabs de Secciones -->
    <TabView v-model:activeIndex="activeTab">
      <!-- Tab: Información General -->
      <TabPanel header="General">
        <template #header>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-info-circle"></i>
            <span>General</span>
          </div>
        </template>

        <Card>
          <template #title>Información General</template>
          <template #content>
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="field-info">
                  <label class="field-label">Código de Orden</label>
                  <div class="field-value">{{ order.orderCodeValue }}</div>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="field-info">
                  <label class="field-label">Estado</label>
                  <div class="field-value">
                    <Tag :value="getStatusLabel(order.status)" :severity="getStatusSeverity(order.status)" />
                  </div>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="field-info">
                  <label class="field-label">Cliente</label>
                  <div class="field-value">{{ order.clientFullName }}</div>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="field-info">
                  <label class="field-label">Empresa Solicitante</label>
                  <div class="field-value">{{ order.companyName || 'No especificado' }}</div>
                </div>
              </div>

              <div class="col-12 md:col-6" v-if="order.verifierId">
                <div class="field-info">
                  <label class="field-label">Verificador Asignado</label>
                  <div class="field-value">{{ order.homeVisitDetails.verifierName }}</div>
                </div>
              </div>

              <div class="col-12 md:col-6" v-if="order.visitDate">
                <div class="field-info">
                  <label class="field-label">Fecha de Visita</label>
                  <div class="field-value">{{ formatDate(order.visitDate) }}</div>
                </div>
              </div>

              <div class="col-12" v-if="order.additionalNotes">
                <Divider />
                <div class="field-info">
                  <label class="field-label">Notas Adicionales</label>
                  <div class="field-value notes-value">{{ order.additionalNotes }}</div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </TabPanel>

      <!-- Tab: Ubicación -->
      <TabPanel header="Ubicación">
        <template #header>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-map"></i>
            <span>Ubicación</span>
            <Badge v-if="!order.hasCompleteLocation" value="!" severity="warning" />
          </div>
        </template>

        <LocationInfo 
          :location="order.location"
          :readonly="readonly"
          @edit="openLocationDialog" />
      </TabPanel>

      <!-- Tab: Vivienda -->
      <TabPanel header="Vivienda">
        <template #header>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-home"></i>
            <span>Vivienda</span>
            <Badge v-if="!order.hasDwellingInfo" value="!" severity="warning" />
          </div>
        </template>

        <DwellingInfo 
          :dwelling="order.dwelling"
          :readonly="readonly"
          @edit="openDwellingDialog" />
      </TabPanel>

      <!-- Tab: Zona -->
      <TabPanel header="Zona">
        <template #header>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-map-marker"></i>
            <span>Zona</span>
            <Badge v-if="!order.hasZoneInfo" value="!" severity="warning" />
          </div>
        </template>

        <ZoneInfo 
          :zone="order.zone"
          :readonly="readonly"
          @edit="openZoneDialog" />
      </TabPanel>

      <!-- Tab: Documentos -->
      <TabPanel header="Documentos">
        <template #header>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-file"></i>
            <span>Documentos</span>
            <Badge v-if="order.documentsCount > 0" :value="order.documentsCount" />
          </div>
        </template>

        <DocumentsList 
          :documents="order.documents"
          @view-document="handleViewDocument"
          @download-document="handleDownloadDocument" />
      </TabPanel>

      <!-- Tab: Referencias -->
      <TabPanel header="Referencias">
        <template #header>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-users"></i>
            <span>Referencias</span>
            <Badge v-if="order.referencesCount > 0" :value="order.referencesCount" />
          </div>
        </template>

        <ContactReferences 
          :references="order.contactReferences"
          @call-reference="handleCallReference" />
      </TabPanel>

      <!-- Tab: Observaciones -->
      <TabPanel header="Observaciones">
        <template #header>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-exclamation-triangle"></i>
            <span>Observaciones</span>
            <Badge v-if="order.observations && order.observations.length > 0" 
                   :value="order.observations.length" 
                   severity="warning" />
          </div>
        </template>

        <slot name="observations">
          <Card>
            <template #content>
              <div class="text-center text-color-secondary py-4">
                <i class="pi pi-info-circle text-2xl mb-2"></i>
                <p>Las observaciones se muestran en la sección principal</p>
              </div>
            </template>
          </Card>
        </slot>
      </TabPanel>
    </TabView>

    <!-- Dialogs de Edición -->
    <DwellingFormDialog
      v-model:visible="dwellingDialogVisible"
      :dwelling="order.dwelling"
      title="Editar Información de Vivienda"
      @save="saveDwelling"
    />

    <ZoneFormDialog
      v-model:visible="zoneDialogVisible"
      :zone="order.zone"
      title="Editar Información de Zona"
      @save="saveZone"
    />

    <LocationFormDialog
      v-model:visible="locationDialogVisible"
      :location="order.location"
      title="Editar Ubicación"
      @save="saveLocation"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Card from 'primevue/card';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import Divider from 'primevue/divider';
import ProgressBar from 'primevue/progressbar';
import LocationInfo from './location-info.vue';
import DwellingInfo from './dwelling-info.vue';
import ZoneInfo from './zone-info.vue';
import DocumentsList from './documents-list.vue';
import ContactReferences from './contact-references.vue';
import DwellingFormDialog from './dwelling-form-dialog.vue';
import ZoneFormDialog from './zone-form-dialog.vue';
import LocationFormDialog from './location-form-dialog.vue';
import { OrderStatusTranslations, OrderStatusColors } from '../constants/verification-order-ui.constants.js';

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'export-pdf',
  'export-excel',
  'view-document',
  'download-document',
  'call-reference',
  'update:dwelling',
  'update:zone',
  'update:location'
]);

const activeTab = ref(0);
const exporting = ref(false);

// Dialog states
const dwellingDialogVisible = ref(false);
const zoneDialogVisible = ref(false);
const locationDialogVisible = ref(false);

const getStatusLabel = (status) => OrderStatusTranslations[status] || status;
const getStatusSeverity = (status) => OrderStatusColors[status] || 'secondary';

const formatDate = (date) => {
  if (!date) return 'N/A';
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString('es-PE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Dialog handlers
const openDwellingDialog = () => {
  dwellingDialogVisible.value = true;
};

const openZoneDialog = () => {
  zoneDialogVisible.value = true;
};

const openLocationDialog = () => {
  locationDialogVisible.value = true;
};

const saveDwelling = (dwellingData) => {
  emit('update:dwelling', dwellingData);
};

const saveZone = (zoneData) => {
  emit('update:zone', zoneData);
};

const saveLocation = (locationData) => {
  emit('update:location', locationData);
};

const exportPDF = async () => {
  exporting.value = true;
  try {
    await emit('export-pdf', props.order);
  } finally {
    exporting.value = false;
  }
};

const exportExcel = async () => {
  exporting.value = true;
  try {
    await emit('export-excel', props.order);
  } finally {
    exporting.value = false;
  }
};

const handleViewDocument = (document) => {
  emit('view-document', document);
};

const handleDownloadDocument = (document) => {
  emit('download-document', document);
};

const handleCallReference = (reference) => {
  emit('call-reference', reference);
};
</script>

<style scoped>
.report-view-container {
  padding: 1rem 0;
}

.report-header-card {
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--surface-0) 100%);
}

.field-info {
  margin-bottom: 1rem;
}

.field-label {
  display: block;
  font-weight: 600;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.field-value {
  font-size: 1rem;
  color: var(--text-color);
}

.notes-value {
  padding: 1rem;
  background: var(--surface-50);
  border-left: 4px solid var(--primary-500);
  border-radius: 6px;
  white-space: pre-wrap;
}

.completeness-section {
  padding: 1rem;
  background: var(--surface-0);
  border-radius: 8px;
  border: 1px solid var(--surface-200);
}

.completeness-details {
  display: flex;
  align-items: center;
}

.report-actions {
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .report-actions {
    width: 100%;
  }

  .report-actions .p-button {
    flex: 1;
  }
}
</style>
