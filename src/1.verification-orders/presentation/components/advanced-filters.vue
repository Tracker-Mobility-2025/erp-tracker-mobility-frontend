<template>
  <Card class="advanced-filters-card">
    <template #header>
      <div class="filter-header" @click="toggleFilters">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-filter text-xl"></i>
          <span class="font-semibold">Filtros Avanzados</span>
          <Badge v-if="activeFiltersCount > 0" :value="activeFiltersCount" severity="info" />
        </div>
        <div class="flex align-items-center gap-2">
          <Button
            v-if="activeFiltersCount > 0"
            label="Limpiar"
            icon="pi pi-times"
            size="small"
            text
            severity="secondary"
            @click.stop="clearFilters"
          />
          <i :class="expanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
        </div>
      </div>
    </template>

    <template #content>
      <Transition name="expand">
        <div v-show="expanded" class="filters-content">
          <div class="grid">
            <!-- Búsqueda por texto -->
            <div class="col-12">
              <div class="field">
                <label for="search-text">Búsqueda rápida</label>
                <IconField iconPosition="left">
                  <InputIcon class="pi pi-search" />
                  <InputText
                    id="search-text"
                    v-model="localFilters.searchText"
                    placeholder="Buscar por código, cliente o empresa..."
                    class="w-full"
                    @input="onFilterChange"
                  />
                </IconField>
                <small class="text-color-secondary">Busca en código de orden, nombre de cliente y empresa</small>
              </div>
            </div>

            <!-- Estado -->
            <div class="col-12 md:col-4">
              <div class="field">
                <label for="filter-status">Estado</label>
                <MultiSelect
                  id="filter-status"
                  v-model="localFilters.statuses"
                  :options="statusOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Todos los estados"
                  class="w-full"
                  display="chip"
                  @change="onFilterChange"
                />
              </div>
            </div>

            <!-- Rango de fechas -->
            <div class="col-12 md:col-4">
              <div class="field">
                <label for="filter-date-from">Fecha desde</label>
                <Calendar
                  id="filter-date-from"
                  v-model="localFilters.dateFrom"
                  placeholder="Seleccionar fecha"
                  dateFormat="dd/mm/yy"
                  showIcon
                  class="w-full"
                  @date-select="onFilterChange"
                />
              </div>
            </div>

            <div class="col-12 md:col-4">
              <div class="field">
                <label for="filter-date-to">Fecha hasta</label>
                <Calendar
                  id="filter-date-to"
                  v-model="localFilters.dateTo"
                  placeholder="Seleccionar fecha"
                  dateFormat="dd/mm/yy"
                  showIcon
                  class="w-full"
                  @date-select="onFilterChange"
                />
              </div>
            </div>

            <!-- Empresa -->
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="filter-company">Empresa</label>
                <Dropdown
                  id="filter-company"
                  v-model="localFilters.companyId"
                  :options="companyOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Todas las empresas"
                  class="w-full"
                  showClear
                  @change="onFilterChange"
                />
              </div>
            </div>

            <!-- Verificador -->
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="filter-verifier">Verificador</label>
                <Dropdown
                  id="filter-verifier"
                  v-model="localFilters.verifierId"
                  :options="verifierOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Todos los verificadores"
                  class="w-full"
                  showClear
                  @change="onFilterChange"
                />
              </div>
            </div>

            <!-- Completitud del reporte -->
            <div class="col-12 md:col-4">
              <div class="field">
                <label>Completitud del reporte</label>
                <div class="flex flex-column gap-2 mt-2">
                  <div class="flex align-items-center gap-2">
                    <RadioButton
                      v-model="localFilters.completeness"
                      inputId="completeness-all"
                      value="all"
                      @change="onFilterChange"
                    />
                    <label for="completeness-all" class="mb-0">Todos</label>
                  </div>
                  <div class="flex align-items-center gap-2">
                    <RadioButton
                      v-model="localFilters.completeness"
                      inputId="completeness-complete"
                      value="complete"
                      @change="onFilterChange"
                    />
                    <label for="completeness-complete" class="mb-0">Completos</label>
                  </div>
                  <div class="flex align-items-center gap-2">
                    <RadioButton
                      v-model="localFilters.completeness"
                      inputId="completeness-incomplete"
                      value="incomplete"
                      @change="onFilterChange"
                    />
                    <label for="completeness-incomplete" class="mb-0">Incompletos</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Con observaciones -->
            <div class="col-12 md:col-4">
              <div class="field">
                <label>Observaciones</label>
                <div class="flex flex-column gap-2 mt-2">
                  <div class="flex align-items-center gap-2">
                    <Checkbox
                      v-model="localFilters.hasObservations"
                      :binary="true"
                      inputId="has-observations"
                      @change="onFilterChange"
                    />
                    <label for="has-observations" class="mb-0">Con observaciones activas</label>
                  </div>
                  <div class="flex align-items-center gap-2">
                    <Checkbox
                      v-model="localFilters.hasUnresolvedObservations"
                      :binary="true"
                      inputId="has-unresolved"
                      @change="onFilterChange"
                    />
                    <label for="has-unresolved" class="mb-0">Con observaciones sin resolver</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Con documentos -->
            <div class="col-12 md:col-4">
              <div class="field">
                <label>Documentos</label>
                <div class="flex flex-column gap-2 mt-2">
                  <div class="flex align-items-center gap-2">
                    <Checkbox
                      v-model="localFilters.hasDocuments"
                      :binary="true"
                      inputId="has-documents"
                      @change="onFilterChange"
                    />
                    <label for="has-documents" class="mb-0">Con documentos adjuntos</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones de filtros presets -->
          <Divider />
          <div class="filter-presets">
            <div class="flex justify-content-between align-items-center gap-3 flex-wrap">
              <div class="flex gap-2 flex-wrap">
                <Button
                  label="Órdenes Pendientes"
                  icon="pi pi-clock"
                  size="small"
                  outlined
                  @click="applyPreset('pending')"
                />
                <Button
                  label="En Proceso"
                  icon="pi pi-sync"
                  size="small"
                  outlined
                  @click="applyPreset('in-progress')"
                />
                <Button
                  label="Con Observaciones"
                  icon="pi pi-exclamation-circle"
                  size="small"
                  outlined
                  severity="warning"
                  @click="applyPreset('with-observations')"
                />
                <Button
                  label="Completadas Hoy"
                  icon="pi pi-check-circle"
                  size="small"
                  outlined
                  severity="success"
                  @click="applyPreset('completed-today')"
                />
              </div>
              
              <div class="flex gap-2">
                <Button
                  label="Guardar Preset"
                  icon="pi pi-save"
                  size="small"
                  text
                  @click="savePresetDialog = true"
                />
                <Button
                  v-if="savedPresets.length > 0"
                  label="Mis Presets"
                  icon="pi pi-bookmark"
                  size="small"
                  text
                  @click="presetsMenu.toggle($event)"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </template>
  </Card>

  <!-- Dialog para guardar preset -->
  <Dialog
    v-model:visible="savePresetDialog"
    header="Guardar Filtros como Preset"
    :modal="true"
    :style="{ width: '400px' }"
  >
    <div class="field">
      <label for="preset-name">Nombre del preset</label>
      <InputText
        id="preset-name"
        v-model="presetName"
        placeholder="Ej: Órdenes urgentes"
        class="w-full"
        autofocus
      />
    </div>

    <template #footer>
      <Button label="Cancelar" severity="secondary" @click="savePresetDialog = false" />
      <Button label="Guardar" @click="savePreset" :disabled="!presetName" />
    </template>
  </Dialog>

  <!-- Menu de presets guardados -->
  <Menu ref="presetsMenu" :model="presetMenuItems" :popup="true" />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import RadioButton from 'primevue/radiobutton';
import Checkbox from 'primevue/checkbox';
import Badge from 'primevue/badge';
import Divider from 'primevue/divider';
import Dialog from 'primevue/dialog';
import Menu from 'primevue/menu';
import { OrderStatus, OrderStatusTranslations } from '../../domain/constants/verification-order.constants.js';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({})
  },
  companyOptions: {
    type: Array,
    default: () => []
  },
  verifierOptions: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:filters', 'apply']);

const toast = useToast();

// Estado
const expanded = ref(true);
const localFilters = ref({
  searchText: '',
  statuses: [],
  dateFrom: null,
  dateTo: null,
  companyId: null,
  verifierId: null,
  completeness: 'all',
  hasObservations: false,
  hasUnresolvedObservations: false,
  hasDocuments: false
});

const savePresetDialog = ref(false);
const presetName = ref('');
const savedPresets = ref([]);
const presetsMenu = ref(null);

// Opciones de estado
const statusOptions = Object.keys(OrderStatus).map(key => ({
  label: OrderStatusTranslations[OrderStatus[key]],
  value: OrderStatus[key]
}));

// Computed
const activeFiltersCount = computed(() => {
  let count = 0;
  if (localFilters.value.searchText) count++;
  if (localFilters.value.statuses.length > 0) count++;
  if (localFilters.value.dateFrom) count++;
  if (localFilters.value.dateTo) count++;
  if (localFilters.value.companyId) count++;
  if (localFilters.value.verifierId) count++;
  if (localFilters.value.completeness !== 'all') count++;
  if (localFilters.value.hasObservations) count++;
  if (localFilters.value.hasUnresolvedObservations) count++;
  if (localFilters.value.hasDocuments) count++;
  return count;
});

const presetMenuItems = computed(() => {
  return savedPresets.value.map(preset => ({
    label: preset.name,
    icon: 'pi pi-bookmark',
    command: () => loadPreset(preset)
  })).concat([
    { separator: true },
    {
      label: 'Administrar Presets',
      icon: 'pi pi-cog',
      command: () => managePresets()
    }
  ]);
});

// Watch para sincronizar con prop
watch(() => props.filters, (newFilters) => {
  if (newFilters) {
    localFilters.value = { ...localFilters.value, ...newFilters };
  }
}, { immediate: true, deep: true });

// Métodos
function toggleFilters() {
  expanded.value = !expanded.value;
}

function onFilterChange() {
  emit('update:filters', localFilters.value);
  emit('apply', localFilters.value);
}

function clearFilters() {
  localFilters.value = {
    searchText: '',
    statuses: [],
    dateFrom: null,
    dateTo: null,
    companyId: null,
    verifierId: null,
    completeness: 'all',
    hasObservations: false,
    hasUnresolvedObservations: false,
    hasDocuments: false
  };
  onFilterChange();
}

function applyPreset(presetType) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (presetType) {
    case 'pending':
      localFilters.value = {
        ...localFilters.value,
        statuses: [OrderStatus.PENDING, OrderStatus.ASSIGNED],
        completeness: 'all'
      };
      break;
    case 'in-progress':
      localFilters.value = {
        ...localFilters.value,
        statuses: [OrderStatus.IN_PROGRESS, OrderStatus.VERIFYING],
        completeness: 'all'
      };
      break;
    case 'with-observations':
      localFilters.value = {
        ...localFilters.value,
        hasUnresolvedObservations: true,
        statuses: []
      };
      break;
    case 'completed-today':
      localFilters.value = {
        ...localFilters.value,
        statuses: [OrderStatus.COMPLETED],
        dateFrom: today,
        dateTo: today
      };
      break;
  }
  onFilterChange();
}

function savePreset() {
  if (!presetName.value) return;

  const preset = {
    id: Date.now(),
    name: presetName.value,
    filters: { ...localFilters.value }
  };

  savedPresets.value.push(preset);
  localStorage.setItem('orderFiltersPresets', JSON.stringify(savedPresets.value));

  toast.add({
    severity: 'success',
    summary: 'Preset Guardado',
    detail: `El preset "${presetName.value}" se guardó correctamente`,
    life: 3000
  });

  presetName.value = '';
  savePresetDialog.value = false;
}

function loadPreset(preset) {
  localFilters.value = { ...preset.filters };
  onFilterChange();
  
  toast.add({
    severity: 'info',
    summary: 'Preset Aplicado',
    detail: `Se aplicó el preset "${preset.name}"`,
    life: 2000
  });
}

function managePresets() {
  // TODO: Implementar diálogo de administración de presets
  toast.add({
    severity: 'info',
    summary: 'Próximamente',
    detail: 'Administración de presets en desarrollo',
    life: 2000
  });
}

// Cargar presets guardados
function loadSavedPresets() {
  const stored = localStorage.getItem('orderFiltersPresets');
  if (stored) {
    try {
      savedPresets.value = JSON.parse(stored);
    } catch (e) {
      console.error('Error loading presets:', e);
    }
  }
}

// Lifecycle
loadSavedPresets();

// Expose methods
defineExpose({
  clearFilters,
  applyPreset
});
</script>

<style scoped>
.advanced-filters-card {
  margin-bottom: 1.5rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.filter-header:hover {
  background-color: var(--surface-50);
}

.filters-content {
  padding: 0 1.5rem 1rem;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.filter-presets {
  padding: 1rem 0 0;
}

/* Transition para expand/collapse */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 2000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

@media (max-width: 768px) {
  .filter-header {
    padding: 0.75rem 1rem;
  }

  .filters-content {
    padding: 0 1rem 1rem;
  }

  .filter-presets .flex {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-presets .flex > div {
    width: 100%;
  }

  .filter-presets button {
    width: 100%;
    justify-content: center;
  }
}
</style>
