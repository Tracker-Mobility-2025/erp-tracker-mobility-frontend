<script>

import DataManager from "../../../shared/components/data-manager.component.vue";

export default {
  name: 'verification-reports-management',
  components: {DataManager},

  data(){
    return {

      verificationReports:[
        { reportId: 'VR001', serviceOrderId: 'SO123', petitioner: 'Carlos López', verifierName: 'Ana Martínez', resultDate: '2024-01-15', result: 'Conforme' },
        { reportId: 'VR002', serviceOrderId: 'SO124', petitioner: 'Lucía Fernández', verifierName: 'Miguel Torres', resultDate: '2024-01-16', result: 'Observado' },
        { reportId: 'VR003', serviceOrderId: 'SO125', petitioner: 'Jorge Ramírez', verifierName: 'Sofía Gómez', resultDate: '2024-01-17', result: 'Rechazado' },
        { reportId: 'VR004', serviceOrderId: 'SO126', petitioner: 'Mariana Díaz', verifierName: 'Luis Hernández', resultDate: '2024-01-18', result: 'Conforme' },
        { reportId: 'VR005', serviceOrderId: 'SO127', petitioner: 'Andrés Silva', verifierName: 'Carmen Rodríguez', resultDate: '2024-01-19', result: 'Observado' },
        { reportId: 'VR006', serviceOrderId: 'SO128', petitioner: 'Sofía Morales', verifierName: 'Diego Pérez', resultDate: '2024-01-20', result: 'Conforme' },
        { reportId: 'VR007', serviceOrderId: 'SO129', petitioner: 'Fernando Castro', verifierName: 'Laura Sánchez', resultDate: '2024-01-21', result: 'Rechazado' },
        { reportId: 'VR008', serviceOrderId: 'SO130', petitioner: 'Valentina Ruiz', verifierName: 'Javier Flores', resultDate: '2024-01-22', result: 'Conforme' },
        { reportId: 'VR009', serviceOrderId: 'SO131', petitioner: 'Diego Vargas', verifierName: 'Marta Jiménez', resultDate: '2024-01-23', result: 'Observado' },
        { reportId: 'VR010', serviceOrderId: 'SO132', petitioner: 'Camila Ortiz', verifierName: 'Ricardo Gómez', resultDate: '2024-01-24', result: 'Conforme' },
      ],

      columns: [
        { field: 'reportId', header: 'ID Informe', sortable: true, style: 'width: 120px;' },
        { field: 'serviceOrderId', header: 'ID Orden', sortable: true, style: 'width: 160px;' },
        { field: 'petitioner', header: 'Solicitante', sortable: true, style: 'width: 200px;' },
        { field: 'verifierName', header: 'Verificador', sortable: true, style: 'width: 200px;' },
        { field: 'resultDate', header: 'Fecha', sortable: true, style: 'width: 160px;' },
        { field: 'result', header: 'Resultado', sortable: true, template: 'result', style: 'width: 120px;' },
      ],

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
    filteredVerificationReports() {
      if (this.selectedStatus) {
        return this.verificationReports.filter(report => report.result === this.selectedStatus);
      }
      return this.verificationReports;
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

    getStatusVerificationReport(status) {
      switch (status) {
        case 'Conforme':
          return 'success';
        case 'Observado':
          return 'warn';
        case 'Rechazado':
          return 'danger';
        default:
          return 'info';
      }
    }

  },

  created() {

  }


};

</script>

<template>

  <div class="h-full overflow-hidden flex flex-column p-4">

    <!-- Título de la página -->
    <h2 class="text-2xl font-bold mb-2"> Reportes de visitas domiciliarias </h2>
    <p> Informes detallados de las visitas domiciliarias para las órdenes de servicio </p>

    <data-manager
        :items="filteredVerificationReports"
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
        new-button-label="Nuevo"
        delete-button-label="Eliminar"
        export-button-label="Exportar"
        search-placeholder="Busca por nombre, correo, celular......"
        @new-item-requested-manager="onNewItemRequested"
        @delete-selected-items-requested-manager="onDeleteSelectedItems"
        @delete-item-requested-manager="onDeleteItem"
        @edit-item-requested-manager="onEditItem"
        @view-item-requested-manager="onViewItem"
        @row-select="onRowSelect"
        @row-unselect="onRowUnselect"
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
              @change="() => {}"
          />
          <pv-input-text
              placeholder="mm/dd/aaaa"
              class="w-8rem"
              readonly
          />
        </div>
      </template>


      <!-- Template para el campo "result" -->
      <template #result="{ data }">
        <pv-tag
            :value="data.result"
            :severity="getStatusVerificationReport(data.result)"
            class="text-sm"
        />
      </template>



    </data-manager>





  </div>






</template>

<style scoped>

</style>