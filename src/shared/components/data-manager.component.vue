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
    showActions: { type: Boolean, default: true },
    showSelection: { type: Boolean, default: true },
    showExport: { type: Boolean, default: true },
    showNew: { type: Boolean, default: true },
    showDelete: { type: Boolean, default: true },
    tableHeight: { type: String, default: '400px' },
    rows: { type: Number, default: 10 },
    rowsPerPageOptions: { type: Array, default: () => [5, 10, 15, 20] }
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
        message: `¿Está seguro de que desea eliminar los ${this.title.plural} seleccionados?`,
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

    editItem(item) {
      this.$emit('edit-item-requested-manager', item);
    },

    confirmDeleteItem(item) {
      this.$confirm.require({
        message: `¿Está seguro de que desea eliminar el ${this.title.singular} seleccionado?`,
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Eliminar',
        acceptClass: 'p-button-danger',
        accept: () => this.$emit('delete-item-requested-manager', item),
        reject: () => {}
      });
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

  <div class="data-manager-container">
    <!-- Header Section -->
    <div class="flex align-items-center justify-content-between mb-4">
      <h2 class="text-2xl font-semibold text-900 m-0">{{ title.plural }}</h2>
      <div class="flex align-items-center gap-2">
        <pv-button 
          v-if="showNew"
          icon="pi pi-plus" 
          label="Agregar" 
          severity="success" 
          size="small"
          @click="newItem" 
        />
        <pv-button 
          v-if="showDelete && showSelection"
          :disabled="!selectedItems || !selectedItems.length" 
          icon="pi pi-trash" 
          label="Eliminar" 
          severity="danger" 
          size="small"
          @click="confirmDeleteSelected" 
        />
        <pv-button 
          v-if="showExport"
          icon="pi pi-download" 
          label="Exportar" 
          severity="help" 
          size="small"
          outlined
          @click="exportToCsv" 
        />
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="flex align-items-center gap-3 mb-4">
      <div class="flex-1">
        <span class="p-input-icon-left w-full">
          <i class="pi pi-search" />
          <pv-input-text
            v-model="globalFilterValue"
            :placeholder="searchPlaceholder"
            class="w-full"
            @input="onGlobalFilterChange"
          />
        </span>
      </div>
      
      <!-- Custom filters slot -->
      <slot name="filters" :clear-filters="clearFilters" />
      
      <pv-button
        label="Limpiar filtros"
        severity="secondary"
        outlined
        size="small"
        @click="clearFilters"
      />
    </div>

    <!-- Data Table Section -->
    <div class="card">
      <pv-data-table
        ref="dt"
        v-model:selection="selectedItems"
        :value="items"
        :filters="filters"
        :loading="loading"
        :paginator="true"
        :rows="rows"
        :rows-per-page-options="rowsPerPageOptions"
        :scroll-height="tableHeight"
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
          header-style="width: 3rem"
          body-style="text-align: center"
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
          :style="column.style || ''"
          :header-style="column.headerStyle || ''"
          :body-style="column.bodyStyle || ''"
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
            <div class="flex align-items-center justify-content-center gap-2">
              <pv-button 
                icon="pi pi-eye" 
                severity="info"
                text 
                rounded 
                size="small"
                v-tooltip.top="'Ver detalles'"
                @click="$emit('view-item-requested-manager', slotProps.data)"
              />
              <pv-button 
                icon="pi pi-pencil" 
                severity="success"
                text 
                rounded 
                size="small"
                v-tooltip.top="'Editar'"
                @click="editItem(slotProps.data)"
              />
              <pv-button 
                icon="pi pi-trash" 
                severity="danger"
                text 
                rounded 
                size="small"
                v-tooltip.top="'Eliminar'"
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
.data-manager-container {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.card {
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

:deep(.data-table-custom .p-datatable-header) {
  background-color: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem;
}

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
}

:deep(.data-table-custom .p-datatable-thead > tr > th:last-child) {
  border-right: none;
}

:deep(.data-table-custom .p-datatable-tbody > tr > td) {
  padding: 0.875rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  border-right: 1px solid #f1f5f9;
  font-size: 0.875rem;
}

:deep(.data-table-custom .p-datatable-tbody > tr > td:last-child) {
  border-right: none;
}

:deep(.data-table-custom .p-datatable-tbody > tr:hover) {
  background-color: #f8fafc;
}

:deep(.data-table-custom .p-datatable-tbody > tr.p-selection) {
  background-color: #eff6ff;
}

:deep(.data-table-custom .p-paginator) {
  background-color: #f8fafc;
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
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

:deep(.p-input-icon-left > .p-inputtext) {
  padding-left: 2.5rem;
}

:deep(.p-input-icon-left > i) {
  left: 0.75rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .data-manager-container {
    padding: 1rem;
  }
  
  :deep(.data-table-custom .p-datatable-thead > tr > th),
  :deep(.data-table-custom .p-datatable-tbody > tr > td) {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
}

/* Custom scrollbar for table content */
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