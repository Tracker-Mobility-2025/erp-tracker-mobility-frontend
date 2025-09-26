<script>

import DataManager from "../../../shared/components/data-manager.component.vue";

export default {
  name: "service-order-management",
  components: {
    DataManager
  },
  data() {
    return {
      itemsArray: [
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

      globalFilterValue: '', // Valor del filtro global de búsqueda
      selectedDate: null, // Fecha seleccionada en el filtro
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
    // Filtro combinado que aplica todos los filtros activos
    filteredItemsArray() {
      let filtered = [...this.itemsArray];

      // Filtro por búsqueda global (ID, solicitante, verificador)
      if (this.globalFilterValue) {
        const searchTerm = this.globalFilterValue.toLowerCase().trim();
        filtered = filtered.filter(order =>
          order.id.toLowerCase().includes(searchTerm) ||
          order.solicitante.toLowerCase().includes(searchTerm) ||
          order.verificador.toLowerCase().includes(searchTerm)
        );
      }

      // Filtro por estado seleccionado
      if (this.selectedStatus) {
        filtered = filtered.filter(order => order.estado === this.selectedStatus);
      }

      // Filtro por fecha seleccionada
      // Filtro por fecha seleccionada
      if (this.selectedDate) {
        const selectedDateStr = this.selectedDate.toISOString().split('T')[0];
        filtered = filtered.filter(order => order.resultDate === selectedDateStr);
      }

      return filtered;
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
        const index = this.itemsArray.findIndex(order => order.id === item.id);
        if (index > -1) {
          this.itemsArray.splice(index, 1);
        }
      });
    },

    onDeleteItem(item) {
      console.log('Eliminar orden:', item);
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

    onClearFilters() {
      this.globalFilterValue = '';
      this.selectedStatus = null;
      this.selectedDate = null;
    },

    onGlobalFilterChange(value) {
      this.globalFilterValue = value;
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
  },

  created() {
    this.itemsArray = [
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
    ];

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
      :items="itemsArray"
      :filtered-items="filteredItemsArray"
      :global-filter-value="globalFilterValue"
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
      search-placeholder="Busca por ID orden, solicitante, verificador..."
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
          />
          <!-- Filtro por fecha -->
          <pv-calendar
              id="visitDate"
              v-model="selectedDate"
              placeholder="dd/mm/aaaa"
              dateFormat="dd/mm/yy"
              show-icon
              class="w-12rem p-calendar"
          />

          <!-- Botón para limpiar filtros específicos -->
          <pv-button
              class="p-button p-component p-button-text"
              @click="onClearFilters()"
          >
            <span class="p-button-label"> Limpiar filtros </span>
          </pv-button>
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

/* Los estilos de botones ahora son globales en style.css */

/* Los estilos de input y dropdown ahora son globales en style.css */

/* Los estilos de tags y checkboxes ahora son globales en style.css */

/* Los estilos de botones de acción, paginador, tabla y toolbar ahora son globales en style.css */
</style>