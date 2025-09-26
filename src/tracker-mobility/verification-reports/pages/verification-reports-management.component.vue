<script>

import DataManager from "../../../shared/components/data-manager.component.vue";

export default {
  name: 'verification-reports-management',
  components: {DataManager},

  data(){
    return {

      itemsArray:[],

      columns: [
        { field: 'reportId', header: 'ID Informe', sortable: true, style: 'width: 120px;' },
        { field: 'serviceOrderId', header: 'ID Orden', sortable: true, style: 'width: 160px;' },
        { field: 'petitioner', header: 'Solicitante', sortable: true, style: 'width: 200px;' },
        { field: 'verifierName', header: 'Verificador', sortable: true, style: 'width: 200px;' },
        { field: 'resultDate', header: 'Fecha', sortable: true, style: 'width: 160px;' },
        { field: 'result', header: 'Resultado', sortable: true, template: 'result', style: 'width: 120px;' },
      ],

      globalFilterValue: '', // Valor del filtro global de búsqueda
      selectedDate: null, // Fecha seleccionada en el filtro
      selectedStatus: null, // Estado seleccionado en el filtro
      statusOptions: [      // Opciones de estado para el filtro
        { label: 'Todos', value: null },
        { label: 'Conforme', value: 'Conforme' },
        { label: 'Observado', value: 'Observado' },
        { label: 'Rechazado', value: 'Rechazado' },
      ],

      title: {
        singular: 'informe de visita domiciliaria',
        plural: 'informes de visitas domiciliarias',
      },

      loading: false,

    }
  },

  computed: {
    // Filtro combinado que aplica todos los filtros activos
    filteredItemsArray() {
      let filtered = [...this.itemsArray]; // Copia del array original para filtrar sin mutar el original

      // Filtro por búsqueda global (nombre de solicitante, ID reporte, ID orden)
      if (this.globalFilterValue) {
        const searchTerm = this.globalFilterValue.toLowerCase().trim();
        filtered = filtered.filter(report =>
          report.petitioner.toLowerCase().includes(searchTerm) ||
          report.reportId.toLowerCase().includes(searchTerm) ||
          report.serviceOrderId.toLowerCase().includes(searchTerm)
        );
      }

      // Filtro por estado seleccionado
      if (this.selectedStatus) {
        filtered = filtered.filter(report => report.result === this.selectedStatus);
      }

      // Filtro por fecha seleccionada
      if (this.selectedDate) {
        const selectedDateStr = this.selectedDate.toISOString().split('T')[0];
        filtered = filtered.filter(report => report.resultDate === selectedDateStr);
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
        const index = this.itemsArray.findIndex(result => result.id === item.id);
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
      { id: 1, reportId: 'VR001', serviceOrderId: 'SO123', petitioner: 'Carlos López', verifierName: 'Ana Martínez', resultDate: '2024-01-15', result: 'Conforme' },
      { id: 2, reportId: 'VR002', serviceOrderId: 'SO124', petitioner: 'Lucía Fernández', verifierName: 'Miguel Torres', resultDate: '2024-01-16', result: 'Observado' },
      { id: 3, reportId: 'VR003', serviceOrderId: 'SO125', petitioner: 'Jorge Ramírez', verifierName: 'Sofía Gómez', resultDate: '2024-01-17', result: 'Rechazado' },
      { id: 4, reportId: 'VR004', serviceOrderId: 'SO126', petitioner: 'Mariana Díaz', verifierName: 'Luis Hernández', resultDate: '2024-01-18', result: 'Conforme' },
      { id: 5, reportId: 'VR005', serviceOrderId: 'SO127', petitioner: 'Andrés Silva', verifierName: 'Carmen Rodríguez', resultDate: '2024-01-19', result: 'Observado' },
      { id: 6, reportId: 'VR006', serviceOrderId: 'SO128', petitioner: 'Sofía Morales', verifierName: 'Diego Pérez', resultDate: '2024-01-20', result: 'Conforme' },
      { id: 7, reportId: 'VR007', serviceOrderId: 'SO129', petitioner: 'Fernando Castro', verifierName: 'Laura Sánchez', resultDate: '2024-01-21', result: 'Rechazado' },
      { id: 8 , reportId: 'VR008', serviceOrderId: 'SO130', petitioner: 'Valentina Ruiz', verifierName: 'Javier Flores', resultDate: '2024-01-22', result: 'Conforme' },
      { id: 9 , reportId: 'VR009', serviceOrderId: 'SO131', petitioner: 'Diego Vargas', verifierName: 'Marta Jiménez', resultDate: '2024-01-23', result: 'Observado' },
      { id: 10, reportId: 'VR010', serviceOrderId: 'SO132', petitioner: 'Camila Ortiz', verifierName: 'Ricardo Gómez', resultDate: '2024-01-24', result: 'Conforme' },
    ];

  }


};

</script>

<template>

  <div class="h-full overflow-hidden flex flex-column p-4">

    <!-- Título de la página -->
    <h2 class="text-2xl font-bold mb-2"> Reportes de visitas domiciliarias </h2>
    <p> Informes detallados de las visitas domiciliarias para las órdenes de servicio </p>

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
      <!-- Filtro personalizado para el estado -->
      <template #filters="{ clearFilters }" >
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


      <!-- Template para el campo "result" -->
      <template #result="{ data }">
        <pv-tag
            :value="data.result"
            :severity="getStatusSeverity(data.result)"
            class="text-sm"
        />
      </template>



    </data-manager>





  </div>






</template>

<style scoped>

</style>