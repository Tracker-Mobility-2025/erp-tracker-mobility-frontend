<script>
import { FilterMatchMode } from "@primevue/core";

export default {
  name: "data-manager",
  inheritAttrs: false,

  props: {
    items: { type: Array, required: true },
    title: { type: Object, required: true }, // { singular: '', plural: '' }
    dynamic: { type: Boolean, default: false },
    columns: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    searchPlaceholder: { type: String, default: 'Busca por ID reporte, ID orden, verificador...' },
    // Props para filtros personalizados
    filteredItems: { type: Array, default: null }, // Items ya filtrados desde el componente padre
    globalFilterValue: { type: String, default: '' }, // Valor del filtro global controlado desde el padre
    // Configuración de botones de acción
    showActions: { type: Boolean, default: true }, // Muestra columna de acciones en tabla
    showSelection: { type: Boolean, default: true }, // Muestra checkboxes de selección
    showExport: { type: Boolean, default: true }, // Muestra botón Exportar
    showNew: { type: Boolean, default: true }, // Muestra botón Agregar
    showDelete: { type: Boolean, default: true }, // Muestra botón Eliminar
    showActionButtons: { type: Boolean, default: true }, // Muestra toda la sección de botones de acción
    // Configuración de tabla
    tableHeight: { type: String, default: '400px' },
    rows: { type: Number, default: 10 },
    rowsPerPageOptions: { type: Array, default: () => [5, 10, 15, 20] },
    // Labels personalizables
    newButtonLabel: { type: String, default: 'Agregar' },
    deleteButtonLabel: { type: String, default: 'Eliminar' },
    exportButtonLabel: { type: String, default: 'Exportar' }
  },

  data() {
    return {
      selectedItems: [],
      filters: null,
      internalGlobalFilterValue: ''
    }
  },

  computed: {
    // Usa los items filtrados del padre si están disponibles, si no usa los items originales
    displayItems() {
      return this.filteredItems || this.items;
    },

    // Valor del filtro global: usa el del padre si está disponible, si no el interno
    currentGlobalFilterValue: {
      get() {
        // Priorizar el valor del padre si está definido y no es null
        if (this.globalFilterValue !== null && this.globalFilterValue !== undefined) {
          return this.globalFilterValue;
        }
        return this.internalGlobalFilterValue;
      },
      set(value) {
        this.internalGlobalFilterValue = value || '';
        this.$emit('global-filter-change', value || '');
      }
    }
  },

  methods: {
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
      };
    },

    onGlobalFilterChange() {
      this.filters['global'].value = this.currentGlobalFilterValue || null;
    },

    clearFilters() {
      // Limpiar el filtro global interno y externo
      this.internalGlobalFilterValue = '';
      this.currentGlobalFilterValue = '';
      
      // Reinicializar los filtros de PrimeVue
      this.initFilters();
      
      // Emitir evento para que el componente padre limpie sus filtros
      this.$emit('clear-filters');
      
      // Emitir cambio del filtro global para sincronizar con el padre
      this.$emit('global-filter-change', '');
    },

    newItem() {
      this.$emit('new-item-requested-manager');
    },

    confirmDeleteSelected() {
      this.$confirm.require({
        message: `¿Está seguro de que desea eliminar las ${this.title.plural} seleccionadas?`,
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Eliminar',
        acceptClass: 'p-button-danger',
        accept: () => this.$emit('delete-selected-items-requested-manager', this.selectedItems),
        reject: () => {}
      });
    },

    exportToCsv() {
      this.$refs.dt.exportCSV();
    },

    onRowSelect(event) {
      this.$emit('row-select', event);
    },

    onRowUnselect(event) {
      this.$emit('row-unselect', event);
    }
  },

  created() {
    this.initFilters();
  }
}
</script>

<template>
  <pv-toast />
  <pv-confirm-dialog />

  <div class="bg-white border-round-lg p-4 md:p-4 shadow-2 h-full flex flex-column overflow-hidden">

    <!-- Search and Filter Section -->
    <div class="w-full flex flex-column gap-3">

      <!-- Custom filters slot -->
      <div class="flex w-full gap-2 mb-4 flex-wrap">

        <!-- Global Search Input -->
        <pv-icon-field class="flex-grow-1">
          <pv-input-icon class="pi pi-search" />
          <pv-input-text
              v-model="currentGlobalFilterValue"
              :placeholder="searchPlaceholder"
              class="w-full h-full"
              @input="onGlobalFilterChange"
          />
        </pv-icon-field>

        <slot name="filters" :clear-filters="clearFilters" />

      </div>

    </div>

    <!-- Action Buttons Section -->
    <div v-if="showActionButtons && (showNew || showDelete || showExport)" class="flex flex-column md:flex-row align-items-stretch md:align-items-center gap-2 mb-4">

      <div class="flex gap-2 flex-1 flex-column md:flex-row align-items-stretch md:align-items-center">
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
    <div class="card flex-1 flex flex-column">

      <pv-data-table
        ref="dt"
        v-model:selection="selectedItems"
        :value="displayItems"
        :filters="filters"
        :loading="loading"
        :paginator="true"
        :rows="rows"
        :rows-per-page-options="rowsPerPageOptions"
        :scroll-height="'flex'"
        scrollable
        :global-filter-fields="columns.map(col => col.field)"
        data-key="id"
        current-page-report-template="Mostrando {first} a {last} de {totalRecords} registros"
        paginator-template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        responsive-layout="scroll"
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
          :header-style="column.headerStyle || 'text-align: left;'"
          :body-style="column.bodyStyle || 'text-align: left;'"
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
          header-style="width: 10rem; text-align: center"
          body-style="text-align: center"
        >
          <template #body="slotProps">
            <pv-button 
              label="Ver detalles"
              severity="info"
              text 
              size="small"
              class="p-button-link"
              @click="$emit('view-item-requested-manager', slotProps.data)"
            />
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
/* ========== ESTILOS ESPECÍFICOS DEL DATA-MANAGER ========== */
/* Solo estilos que no pueden ser globales o requieren especificidad */

/* Contenedor principal del componente */
.bg-white {
  background: var(--color-white);
  border: 1px solid var(--table-border-strong);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Estructura flex específica del data-manager */
.card.flex-1 {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
}

/* Asegurar que la tabla ocupe todo el espacio disponible */
:deep(.data-table-custom .p-datatable) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.data-table-custom .p-datatable-wrapper) {
  flex: 1;
  overflow: auto;
  min-height: 400px;
}

/* Ajustes específicos para el scroll height flex */
:deep(.data-table-custom .p-datatable-scrollable-wrapper) {
  flex: 1;
}

:deep(.data-table-custom .p-datatable-scrollable-body) {
  flex: 1;
}

/* Espaciado específico para mobile en este componente */
@media (max-width: 768px) {
  .bg-white {
    padding: 0.75rem;
  }

  :deep(.data-table-custom .p-datatable-wrapper) {
    min-height: 350px;
  }
}

@media (max-width: 480px) {
  .bg-white {
    padding: 0.5rem;
  }

  :deep(.data-table-custom .p-datatable-wrapper) {
    min-height: 300px;
  }
}

/* Override específico para este componente si necesita comportamiento diferente */
:deep(.data-table-custom .p-datatable-tbody) {
  min-height: 350px;
}

/* Ajustes específicos del paginador para este componente */
:deep(.data-table-custom .p-paginator) {
  position: sticky;
  bottom: 0;
  z-index: 10;
  flex-shrink: 0;
}
</style>