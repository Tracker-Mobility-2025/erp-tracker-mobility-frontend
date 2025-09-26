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
        { field: 'id', header: 'ID Orden', sortable: true, style: 'width: 160px;' },
        { field: 'estado', header: 'Estado', sortable: true, template: 'status', style: 'width: 120px;' },
        { field: 'solicitante', header: 'Solicitante', sortable: true, style: 'width: 150px;' },
        { field: 'verificador', header: 'Verificador', sortable: true, template: 'verificador', style: 'width: 150px;' },
        { field: 'programacion', header: 'Programación', sortable: true, template: 'programacion', style: 'width: 140px;' }
      ],
      selectedStatus: null, // Filtro de estado seleccionado
      statusOptions: [
        { label: 'Todos', value: null },
        { label: 'Pendiente', value: 'Pendiente' },
        { label: 'En Proceso', value: 'En Proceso' },
        { label: 'Completado', value: 'Completado' },
        { label: 'Cancelado', value: 'Cancelado' }
      ],
      title: {
        singular: 'orden de verificación',
        plural: 'órdenes de verificación'
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

      // Navegar con router a /admin/order-details
      this.$router.push({ name: 'order-details'});

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
          return 'warn';
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



  <div class="h-full overflow-hidden flex flex-column p-4">

    <!-- Título de la página -->
    <h2 class="text-2xl font-bold mb-2">Gestión de Órdenes de Verificación</h2>
    <p class="text-color-secondary mb-4">Administra las órdenes de verificación, asigna verificadores y programa visitas.</p>

    <!-- Componente DataManager para gestionar ordenes de servicio-->
    <data-manager
      :items="filteredOrders"
      :columns="columns"
      :title="title"
      :loading="loading"
      :dynamic="true"
      :show-new="false"
      :show-delete="true"
      :show-export="true"
      :show-selection="true"
      :show-actions="true"
      :show-action-buttons="true"
      :rows="10"
      :rows-per-page-options="[5, 10, 15, 20, 50]"
      new-button-label="Nueva Orden"
      delete-button-label="Eliminar"
      export-button-label="Exportar"
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
/* Estilos usando variables CSS corporativas */
.text-orange-500 {
  color: var(--color-warning) !important;
}

/* Componentes PrimeVue personalizados con colores corporativos */
:deep(.p-button.p-button-success) {
  background-color: var(--color-success);
  border-color: var(--color-success);
}

:deep(.p-button.p-button-success:hover) {
  background-color: var(--color-valid);
  border-color: var(--color-valid);
}

:deep(.p-button.p-button-danger) {
  background-color: var(--color-coral);
  border-color: var(--color-coral);
}

:deep(.p-button.p-button-danger:hover) {
  background-color: var(--color-error);
  border-color: var(--color-error);
}

:deep(.p-button.p-button-help.p-button-outlined) {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

:deep(.p-button.p-button-help.p-button-outlined:hover) {
  background-color: var(--color-primary);
  color: var(--color-white);
}

/* Input y Dropdown usando variables corporativas */
:deep(.p-inputtext) {
  border: var(--border-width) solid var(--color-muted);
  border-radius: var(--border-radius);
  transition: all 0.2s ease-in-out;
}

:deep(.p-inputtext:focus) {
  border-color: var(--color-focus);
  box-shadow: 0 0 0 3px rgba(46, 61, 180, 0.1);
}

:deep(.p-dropdown) {
  border: var(--border-width) solid var(--color-muted);
  border-radius: var(--border-radius);
  transition: all 0.2s ease-in-out;
}

:deep(.p-dropdown:not(.p-disabled).p-focus) {
  border-color: var(--color-focus);
  box-shadow: 0 0 0 3px rgba(46, 61, 180, 0.1);
}

/* Tags de estado usando colores corporativos */
:deep(.p-tag) {
  border-radius: var(--border-radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.025em;
  font-weight: var(--font-weight-semibold);
}

:deep(.p-tag.p-tag-warning) {
  background-color: var(--bg-warning-light);
  color: var(--color-warning);
}

:deep(.p-tag.p-tag-success) {
  background-color: var(--bg-success-light);
  color: var(--color-success);
}

:deep(.p-tag.p-tag-danger) {
  background-color: var(--bg-error-light);
  color: var(--color-coral);
}

:deep(.p-tag.p-tag-info) {
  background-color: var(--bg-info-light);
  color: var(--color-info);
}

/* Checkbox usando colores corporativos */
:deep(.p-checkbox .p-checkbox-box) {
  border: var(--border-width-thick) solid var(--color-muted);
  border-radius: var(--border-radius-sm);
  width: 1.125rem;
  height: 1.125rem;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

/* Botones de acción en tabla */
:deep(.p-button-link) {
  color: var(--color-primary) !important;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  transition: all 0.2s ease-in-out;
}

:deep(.p-button-link:hover) {
  background-color: var(--color-card-background);
  color: var(--color-hover) !important;
}

/* Paginador usando colores corporativos */
:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page:hover) {
  background-color: var(--color-hover);
  border-color: var(--color-hover);
  color: var(--color-white);
}

/* DataTable headers usando colores corporativos */
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: var(--color-light);
  color: var(--color-dark);
  font-weight: var(--font-weight-semibold);
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: rgba(59, 130, 246, 0.05);
}

/* Toolbar usando colores corporativos */
:deep(.p-toolbar) {
  background-color: var(--color-card-background);
  border: var(--border-width) solid var(--color-border-cards);
  border-radius: var(--border-radius);
}
</style>