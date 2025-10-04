<script>

import DataManager from "../../../shared/components/data-manager.component.vue";
import {ReportApiService} from "../services/reports-api.service.js";
import {VerificationReport} from "../models/verification-report.entity.js";

export default {
  name: 'verification-reports-management',
  components: {DataManager},

  data(){
    return {

      // Servicio para manejar reportes de verificación
      reportApiService: new ReportApiService('/reports'),

      itemsArray:[],

      columns: [
        { field: 'reportCode', header: 'Código Informe', sortable: true, style: 'width: 150px;' },
        { field: 'orderCode', header: 'Código Orden', sortable: true, style: 'width: 150px;' },
        { field: 'clientName', header: 'Cliente', sortable: true, style: 'width: 200px;' },
        { field: 'companyName', header: 'Empresa Solicitante', sortable: true, style: 'width: 200px;' },
        { field: 'requestDate', header: 'Fecha Solicitud', sortable: true, template: 'requestDate', style: 'width: 140px;' },
        { field: 'finalResult', header: 'Resultado', sortable: true, template: 'result', style: 'width: 120px;' },
      ],

      globalFilterValue: '', // Valor del filtro global de búsqueda
      selectedDate: null, // Fecha seleccionada en el filtro
      selectedStatus: null, // Estado seleccionado en el filtro
      statusOptions: [      // Opciones de estado para el filtro
        { label: 'Todos', value: null },
        { label: 'Conforme', value: 'CONFORME' },
        { label: 'Observado', value: 'OBSERVADO' },
        { label: 'Rechazado', value: 'RECHAZADO' },
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

      // Filtro por búsqueda global (nombre de cliente, código reporte, código orden, empresa)
      if (this.globalFilterValue) {
        const searchTerm = this.globalFilterValue.toLowerCase().trim();
        filtered = filtered.filter(report =>
          (report.clientName && report.clientName.toLowerCase().includes(searchTerm)) ||
          (report.reportCode && report.reportCode.toLowerCase().includes(searchTerm)) ||
          (report.orderCode && report.orderCode.toLowerCase().includes(searchTerm)) ||
          (report.companyName && report.companyName.toLowerCase().includes(searchTerm))
        );
      }

      // Filtro por estado seleccionado
      if (this.selectedStatus) {
        filtered = filtered.filter(report => report.finalResult === this.selectedStatus);
      }

      // Filtro por fecha seleccionada
      if (this.selectedDate) {
        const selectedDateStr = this.selectedDate.toISOString().split('T')[0];
        filtered = filtered.filter(report => report.requestDate === selectedDateStr);
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
      console.log('Ver detalles de informe:', item);
      // Navegar a vista de detalles pasando el ID del informe
      this.$router.push({ 
        name: 'verification-reports-details', 
        query: { id: item.id } 
      });
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
        case 'CONFORME':
          return 'success';
        case 'OBSERVADO':
          return 'warn';
        case 'RECHAZADO':
          return 'danger';
        default:
          return 'info';
      }
    },

    formatDate(dateString) {
      if (!dateString) return '';
      
      try {
        // Crear objeto Date desde el string
        const date = new Date(dateString);
        
        // Verificar que la fecha sea válida
        if (isNaN(date.getTime())) return dateString;
        
        // Formatear como dd/mm/aaaa
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
      } catch (error) {
        console.error('Error al formatear fecha:', error);
        return dateString;
      }
    },




    getAll() {
      this.loading = true;
      this.reportApiService.getAll().then(response => {
        // Validar que la respuesta tenga datos
        if (!response || !response.data || !Array.isArray(response.data)) {
          throw new Error('Formato de respuesta inválido de la API');
        }

        // Mapear los datos de la API a la estructura esperada por la tabla
        this.itemsArray = response.data.map(item => {
          // Crear el objeto VerificationReport para mantener la estructura del modelo
          const report = new VerificationReport(item);
          
          // Agregar propiedades calculadas para la tabla
          return {
            ...report,
            // Campos para mostrar en la tabla
            reportCode: item.reportCode || 'N/A',
            orderCode: item.order?.orderCode || 'N/A',
            clientName: item.order?.client ? `${item.order.client.name || ''} ${item.order.client.lastName || ''}`.trim() : 'Cliente no especificado',
            companyName: item.order?.applicantCompany?.companyName || 'Empresa no especificada',
            requestDate: item.order?.requestDate || '',
            finalResult: item.finalResult || 'PENDIENTE',
            
            // Mantener referencia al objeto completo para usar en detalles
            fullData: item
          };
        });

        console.log('Informes de verificación procesados:', this.itemsArray);

        
      }).catch(error => {
        console.error('Error al obtener los informes de verificación:', error);
        this.itemsArray = []; // Limpiar datos en caso de error
        
        let errorMessage = 'No se pudieron cargar los informes de verificación';
        if (error.message) {
          errorMessage += `: ${error.message}`;
        }
        
        this.$toast.add({
          severity: 'error',
          summary: 'Error de carga',
          detail: errorMessage,
          life: 5000
        });
      }).finally(() => {
        this.loading = false;
      });
    }



  },



  created() {
    // Inicialización del servicio API - usar el endpoint correcto
    this.reportApiService = new ReportApiService('/reports');
    
    // Cargar datos al inicializar el componente
    this.getAll();
  }


};

</script>

<template>

  <div class="h-full overflow-hidden flex flex-column p-4">

    <!-- Título de la página -->
    <h2 class="text-3xl font-bold mb-2"> Reportes de visitas domiciliarias </h2>
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
        search-placeholder="Busca por código, cliente, empresa solicitante..."
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
              class="flex-1 h-full"
          />
          <!-- Filtro por fecha -->
          <pv-calendar
              id="visitDate"
              v-model="selectedDate"
              placeholder="dd/mm/aaaa"
              dateFormat="dd/mm/yy"
              show-icon
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


      <!-- Template para el campo "result" -->
      <template #result="{ data }">
        <pv-tag
            :value="data.finalResult"
            :severity="getStatusSeverity(data.finalResult)"
            class="text-sm"
        />
      </template>

      <!-- Template para el campo "requestDate" -->
      <template #requestDate="{ data }">
        <span>{{ formatDate(data.requestDate) }}</span>
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