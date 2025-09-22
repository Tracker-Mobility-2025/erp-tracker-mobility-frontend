<script>

import DataManager from "../../../shared/components/data-manager.component.vue";

export default {
  name: "service-order-management",
  components: {
    DataManager

  },
  data() {
    return {
      orders: [
        {
          id: 'ORD-07-2025-001',
          estado: 'Pendiente',
          solicitante: 'Solicitante A',
          verificador: 'Verificador 1',
          programacion: '10/09/2025'
        },
        {
          id: 'ORD-07-2025-002',
          estado: 'Pendiente',
          solicitante: 'Solicitante B',
          verificador: 'Pendiente',
          programacion: 'Pendiente'
        },
        {
          id: 'ORD-07-2025-003',
          estado: 'Pendiente',
          solicitante: 'Solicitante C',
          verificador: 'Verificador 1',
          programacion: '10/09/2025'
        },
        {
          id: 'ORD-07-2025-004',
          estado: 'En Proceso',
          solicitante: 'Solicitante D',
          verificador: 'Verificador 2',
          programacion: '11/09/2025'
        },
        {
          id: 'ORD-07-2025-005',
          estado: 'Completado',
          solicitante: 'Solicitante E',
          verificador: 'Verificador 1',
          programacion: '09/09/2025'
        },
        {
          id: 'ORD-07-2025-006',
          estado: 'Pendiente',
          solicitante: 'Solicitante F',
          verificador: 'Verificador 3',
          programacion: '12/09/2025'
        },
        {
          id: 'ORD-07-2025-007',
          estado: 'En Proceso',
          solicitante: 'Solicitante G',
          verificador: 'Verificador 2',
          programacion: '13/09/2025'
        },
        {
          id: 'ORD-07-2025-008',
          estado: 'Pendiente',
          solicitante: 'Solicitante H',
          verificador: 'Pendiente',
          programacion: 'Pendiente'
        },
        {
          id: 'ORD-07-2025-009',
          estado: 'Completado',
          solicitante: 'Solicitante I',
          verificador: 'Verificador 1',
          programacion: '08/09/2025'
        },
        {
          id: 'ORD-07-2025-010',
          estado: 'Cancelado',
          solicitante: 'Solicitante J',
          verificador: 'Verificador 3',
          programacion: '14/09/2025'
        },
        {
          id: 'ORD-07-2025-011',
          estado: 'Pendiente',
          solicitante: 'Solicitante K',
          verificador: 'Verificador 2',
          programacion: '15/09/2025'
        },
        {
          id: 'ORD-07-2025-012',
          estado: 'En Proceso',
          solicitante: 'Solicitante L',
          verificador: 'Verificador 1',
          programacion: '16/09/2025'
        }
      ],
      columns: [
        { field: 'id', header: 'ID Orden', sortable: true },
        { field: 'estado', header: 'Estado', sortable: true, template: 'status' },
        { field: 'solicitante', header: 'Solicitante', sortable: true },
        { field: 'verificador', header: 'Verificador', sortable: true, template: 'verificador' },
        { field: 'programacion', header: 'Programación', sortable: true, template: 'programacion' }
      ],
      selectedStatus: null,
      statusOptions: [
        { label: 'Todos', value: null },
        { label: 'Pendiente', value: 'Pendiente' },
        { label: 'En Proceso', value: 'En Proceso' },
        { label: 'Completado', value: 'Completado' },
        { label: 'Cancelado', value: 'Cancelado' }
      ],
      title: {
        singular: 'Orden de verificación',
        plural: 'Órdenes de verificación'
      },
      loading: false
    }
  },

  computed: {
    filteredOrders() {
      if (!this.selectedStatus) {
        return this.orders;
      }
      return this.orders.filter(order => order.estado === this.selectedStatus);
    }
  },

  methods: {
    onNewItemRequested() {
      console.log('Crear nueva orden de verificación');
      // Implementar navegación a formulario de creación
    },
    onDeleteSelectedItems(selectedItems) {
      console.log('Eliminar órdenes seleccionadas:', selectedItems);
      // Implementar lógica de eliminación múltiple
      selectedItems.forEach(item => {
        const index = this.orders.findIndex(order => order.id === item.id);
        if (index > -1) {
          this.orders.splice(index, 1);
        }
      });
    },
    onDeleteItem(item) {
      console.log('Eliminar orden:', item);
      // Implementar lógica de eliminación individual
      const index = this.orders.findIndex(order => order.id === item.id);
      if (index > -1) {
        this.orders.splice(index, 1);
      }
    },
    onEditItem(item) {
      console.log('Editar orden:', item);
      // Implementar navegación a formulario de edición
    },
    onViewItem(item) {
      console.log('Ver detalles de orden:', item);
      // Implementar navegación a vista de detalles
    },
    onRowSelect(event) {
      console.log('Fila seleccionada:', event);
    },
    onRowUnselect(event) {
      console.log('Fila deseleccionada:', event);
    },
    clearStatusFilter() {
      this.selectedStatus = null;
    },
    getStatusSeverity(status) {
      switch (status) {
        case 'Pendiente':
          return 'warning';
        case 'En Proceso':
          return 'info';
        case 'Completado':
          return 'success';
        case 'Cancelado':
          return 'danger';
        default:
          return 'info';
      }
    }
  }
}
</script>

<template>
  <div class="service-order-management">
    <data-manager
      :items="filteredOrders"
      :columns="columns"
      :title="title"
      :loading="loading"
      :dynamic="true"
      :show-new="true"
      :show-delete="true"
      :show-export="true"
      :show-selection="true"
      :show-actions="true"
      :rows="10"
      :rows-per-page-options="[5, 10, 15, 20, 50]"
      search-placeholder="Busca por verificador, cliente, correo, celular..."
      @new-item-requested-manager="onNewItemRequested"
      @delete-selected-items-requested-manager="onDeleteSelectedItems"
      @delete-item-requested-manager="onDeleteItem"
      @edit-item-requested-manager="onEditItem"
      @view-item-requested-manager="onViewItem"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
    >
      <!-- Custom Filters -->
      <template #filters="{ clearFilters }">
        <div class="flex align-items-center gap-2">
          <pv-dropdown
            v-model="selectedStatus"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            placeholder="Estado: Todos"
            class="w-10rem"
            @change="() => {}"
          />
          <pv-input-text
            placeholder="mm/dd/aaaa"
            class="w-8rem"
            readonly
          />
        </div>
      </template>

      <!-- Custom Status Column -->
      <template #status="{ data }">
        <pv-tag 
          :value="data.estado"
          :severity="getStatusSeverity(data.estado)"
          class="text-sm"
        />
      </template>

      <!-- Custom Verificador Column -->
      <template #verificador="{ data }">
        <span :class="{ 'text-orange-500 font-medium': data.verificador === 'Pendiente' }">
          {{ data.verificador }}
        </span>
      </template>

      <!-- Custom Programacion Column -->
      <template #programacion="{ data }">
        <span :class="{ 'text-orange-500 font-medium': data.programacion === 'Pendiente' }">
          {{ data.programacion }}
        </span>
      </template>
    </data-manager>
  </div>
</template>

<style scoped>
.service-order-management {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  box-sizing: border-box;
}

:deep(.data-manager-container) {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Ensure the card takes remaining space and allows table to scroll */
:deep(.card) {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Make the data table scrollable */
:deep(.p-datatable-wrapper) {
  flex: 1;
  overflow: auto;
  height: 100%;
}

:deep(.data-manager-container h2) {
  color: #1f2937;
  font-size: 1.875rem;
  font-weight: 600;
  margin: 0;
}

/* Header buttons styling */
:deep(.p-button.p-button-success) {
  background-color: #059669;
  border-color: #059669;
  color: white;
  font-weight: 500;
}

:deep(.p-button.p-button-success:hover) {
  background-color: #047857;
  border-color: #047857;
}

:deep(.p-button.p-button-danger) {
  background-color: #dc2626;
  border-color: #dc2626;
  color: white;
  font-weight: 500;
}

:deep(.p-button.p-button-danger:hover) {
  background-color: #b91c1c;
  border-color: #b91c1c;
}

:deep(.p-button.p-button-help.p-button-outlined) {
  background-color: transparent;
  color: #6366f1;
  border-color: #6366f1;
  font-weight: 500;
}

:deep(.p-button.p-button-help.p-button-outlined:hover) {
  background-color: #6366f1;
  color: white;
}

/* Search and filter section */
:deep(.p-inputtext) {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
}

:deep(.p-inputtext:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

:deep(.p-input-icon-left .p-inputtext) {
  padding-left: 2.5rem;
}

:deep(.p-input-icon-left > i) {
  left: 0.875rem;
  color: #6b7280;
}

/* Dropdown styling */
:deep(.p-dropdown) {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
}

:deep(.p-dropdown:not(.p-disabled).p-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.p-dropdown .p-dropdown-label) {
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: #374151;
}

/* Status tags */
:deep(.p-tag) {
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

:deep(.p-tag.p-tag-warning) {
  background-color: #fef3c7;
  color: #d97706;
}

:deep(.p-tag.p-tag-success) {
  background-color: #d1fae5;
  color: #059669;
}

:deep(.p-tag.p-tag-danger) {
  background-color: #fecaca;
  color: #dc2626;
}

:deep(.p-tag.p-tag-info) {
  background-color: #dbeafe;
  color: #2563eb;
}

/* Table styling */
:deep(.card) {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Make the data table scrollable */
:deep(.p-datatable-wrapper) {
  flex: 1;
  overflow: auto;
  max-height: calc(100vh - 300px); /* Adjust based on header and filter heights */
}

:deep(.p-datatable) {
  background-color: #ffffff;
  height: 100%;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 1rem 0.75rem;
  border-bottom: 2px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  text-align: left;
}

:deep(.p-datatable .p-datatable-thead > tr > th:last-child) {
  border-right: none;
  text-align: center;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 1rem 0.75rem;
  font-size: 0.875rem;
  border-bottom: 1px solid #f1f5f9;
  border-right: 1px solid #f1f5f9;
  color: #374151;
}

:deep(.p-datatable .p-datatable-tbody > tr > td:last-child) {
  border-right: none;
  text-align: center;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f8fafc;
}

:deep(.p-datatable .p-datatable-tbody > tr.p-selection) {
  background-color: #eff6ff;
}

/* Custom checkbox styling */
:deep(.p-checkbox .p-checkbox-box) {
  border: 2px solid #d1d5db;
  border-radius: 4px;
  width: 1.125rem;
  height: 1.125rem;
  background-color: #ffffff;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

:deep(.p-checkbox .p-checkbox-box .p-checkbox-icon) {
  width: 0.75rem;
  height: 0.75rem;
  color: #ffffff;
}

/* Action buttons in table */
:deep(.p-button-link) {
  color: #3b82f6 !important;
  font-weight: 500;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
}

:deep(.p-button-link:hover) {
  background-color: #eff6ff;
  color: #2563eb !important;
}

/* Paginator styling */
:deep(.p-paginator) {
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  border-radius: 6px;
  margin: 0 0.125rem;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
}

/* Secondary button styling */
:deep(.p-button.p-button-secondary.p-button-outlined) {
  background-color: transparent;
  color: #6b7280;
  border-color: #d1d5db;
  font-weight: 500;
}

:deep(.p-button.p-button-secondary.p-button-outlined:hover) {
  background-color: #f9fafb;
  color: #374151;
  border-color: #9ca3af;
}

/* Empty state styling */
:deep(.p-datatable .p-datatable-emptymessage) {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

/* Loading state styling */
:deep(.p-progress-spinner) {
  margin: 2rem auto;
}

/* Responsive design */
@media (max-width: 768px) {
  .service-order-management {
    padding: 1rem;
    height: 100%;
  }
  
  :deep(.data-manager-container) {
    border-radius: 8px;
    height: 100%;
  }
  
  :deep(.p-datatable .p-datatable-thead > tr > th),
  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }
  
  :deep(.data-manager-container h2) {
    font-size: 1.5rem;
  }
  
  :deep(.p-datatable-wrapper) {
    height: 100%;
  }
}

@media (max-width: 640px) {
  .service-order-management {
    padding: 0.5rem;
  }
  
  :deep(.p-datatable .p-datatable-thead > tr > th),
  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0.5rem 0.25rem;
    font-size: 0.75rem;
  }
  
  :deep(.p-datatable-wrapper) {
    height: 100%;
  }
}

/* Pending status highlighting */
.text-orange-500 {
  color: #f97316;
}

.font-medium {
  font-weight: 500;
}

/* Additional spacing improvements */
:deep(.flex.align-items-center.justify-content-between.mb-4) {
  margin-bottom: 1.5rem;
}

:deep(.flex.align-items-center.gap-3.mb-4) {
  margin-bottom: 1.5rem;
}
</style>