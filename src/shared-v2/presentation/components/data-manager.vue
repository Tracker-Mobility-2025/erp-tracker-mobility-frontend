<script setup>
/**
 * DataManagerComponent
 * 
 * Componente reutilizable para gestión de datos en tablas con funcionalidades completas:
 * - Paginación y ordenamiento dinámico
 * - Filtrado global y personalizado (interno/externo)
 * - Operaciones CRUD con confirmaciones
 * - Selección múltiple y exportación a CSV
 * - Acciones por fila (ver, editar, eliminar)
 * - Slots personalizables para columnas y filtros
 * 
 * @component
 * @example
 * <DataManagerComponent
 *   :items="orders"
 *   :title="{ singular: 'orden', plural: 'órdenes' }"
 *   :columns="columns"
 *   :dynamic="true"
 *   @new-item-requested-manager="handleNew"
 *   @delete-item-requested-manager="handleDelete"
 * />
 */

// ===========================
// IMPORTS
// ===========================
import { ref, computed, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core'
import { useConfirm } from 'primevue/useconfirm'

// ===========================
// PROPS
// ===========================
/**
 * Props del componente organizadas por categoría:
 * - Datos básicos: items, title, columns
 * - Configuración de vista: dynamic, loading, rows
 * - Filtros: searchPlaceholder, filteredItems, globalFilterValue
 * - Visibilidad de acciones: showActions, showSelection, showNew, etc.
 * - Textos personalizables: labels de botones y acciones
 */
const props = defineProps({
  // Datos y configuración básica
  items: { type: Array, required: true },
  title: { type: Object, required: true }, // { singular: '', plural: '' }
  dynamic: { type: Boolean, default: false },
  columns: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  
  // Configuración de búsqueda y filtros
  searchPlaceholder: { type: String, default: 'Busca por ID reporte, ID orden, verificador...' },
  filteredItems: { type: Array, default: null }, // Items pre-filtrados desde padre
  globalFilterValue: { type: String, default: '' }, // Control externo del filtro global
  
  // Configuración de visibilidad de componentes
  showActions: { type: Boolean, default: true },
  showSelection: { type: Boolean, default: true },
  showExport: { type: Boolean, default: true },
  showNew: { type: Boolean, default: true },
  showDelete: { type: Boolean, default: true },
  showActionButtons: { type: Boolean, default: true },
  
  // Configuración de paginación
  rows: { type: Number, default: 10 },
  rowsPerPageOptions: { type: Array, default: () => [10, 20, 30, 50] },
  
  // Labels de botones principales
  newButtonLabel: { type: String, default: 'Agregar' },
  deleteButtonLabel: { type: String, default: 'Eliminar' },
  exportButtonLabel: { type: String, default: 'Exportar' },
  
  // Configuración de acciones por fila
  showViewAction: { type: Boolean, default: true },
  showEditAction: { type: Boolean, default: false },
  showDeleteAction: { type: Boolean, default: false },
  editButtonLabel: { type: String, default: 'Editar' },
  deleteActionLabel: { type: String, default: 'Eliminar' },
  viewButtonLabel: { type: String, default: 'Ver detalles' },
  viewActionIconOnly: { type: Boolean, default: false }
})

// ===========================
// EMITS
// ===========================
/**
 * Eventos emitidos hacia el componente padre:
 * - CRUD: new, delete-selected, delete-item, view, edit
 * - Filtros: global-filter-change, clear-filters
 * - Selección: row-select, row-unselect
 */
const emit = defineEmits([
  'new-item-requested-manager',
  'delete-selected-items-requested-manager',
  'view-item-requested-manager',
  'edit-item-requested-manager',
  'delete-item-requested-manager',
  'global-filter-change',
  'clear-filters',
  'row-select',
  'row-unselect'
])

// ===========================
// COMPOSABLES
// ===========================
const confirm = useConfirm() // Servicio de confirmación de PrimeVue

// ===========================
// STATE
// ===========================
const selectedItems = ref([]) // Items seleccionados en la tabla
const filters = ref(null) // Configuración de filtros de PrimeVue
const internalGlobalFilterValue = ref('') // Valor interno del filtro global
const dt = ref(null) // Referencia al componente DataTable

// ===========================
// COMPUTED PROPERTIES
// ===========================
/**
 * Items a mostrar en la tabla
 * Prioriza filteredItems del padre, caso contrario usa items
 */
const displayItems = computed(() => props.filteredItems || props.items)

/**
 * Valor del filtro global con sincronización bidireccional
 * Permite control interno o externo del filtro
 */
const currentGlobalFilterValue = computed({
  get: () => props.globalFilterValue ?? internalGlobalFilterValue.value,
  set: (value) => {
    internalGlobalFilterValue.value = value || ''
    emit('global-filter-change', value || '')
  }
})

// ===========================
// METHODS - FILTERS
// ===========================
/**
 * Inicializa la configuración de filtros de PrimeVue
 */
const initFilters = () => {
  filters.value = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
}

/**
 * Aplica el filtro global cuando cambia el valor
 * Solo funciona si no hay filtros personalizados del padre
 */
const onGlobalFilterChange = () => {
  if (!props.filteredItems) {
    filters.value['global'].value = currentGlobalFilterValue.value || null
  }
}

/**
 * Limpia todos los filtros (internos y externos)
 * Emite eventos para sincronizar con el componente padre
 */
const clearFilters = () => {
  internalGlobalFilterValue.value = ''
  currentGlobalFilterValue.value = ''
  initFilters()
  emit('clear-filters')
  emit('global-filter-change', '')
}

// ===========================
// METHODS - CRUD OPERATIONS
// ===========================
/**
 * Emite evento para crear nuevo item
 */
const newItem = () => emit('new-item-requested-manager')

/**
 * Muestra confirmación y elimina items seleccionados
 * Maneja plural/singular según cantidad de items
 */
const confirmDeleteSelected = () => {
  const count = selectedItems.value.length
  confirm.require({
    message: `¿Está seguro de que desea eliminar ${count} ${count === 1 ? props.title.singular : props.title.plural}?`,
    header: 'Confirmación',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancelar',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Eliminar',
      severity: 'danger'
    },
    accept: () => emit('delete-selected-items-requested-manager', selectedItems.value),
    reject: () => {}
  })
}

/**
 * Muestra confirmación y elimina un item individual
 * Detecta automáticamente el identificador del item (orderNumber, name, id)
 */
const confirmDeleteItem = (item) => {
  const itemIdentifier = item.fullName || item.firstName || item.id || ''
  confirm.require({
    message: `¿Está seguro de eliminar ${itemIdentifier ? `"${itemIdentifier}"` : `esta ${props.title.singular}`}?`,
    header: 'Confirmación',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancelar',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Eliminar',
      severity: 'danger'
    },
    accept: () => emit('delete-item-requested-manager', item),
    reject: () => {}
  })
}

// ===========================
// METHODS - TABLE ACTIONS
// ===========================
/**
 * Exporta los datos de la tabla a formato CSV
 */
const exportToCsv = () => dt.value.exportCSV()

/**
 * Emite evento cuando se selecciona una fila
 */
const onRowSelect = (event) => emit('row-select', event)

/**
 * Emite evento cuando se deselecciona una fila
 */
const onRowUnselect = (event) => emit('row-unselect', event)

// ===========================
// LIFECYCLE HOOKS
// ===========================
/**
 * Inicializa los filtros al montar el componente
 */
onMounted(() => initFilters())
</script>

<template>
  <pv-toast />

  <div class="surface-0 border-round-lg p-4 shadow-2 h-full flex flex-column overflow-hidden" style="border: 1px solid var(--border-medium);">

    <!-- Search and Filter Section -->
    <div class="w-full flex flex-column gap-3 mb-2 border-bottom-1 surface-border">

      <!-- Custom filters slot -->
      <div class="flex w-full gap-2 mb-4 flex-wrap">
        <!-- Global Search Input -->
        <pv-icon-field class="flex-grow-1">
          <pv-input-icon class="pi pi-search" />
          <pv-input-text
              v-model="currentGlobalFilterValue"
              :placeholder="searchPlaceholder"
              class="w-full h-auto"
              @input="onGlobalFilterChange"
          />
        </pv-icon-field>

        <slot name="filters" :clear-filters="clearFilters" />

      </div>

    </div>

    <!-- Action Buttons Section -->
    <div v-if="showActionButtons && (showNew || showDelete || showExport)"
         class="flex flex-column md:flex-row align-items-stretch md:align-items-left gap-2 mb-4">

      <div class="flex gap-2 flex-1 flex-column md:flex-row align-items-stretch md:align-items-left">
        <pv-button
            v-if="showNew"
            icon="pi pi-plus"
            :label="newButtonLabel"
            severity="success"
            size="small"
            class="w-full md:w-auto"
            @click="newItem"
        />
        <pv-button
            v-if="showDelete && showSelection"
            :disabled="!selectedItems || !selectedItems.length"
            icon="pi pi-trash"
            :label="deleteButtonLabel"
            severity="danger"
            size="small"
            class="w-full md:w-auto"
            @click="confirmDeleteSelected"
        />
      </div>

      <pv-button 
        v-if="showExport"
        icon="pi pi-download" 
        :label="exportButtonLabel" 
        severity="help" 
        size="small"
        outlined
        class="w-full md:w-auto"
        @click="exportToCsv" 
      />
    </div>

    <!-- Data Table Section -->
    <div class="flex-1 flex flex-column overflow-hidden" style="min-height: 0;">

      <pv-data-table
        ref="dt"
        v-model:selection="selectedItems"
        :value="displayItems"
        :filters="filteredItems ? null : filters"
        :loading="loading"
        :paginator="true"
        :rows="rows"
        :rows-per-page-options="rowsPerPageOptions"
        scrollable
        scroll-height="flex"
        :global-filter-fields="filteredItems ? [] : columns.map(col => col.field)"
        data-key="id"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        current-page-report-template="Mostrando {first} - {last} de {totalRecords} órdenes"
        striped-rows
        hover
        @row-select="onRowSelect"
        @row-unselect="onRowUnselect"
        class="data-table-custom"
      >
        <!-- Selection Column -->
        <pv-column
            v-if="showSelection"
            :exportable="false"
            selection-mode="multiple"
            header-style="width: 3rem; text-align: center"
            body-style="text-align: center; justify-content: center;"

        />

        <!-- Custom Slot Columns -->
        <slot name="custom-columns-manager" />

        <!-- Dynamic Columns -->
        <pv-column 
          v-if="dynamic" 
          v-for="column in columns"
          :key="column.field"
          :field="column.field" 
          :header="column.header"
          :sortable="column.sortable !== false"
          :style="column.style || 'min-width: 150px;'"
          :header-style="column.headerStyle || 'text-align: center;'"
          :body-style="column.bodyStyle || 'text-align: center;'"
        >
          <template v-if="column.template" #body="slotProps">
            <slot :name="column.template" :data="slotProps.data" :value="slotProps.data[column.field]" />
          </template>
        </pv-column>

        <!-- Actions Column -->
        <pv-column
          v-if="showActions"
          :exportable="false"
          header="Acciones"
          :headerStyle="{ width: '8rem', textAlign: 'center' }"
          :bodyStyle="{ textAlign: 'center' }"
        >
          <template #body="slotProps">
            <div class="flex gap-1 justify-content-center">
              <pv-button
                  v-if="showViewAction && !viewActionIconOnly"
                  :label="viewButtonLabel"
                  severity="info"
                  text
                  size="small"
                  class="p-button-link"
                  @click="emit('view-item-requested-manager', slotProps.data)"
              />
              <pv-button
                  v-if="showViewAction && viewActionIconOnly"
                  icon="pi pi-eye"
                  severity="info"
                  rounded
                  size="small"
                  class="action-button view-button"
                  v-tooltip.top="viewButtonLabel"
                  @click="emit('view-item-requested-manager', slotProps.data)"
              />
              <pv-button
                  v-if="showEditAction"
                  icon="pi pi-pencil"
                  severity="warning"
                  rounded
                  size="small"
                  class="action-button edit-button"
                  v-tooltip.top="editButtonLabel"
                  @click="emit('edit-item-requested-manager', slotProps.data)"
              />
              <pv-button
                  v-if="showDeleteAction"
                  icon="pi pi-trash"
                  severity="danger"
                  rounded
                  size="small"
                  class="action-button delete-button"
                  v-tooltip.top="deleteActionLabel"
                  @click="confirmDeleteItem(slotProps.data)"
              />
            </div>
          </template>
        </pv-column>

        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-6">
            <i class="pi pi-search text-4xl text-400 mb-3"></i>
            <p class="text-600 mb-0">No se encontraron registros</p>
          </div>
        </template>

        <!-- Loading State -->
        <template #loading>
          <div class="text-center py-6">
            <pv-progress-spinner style="width:50px;height:50px" stroke-width="4" />
            <p class="text-600 mt-3 mb-0">Cargando datos...</p>
          </div>
        </template>
      </pv-data-table>
    </div>
  </div>
</template>

<style scoped>
/* Tabla con scroll optimizado */
:deep(.data-table-custom) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.data-table-custom .p-datatable-wrapper) {
  flex: 1;
  overflow: auto;
}

:deep(.data-table-custom .p-datatable-thead) {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--surface-default);
}

:deep(.data-table-custom .p-datatable-tbody) {
  flex: 1;
}

:deep(.data-table-custom .p-datatable-tbody > tr) {
  height: 46px;
}

/* Paginador sticky */
:deep(.data-table-custom .p-paginator) {
  position: sticky;
  bottom: 0;
  z-index: 2;
  background: var(--surface-default);
  border-top: 1px solid var(--border-medium);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Botones navegación paginador */
:deep(.data-table-custom .p-paginator .p-paginator-first,
       .data-table-custom .p-paginator .p-paginator-prev,
       .data-table-custom .p-paginator .p-paginator-next,
       .data-table-custom .p-paginator .p-paginator-last) {
  min-width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-medium);
  background: var(--surface-default);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

:deep(.data-table-custom .p-paginator .p-paginator-first:not(.p-disabled):hover,
       .data-table-custom .p-paginator .p-paginator-prev:not(.p-disabled):hover,
       .data-table-custom .p-paginator .p-paginator-next:not(.p-disabled):hover,
       .data-table-custom .p-paginator .p-paginator-last:not(.p-disabled):hover) {
  background: var(--surface-subtle);
  border-color: var(--border-dark);
}

/* Botones de página */
:deep(.data-table-custom .p-paginator .p-paginator-page) {
  min-width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
  transition: all 0.2s ease;
  margin: 0 0.125rem;
}

:deep(.data-table-custom .p-paginator .p-paginator-page:hover) {
  background: var(--surface-subtle);
  border-color: var(--border-medium);
}

:deep(.data-table-custom .p-paginator .p-paginator-page.p-highlight) {
  background: var(--action-primary);
  border-color: var(--action-primary);
  color: var(--text-inverse);
}

:deep(.data-table-custom .p-paginator .p-paginator-page.p-highlight:hover) {
  background: var(--action-primary-hover);
  border-color: var(--action-primary-hover);
}

/* Texto reporte actual */
:deep(.data-table-custom .p-paginator .p-paginator-current) {
  color: var(--text-secondary);
  font-size: var(--font-size-body-small);
  font-weight: var(--font-weight-medium);
  margin-right: auto;
  padding: 0 0.5rem;
}

/* Dropdown filas por página */
:deep(.data-table-custom .p-paginator .p-dropdown) {
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  height: 2.5rem;
  background: var(--surface-default);
  transition: all 0.2s ease;
}

:deep(.data-table-custom .p-paginator .p-dropdown:hover) {
  border-color: var(--border-dark);
}

:deep(.data-table-custom .p-paginator .p-dropdown:focus) {
  border-color: var(--action-primary);
  box-shadow: 0 0 0 3px rgba(215, 32, 28, 0.1);
}

:deep(.data-table-custom .p-paginator .p-disabled) {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Botones de acción */
:deep(.action-button) {
  width: 2rem !important;
  height: 2rem !important;
  min-width: 2rem !important;
  padding: 0 !important;
  margin: 0.125rem !important;
  transition: all 0.2s ease-in-out !important;
  border: 1px solid transparent !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.action-button .p-button-icon) {
  font-size: 0.875rem !important;
  margin: 0 !important;
}

:deep(.view-button) {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  color: var(--text-inverse) !important;
  border-color: #2563eb !important;
}

:deep(.view-button:hover) {
  background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
  transform: translateY(-1px) !important;
  box-shadow: var(--shadow-md) !important;
  border-color: #1d4ed8 !important;
}

:deep(.view-button:active) {
  transform: translateY(0) !important;
  box-shadow: var(--shadow-sm) !important;
}

:deep(.edit-button) {
  background: var(--warning-base) !important;
  color: var(--text-inverse) !important;
  border-color: var(--warning-base) !important;
}

:deep(.edit-button:hover) {
  background: #FF8F00 !important;
  transform: translateY(-1px) !important;
  box-shadow: var(--shadow-md) !important;
  border-color: #FF8F00 !important;
}

:deep(.edit-button:active) {
  transform: translateY(0) !important;
  box-shadow: var(--shadow-sm) !important;
}

:deep(.delete-button) {
  background: var(--error-base) !important;
  color: var(--text-inverse) !important;
  border-color: var(--error-base) !important;
}

:deep(.delete-button:hover) {
  background: #B01A17 !important;
  transform: translateY(-1px) !important;
  box-shadow: var(--shadow-md) !important;
  border-color: #B01A17 !important;
}

:deep(.delete-button:active) {
  transform: translateY(0) !important;
  box-shadow: var(--shadow-sm) !important;
}
</style>
