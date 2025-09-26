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
      globalFilterValue: ''
    }
  },

  methods: {
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
      };
    },

    onGlobalFilterChange() {
      this.filters['global'].value = this.globalFilterValue;
    },

    clearFilters() {
      this.globalFilterValue = '';
      this.initFilters();
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
    <div class="flex  flex-column md:flex-row align-items-stretch md:align-items-center gap-3 mb-4">
      <div class="flex-1">
        <pv-icon-field class="w-full ">
          <pv-input-icon class="pi pi-search" />
          <pv-input-text
              v-model="globalFilterValue"
              :placeholder="searchPlaceholder"
              class="w-full"
              @input="onGlobalFilterChange"
          />
        </pv-icon-field>
      </div>
      
      <!-- Custom filters slot -->
      <slot name="filters" :clear-filters="clearFilters" />
      
      <pv-button
        label="Limpiar filtros"
        severity="secondary"
        outlined
        size="small"
        class="w-full md:w-auto h-full"
        @click="clearFilters"
      />
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
        :value="items"
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
/* Estilos específicos del card que no pueden ser reemplazados por PrimeFlex */
.card {
  background: white;
  border: none;
  box-shadow: none;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

/* Estilos específicos de la tabla que requieren :deep() para penetrar en PrimeVue */
:deep(.data-table-custom .p-datatable-header) {
  background-color: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem;
}

/* Estilos para el encabezado de la columna de selección */
:deep(.p-datatable-column-header-content) {
  text-align: center;
  align-items: center;
  justify-content: center;
}

/* Asegurar alineación perfecta de headers y contenido */
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

/* Estilos de celdas de encabezado */
:deep(.data-table-custom .p-datatable-thead > tr > th) {
  background-color: #f1f5f9;
  color: #374151;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding: 1rem 0.75rem;
  border-bottom: 2px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  white-space: nowrap;
  text-align: center;
}

/* Estilos de celdas del cuerpo - alineación perfecta */
:deep(.data-table-custom .p-datatable-tbody > tr > td) {
  padding: 0.875rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  border-right: 1px solid #f1f5f9;
  font-size: 0.875rem;
  vertical-align: middle;
  text-align: center;
}

:deep(.data-table-custom .p-datatable-thead > tr > th:last-child),
:deep(.data-table-custom .p-datatable-tbody > tr > td:last-child) {
  border-right: none;
  text-align: center;
}

:deep(.data-table-custom .p-datatable-tbody > tr:hover) {
  background-color: #f8fafc;
}

:deep(.data-table-custom .p-datatable-tbody > tr.p-selection) {
  background-color: #eff6ff;
}

/* Estilos del paginador */
:deep(.data-table-custom .p-paginator) {
  background-color: #f8fafc;
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
  position: sticky;
  bottom: 0;
  z-index: 10;
  flex-shrink: 0;
}

:deep(.data-table-custom .p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
}

:deep(.data-table-custom .p-checkbox .p-checkbox-box.p-highlight) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

/* Estilos de iconos de búsqueda */
:deep(.p-input-icon-left > .p-inputtext) {
  padding-left: 2.5rem;
}

:deep(.p-input-icon-left > i) {
  left: 0.75rem;
}

/* Estados especiales */
:deep(.data-table-custom .p-datatable-emptymessage) {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #f9fafb;
}

:deep(.data-table-custom .p-datatable-loading-overlay) {
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Espaciado consistente para altura mínima */
:deep(.data-table-custom .p-datatable-tbody) {
  min-height: 350px;
}

:deep(.data-table-custom .p-datatable-wrapper) {
  min-height: 450px;
}

/* Ajustes responsive con PrimeFlex equivalents implementados directamente */
@media (max-width: 768px) {
  :deep(.data-table-custom .p-datatable-thead > tr > th),
  :deep(.data-table-custom .p-datatable-tbody > tr > td) {
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  :deep(.data-table-custom .p-datatable-wrapper) {
    min-height: 350px;
  }

  :deep(.data-table-custom .p-datatable-tbody) {
    min-height: 250px;
  }

  :deep(.data-table-custom .p-datatable-emptymessage) {
    height: 250px;
  }
}

@media (max-width: 480px) {
  :deep(.data-table-custom .p-datatable-wrapper) {
    min-height: 300px;
  }

  :deep(.data-table-custom .p-datatable-tbody) {
    min-height: 200px;
  }

  :deep(.data-table-custom .p-datatable-emptymessage) {
    height: 200px;
  }
}

/* Scrollbar personalizado */
:deep(.p-datatable-wrapper::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.p-datatable-wrapper::-webkit-scrollbar-track) {
  background: #f1f5f9;
  border-radius: 3px;
}

:deep(.p-datatable-wrapper::-webkit-scrollbar-thumb) {
  background: #cbd5e1;
  border-radius: 3px;
}

:deep(.p-datatable-wrapper::-webkit-scrollbar-thumb:hover) {
  background: #94a3b8;
}
</style>