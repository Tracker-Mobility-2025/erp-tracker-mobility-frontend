<template>
  <Card class="documents-card">
    <template #title>
      <div class="flex align-items-center justify-content-between">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-file text-2xl"></i>
          <span>Documentos Adjuntos</span>
          <Badge v-if="documents && documents.length > 0" :value="documents.length" severity="info" />
        </div>
        <Button 
          v-if="!readonly"
          label="Cargar documentos" 
          icon="pi pi-upload"
          size="small"
          @click="openUploadDialog"
        />
      </div>
    </template>

    <template #content>
      <div v-if="documents && documents.length > 0" class="documents-content">
        <DataTable :value="documents" stripedRows>
          <Column field="documentType" header="Tipo" style="width: 200px">
            <template #body="slotProps">
              <div class="flex align-items-center gap-2">
                <i :class="getDocumentIcon(slotProps.data.documentType)" class="text-primary"></i>
                <span>{{ getDocumentTypeLabel(slotProps.data.documentType) }}</span>
              </div>
            </template>
          </Column>

          <Column field="fileName" header="Archivo">
            <template #body="slotProps">
              <div class="flex flex-column gap-1">
                <span class="font-semibold">{{ slotProps.data.fileName || 'Sin nombre' }}</span>
                <span class="text-sm text-color-secondary">{{ slotProps.data.fileSizeInKB }} KB</span>
              </div>
            </template>
          </Column>

          <Column field="uploadDate" header="Fecha de Carga" style="width: 150px">
            <template #body="slotProps">
              {{ slotProps.data.uploadDateFormatted || 'N/A' }}
            </template>
          </Column>

          <Column field="isVerified" header="Estado" style="width: 120px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.isVerified ? 'Verificado' : 'Pendiente'" 
                   :severity="slotProps.data.isVerified ? 'success' : 'warning'" />
            </template>
          </Column>

          <Column header="Acciones" style="width: 150px">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button 
                  icon="pi pi-eye" 
                  severity="info"
                  text
                  rounded
                  v-tooltip.top="'Ver documento'"
                  @click="viewDocument(slotProps.data)"
                  :disabled="!slotProps.data.hasFile" />
                
                <Button 
                  icon="pi pi-download" 
                  severity="secondary"
                  text
                  rounded
                  v-tooltip.top="'Descargar'"
                  @click="downloadDocument(slotProps.data)"
                  :disabled="!slotProps.data.hasFile" />
              </div>
            </template>
          </Column>
        </DataTable>

        <!-- Resumen de Documentos -->
        <div class="documents-summary mt-4">
          <Divider />
          <div class="grid">
            <div class="col-12 md:col-4">
              <div class="summary-item">
                <i class="pi pi-file text-2xl text-primary"></i>
                <div>
                  <div class="summary-label">Total Documentos</div>
                  <div class="summary-value">{{ documents.length }}</div>
                </div>
              </div>
            </div>

            <div class="col-12 md:col-4">
              <div class="summary-item">
                <i class="pi pi-check-circle text-2xl text-green-500"></i>
                <div>
                  <div class="summary-label">Verificados</div>
                  <div class="summary-value">{{ verifiedCount }}</div>
                </div>
              </div>
            </div>

            <div class="col-12 md:col-4">
              <div class="summary-item">
                <i class="pi pi-clock text-2xl text-orange-500"></i>
                <div>
                  <div class="summary-label">Pendientes</div>
                  <div class="summary-value">{{ pendingCount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-data-message">
        <i class="pi pi-inbox text-4xl mb-3"></i>
        <span>No hay documentos adjuntos</span>
        <Button 
          v-if="!readonly"
          label="Cargar primer documento" 
          icon="pi pi-upload"
          class="mt-3"
          @click="openUploadDialog"
        />
      </div>
    </template>
  </Card>

  <!-- Dialog de carga de documentos -->
  <Dialog
    v-model:visible="uploadDialogVisible"
    header="Cargar documentos"
    :modal="true"
    :style="{ width: '60vw' }"
    :breakpoints="{ '960px': '80vw', '640px': '95vw' }"
  >
    <FileUpload
      ref="fileUploadRef"
      title="Documentos de la Orden"
      :multiple="true"
      :max-files="10"
      accepted-types="image/*,.pdf,.doc,.docx,.xls,.xlsx"
      @upload-complete="onUploadComplete"
    />
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import FileUpload from './file-upload.vue';
import { DocumentTranslations, DocumentIcons } from '../../domain/constants/document.constants.js';

const props = defineProps({
  documents: {
    type: Array,
    default: () => []
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['view-document', 'download-document', 'upload-complete']);

const uploadDialogVisible = ref(false);
const fileUploadRef = ref(null);

const verifiedCount = computed(() => {
  return props.documents.filter(doc => doc.isVerified).length;
});

const pendingCount = computed(() => {
  return props.documents.filter(doc => !doc.isVerified).length;
});

const getDocumentTypeLabel = (type) => DocumentTranslations[type] || type || 'Desconocido';
const getDocumentIcon = (type) => DocumentIcons[type] || 'pi pi-file';

function openUploadDialog() {
  uploadDialogVisible.value = true;
}

function onUploadComplete(files) {
  uploadDialogVisible.value = false;
  emit('upload-complete', files);
}

const viewDocument = (document) => {
  if (document.hasFile) {
    emit('view-document', document);
  }
};

const downloadDocument = (document) => {
  if (document.hasFile) {
    emit('download-document', document);
  }
};
</script>

<style scoped>
.documents-card {
  margin-bottom: 1.5rem;
}

.documents-content {
  padding: 0.5rem 0;
}

.documents-summary {
  margin-top: 1rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--surface-50);
  border-radius: 8px;
}

.summary-label {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  margin-bottom: 0.25rem;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
}

.no-data-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-color-secondary);
}
</style>
