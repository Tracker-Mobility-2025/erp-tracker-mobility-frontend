<script>

import DataManager from "../../../shared/components/data-manager.component.vue";

export default {
  name: 'verifiers-management',
  components: {DataManager},

  data() {
    return {

      verifiers: [
        { id: 1, name: 'Juan', lastname: 'Pérez', email: 'juan@gmail.com', phone: '555-1234', status: 'Activo' },
        { id: 2, name: 'María', lastname: 'Gómez', email: 'maria@gmail.com', phone: '555-5678', status: 'Inactivo' },
      ],

      columns: [
        { field: 'name', header: 'Nombres', sortable: true, style: 'width: 160px;' },
        { field: 'lastname', header: 'Apellidos', sortable: true, style: 'width: 160px;' },
        { field: 'email', header: 'Email', sortable: true, style: 'width: 200px;' },
        { field: 'phone', header: 'Teléfono', sortable: true, style: 'width: 140px;' },
        { field: 'status', header: 'Estado', sortable: true, template: 'status', style: 'width: 120px;' },
      ],

      globalFilterValue: '', // Valor del filtro global de búsqueda
      selectedStatus: null, // Estado seleccionado en el filtro
      statusOptions: [      // Opciones de estado para el filtro
        { label: 'Todos', value: null },
        { label: 'Activo', value: 'Activo' },
        { label: 'Inactivo', value: 'Inactivo' },
      ],

      title: {
        singular: 'verificador',
        plural: 'verificadores',
      },

      loading: false,
    }
  },

  computed: {
    // Filtro combinado que aplica todos los filtros activos
    filteredVerifiers() {
      let filtered = [...this.verifiers];

      // Filtro por búsqueda global (nombre, apellido, email, teléfono)
      if (this.globalFilterValue) {
        const searchTerm = this.globalFilterValue.toLowerCase();
        filtered = filtered.filter(verifier =>
          verifier.name.toLowerCase().includes(searchTerm) ||
          verifier.lastname.toLowerCase().includes(searchTerm) ||
          verifier.email.toLowerCase().includes(searchTerm) ||
          verifier.phone.toLowerCase().includes(searchTerm)
        );
      }

      // Filtro por estado seleccionado
      if (this.selectedStatus) {
        filtered = filtered.filter(verifier => verifier.status === this.selectedStatus);
      }

      return filtered;
    }
  },

  methods: {

    onNewItemRequested() {
      console.log('Crear un nuevo verificador');
      // Implementar navegación a formulario de creación
    },


    onDeleteSelectedItems(selectedItems) {
      console.log('Eliminar verificadores seleccionadas:', selectedItems);
      // Implementar lógica de eliminación múltiple
      selectedItems.forEach(item => {
        const index = this.verifiers.findIndex(order => order.id === item.id);
        if (index > -1) {
          this.verifiers.splice(index, 1);
        }
      });
    },


    onDeleteItem(item) {
      console.log('Eliminar verificador:', item);
      // Implementar lógica de eliminación individual
      const index = this.verifiers.findIndex(order => order.id === item.id);
      if (index > -1) {
        this.verifiers.splice(index, 1);
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

    clearAllFilters() {
      this.globalFilterValue = '';
      this.selectedStatus = null;
    },

    onGlobalFilterChange(value) {
      this.globalFilterValue = value;
    },

    getStatusVerifiers(status) {
      switch (status) {
        case 'Activo':
          return 'success';
        case 'Inactivo':
          return 'danger';
        default:
          return 'info';
      }
    },

  },

};

</script>

<template>

  <div class="h-full overflow-hidden flex flex-column p-4">

    <!-- Título de la página -->
    <h2 class="text-2xl font-bold mb-2">Gestión de verificadores</h2>
    <p> Gestiona los perfiles de verificadores, incluyendo información de contacto, credenciales de acceso y
      asignación de ordenes de servicio </p>

    <!-- Componente DataManager para gestionar verificadores -->

    <data-manager
        :items="verifiers"
        :filtered-items="filteredVerifiers"
        :global-filter-value="globalFilterValue"
        :columns="columns"
        :title="title"
        :loading="loading"
        :dynamic="true"
        :show-new="true"
        :show-delete="true"
        :show-export="true"
        :show-selection="true"
        :show-actions="true"
        :show-action-buttons="true"
        :rows="10"
        :rows-per-page-options="[5, 10, 15, 20, 50]"
        new-button-label="Nuevo verificador"
        delete-button-label="Eliminar"
        export-button-label="Exportar"
        search-placeholder="Busca por nombre, apellido, email, teléfono..."
        @new-item-requested-manager="onNewItemRequested"
        @delete-selected-items-requested-manager="onDeleteSelectedItems"
        @delete-item-requested-manager="onDeleteItem"
        @edit-item-requested-manager="onEditItem"
        @view-item-requested-manager="onViewItem"
        @row-select="onRowSelect"
        @row-unselect="onRowUnselect"
        @global-filter-change="onGlobalFilterChange"
        @clear-filters="clearAllFilters"
    >

      <!-- Filtro personalizado para el estado -->
      <template #filters="{ clearFilters }">
        <div class="flex align-items-center gap-2">
          <pv-dropdown
              v-model="selectedStatus"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              placeholder="Estado: Todos"
              class="w-10rem"
          />
          <!-- Botón para limpiar filtros específicos -->
          <pv-button
              class="p-button p-component p-button-text"
              @click="clearStatusFilter()"
          >
            <span class="p-button-label"> Limpiar filtros </span>
          </pv-button>
        </div>
      </template>

      <!-- Columna Personalizada de estatus de verificador -->
      <template #status="{ data }">
        <pv-tag
            :value="data.status"
            :severity="getStatusVerifiers(data.status)"
            class="text-sm"
        />
      </template>


    </data-manager>


  </div>
</template>



<style scoped>
/* Estilos específicos para highlighting de campos pendientes - usando PrimeFlex cuando es posible */
.text-orange-500 {
  color: #f97316 !important;
}

/* Estilos específicos de PrimeVue que requieren :deep() para penetrar en los componentes */
/* Botones personalizados */
:deep(.p-button.p-button-success) {
  background-color: #059669;
  border-color: #059669;
}

:deep(.p-button.p-button-success:hover) {
  background-color: #047857;
  border-color: #047857;
}

:deep(.p-button.p-button-danger) {
  background-color: #dc2626;
  border-color: #dc2626;
}

:deep(.p-button.p-button-danger:hover) {
  background-color: #b91c1c;
  border-color: #b91c1c;
}

:deep(.p-button.p-button-help.p-button-outlined) {
  color: #6366f1;
  border-color: #6366f1;
}

:deep(.p-button.p-button-help.p-button-outlined:hover) {
  background-color: #6366f1;
  color: white;
}

/* Input y Dropdown styling */
:deep(.p-inputtext) {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
}

:deep(.p-inputtext:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.p-dropdown) {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
}

:deep(.p-dropdown:not(.p-disabled).p-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Tags de estado mejorados */
:deep(.p-tag) {
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

/* Checkbox personalizado */
:deep(.p-checkbox .p-checkbox-box) {
  border: 2px solid #d1d5db;
  border-radius: 4px;
  width: 1.125rem;
  height: 1.125rem;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

/* Botones de acción en tabla */
:deep(.p-button-link) {
  color: #3b82f6 !important;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
}

:deep(.p-button-link:hover) {
  background-color: #eff6ff;
  color: #2563eb !important;
}

/* Paginador */
:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
}
</style>