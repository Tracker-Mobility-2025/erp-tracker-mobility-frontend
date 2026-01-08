<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import useVerificationReportStore from '../../application/verification-report.store.js';
import Toolbar from '../../../shared-v2/presentation/components/toolbar.vue';

const router = useRouter();
const reportStore = useVerificationReportStore();

// State
const search = ref('');
const selectStatus = ref('');
const currentPage = ref(0);
const pageSize = ref(10);
const loading = ref(false);

// Status options (TODO: mover a constants cuando se definan)
const statusOptions = [
  { label: 'Todos', value: '' },
  { label: 'Conforme', value: 'CONFORME' },
  { label: 'Observado', value: 'OBSERVADO' },
  { label: 'Rechazado', value: 'RECHAZADO' },
  { label: 'Pendiente', value: 'PENDIENTE' }
];

// Computed
const filteredReports = computed(() => {
  let filtered = reportStore.verificationReports;

  // Filter by search text
  if (search.value && search.value.trim().length > 0) {
    const searchLower = search.value.toLowerCase().trim();
    filtered = filtered.filter(report =>
      // TODO: Ajustar según propiedades reales del reporte
      (report.code && report.code.toLowerCase().includes(searchLower)) ||
      (report.candidateName && report.candidateName.toLowerCase().includes(searchLower))
    );
  }

  // Filter by status
  if (selectStatus.value) {
    filtered = filtered.filter(report => report.status === selectStatus.value);
  }

  return filtered;
});

const paginatedReports = computed(() => {
  const start = currentPage.value * pageSize.value;
  const end = start + pageSize.value;
  return filteredReports.value.slice(start, end);
});

const totalFilteredRecords = computed(() => filteredReports.value.length);

// Methods
const getCountByStatus = (status) => {
  return reportStore.verificationReports.filter(r => r.status === status).length;
};

const getStatusClass = (status) => {
  const statusMap = {
    'CONFORME': 'bg-green-100 text-green-700',
    'OBSERVADO': 'bg-yellow-100 text-yellow-700',
    'RECHAZADO': 'bg-red-100 text-red-700',
    'PENDIENTE': 'bg-blue-100 text-blue-700'
  };
  return statusMap[status] || 'bg-gray-100 text-gray-700';
};

const getStatusSeverity = (status) => {
  const severityMap = {
    'CONFORME': 'success',
    'OBSERVADO': 'warning',
    'RECHAZADO': 'danger',
    'PENDIENTE': 'info'
  };
  return severityMap[status] || 'info';
};

const onClearFilters = () => {
  search.value = '';
  selectStatus.value = '';
  currentPage.value = 0;
};

const onViewReport = (report) => {
  router.push({
    name: 'report-detail',
    query: { id: report.id }
  });
};

const onPageChange = (event) => {
  currentPage.value = event.page;
};

// Lifecycle
onMounted(async () => {
  loading.value = true;
  try {
    await reportStore.fetchAll();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="h-full w-full flex flex-column">
    <!-- Toolbar -->
    <toolbar
      :title="'Gestión de Reportes de Verificación'"
      :description="'Administra y visualiza los reportes de verificación domiciliaria'"
      :show-back-button="false"
    />

    <!-- Content -->
    <div class="flex-1 p-4 overflow-auto">
      <!-- Filters Card -->
      <pv-card class="mb-4">
        <template #content>
          <div class="formgrid grid">
            <!-- Search Input -->
            <div class="field col-12 md:col-6">
              <span class="p-input-icon-left w-full">
                <i class="pi pi-search" />
                <pv-input-text
                  v-model="search"
                  placeholder="Buscar por código o candidato..."
                  class="w-full"
                />
              </span>
            </div>

            <!-- Status Filter -->
            <div class="field col-12 md:col-4">
              <pv-dropdown
                v-model="selectStatus"
                :options="statusOptions"
                option-label="label"
                option-value="value"
                placeholder="Filtrar por estado"
                class="w-full"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex align-items-center">
                    <pv-tag :value="slotProps.value" :severity="getStatusSeverity(slotProps.value)" />
                  </div>
                  <span v-else>{{ slotProps.placeholder }}</span>
                </template>
                <template #option="slotProps">
                  <div class="flex align-items-center justify-content-between w-full">
                    <span>{{ slotProps.option.label }}</span>
                    <pv-badge
                      v-if="slotProps.option.value"
                      :value="getCountByStatus(slotProps.option.value)"
                      :severity="getStatusSeverity(slotProps.option.value)"
                    />
                  </div>
                </template>
              </pv-dropdown>
            </div>

            <!-- Clear Filters Button -->
            <div class="field col-12 md:col-2">
              <pv-button
                label="Limpiar"
                icon="pi pi-filter-slash"
                class="p-button-outlined w-full"
                @click="onClearFilters"
              />
            </div>
          </div>
        </template>
      </pv-card>

      <!-- Reports List -->
      <pv-card>
        <template #content>
          <pv-data-view
            :value="paginatedReports"
            :layout="'grid'"
            :paginator="true"
            :rows="pageSize"
            :total-records="totalFilteredRecords"
            :loading="loading"
            @page="onPageChange"
          >
            <template #empty>
              <div class="text-center p-5">
                <i class="pi pi-inbox text-6xl text-400 mb-3"></i>
                <p class="text-xl text-600">No se encontraron reportes</p>
              </div>
            </template>

            <template #grid="slotProps">
              <div class="col-12 md:col-6 lg:col-4 p-3">
                <pv-card class="cursor-pointer hover:surface-hover" @click="onViewReport(slotProps.data)">
                  <template #header>
                    <div class="p-3 bg-primary flex justify-content-between align-items-center">
                      <span class="text-white font-bold">{{ slotProps.data.code || 'N/A' }}</span>
                      <pv-tag
                        :value="slotProps.data.status"
                        :severity="getStatusSeverity(slotProps.data.status)"
                      />
                    </div>
                  </template>
                  <template #content>
                    <div class="flex flex-column gap-3">
                      <div>
                        <label class="text-sm text-color-secondary">Candidato</label>
                        <p class="font-semibold m-0">{{ slotProps.data.candidateName || 'No especificado' }}</p>
                      </div>
                      <div>
                        <label class="text-sm text-color-secondary">Verificador</label>
                        <p class="font-semibold m-0">{{ slotProps.data.verifierName || 'No especificado' }}</p>
                      </div>
                      <div>
                        <label class="text-sm text-color-secondary">Fecha de verificación</label>
                        <p class="font-semibold m-0">{{ slotProps.data.verificationDate || 'No especificado' }}</p>
                      </div>
                    </div>
                  </template>
                  <template #footer>
                    <div class="flex justify-content-end">
                      <pv-button
                        label="Ver detalle"
                        icon="pi pi-eye"
                        class="p-button-text"
                        @click.stop="onViewReport(slotProps.data)"
                      />
                    </div>
                  </template>
                </pv-card>
              </div>
            </template>
          </pv-data-view>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style scoped>
.hover\:surface-hover:hover {
  background-color: var(--surface-hover);
  transition: background-color 0.2s;
}
</style>
