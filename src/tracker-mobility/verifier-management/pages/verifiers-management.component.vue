<script>

import DataManager from "../../../shared/components/data-manager.component.vue";

export default {
  name: 'verifiers-management',
  components: {DataManager},

  data() {
    return {

      itemsArray: [],

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
    filteredItemsArray() {
      let filtered = [...this.itemsArray];

      // Filtro por búsqueda global (nombre, apellido, email, teléfono)
      if (this.globalFilterValue) {
        const searchTerm = this.globalFilterValue.toLowerCase().trim();
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
        const index = this.itemsArray.findIndex(order => order.id === item.id);
        if (index > -1) {
          this.itemsArray.splice(index, 1);
        }
      });
    },


    onDeleteItem(item) {
      console.log('Eliminar verificador:', item);
      // Implementar lógica de eliminación individual
      const index = this.itemsArray.findIndex(order => order.id === item.id);
      if (index > -1) {
        this.itemsArray.splice(index, 1);
      }
    },

    onEditItem(item) {
      console.log('Editar orden:', item);
      // Implementar navegación a formulario de edición
    },

    onViewItem(item) {
      console.log('Ver detalles de orden:', item);
      // Navegar con router a /admin/verifiers-details
      this.$router.push({ name: 'verifier-details'});
    },

    onRowSelect(event) {
      console.log('Fila seleccionada:', event);
    },

    onRowUnselect(event) {
      console.log('Fila deseleccionada:', event);
    },

    onClearFilters() {
      this.globalFilterValue = '';
      this.selectedStatus = null;
    },

    onGlobalFilterChange(value) {
      this.globalFilterValue = value;
    },

    getStatusItemsArray(status) {
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

  created() {
    this.itemsArray = [
      { id: 1, name: 'Juan', lastname: 'Pérez', email: 'juan@gmail.com', phone: '555-1234', status: 'Activo' },
      { id: 2, name: 'María', lastname: 'Gómez', email: 'maria@gmail.com', phone: '555-5678', status: 'Inactivo' },
    ];
  }

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
        :items="itemsArray"
        :filtered-items="filteredItemsArray"
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
        @clear-filters="onClearFilters"
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
              class="flex-1 h-full"
          />

          <!-- Botón para limpiar filtros específicos -->
          <pv-button
              label="Limpiar filtros"
              icon="pi pi-filter-slash"
              @click="onClearFilters()"
              class="p-button-secondary flex-shrink-0 h-full"
          />
        </div>
      </template>

      <!-- Columna Personalizada de estatus de verificador -->
      <template #status="{ data }">
        <pv-tag
            :value="data.status"
            :severity="getStatusItemsArray(data.status)"
            class="text-sm"
        />
      </template>


    </data-manager>


  </div>
</template>



<style scoped>
/* Estilos usando variables CSS corporativas */
.text-orange-500 {
  color: var(--color-warning) !important;
}


/* Estilos específicos de PrimeVue que requieren :deep() para penetrar en los componentes */
/* Los estilos de botones ahora son globales en style.css */

/* Los estilos de input y dropdown ahora son globales en style.css */

/* Los estilos de tags y checkboxes ahora son globales en style.css */

/* Los estilos de botones de acción y paginador ahora son globales en style.css */
</style>