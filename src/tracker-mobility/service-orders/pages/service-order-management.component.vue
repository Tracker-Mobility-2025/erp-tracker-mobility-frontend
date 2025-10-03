<script>

import DataManager from "../../../shared/components/data-manager.component.vue";
import {OrderRequestApi} from "../services/order-request-api.service.js";
import {VerifierApi} from "../services/verifier-api.service.js";

export default {
  name: "service-order-management",
  components: {
    DataManager
  },

  data() {
    return {

      // Servicio de para obtener órdenes de verificación
      orderRequestApi: null,
      // Servicio para obtener verificadores
      verifierApi: null,


      // Array de órdenes de verificación
      itemsArray: [],

      // Array para verificadores
      verifiersArray: [],

      // Definición de columnas para la tabla
      columns: [
        { field: 'orderCode', header: 'Código de orden', sortable: true, style: 'width: 160px;' },
        { field: 'status', header: 'Estado', sortable: true, template: 'status', style: 'width: 120px;' },
        { field: 'applicantCompany.companyName', header: 'Solicitante', sortable: true, style: 'width: 150px;' },
        { field: 'verificador', header: 'Verificador', sortable: true, template: 'verificador', style: 'width: 150px;' },
        { field: 'programacion', header: 'Programación', sortable: true, template: 'programacion', style: 'width: 140px;' }
      ],

      globalFilterValue: '', // Valor del filtro global de búsqueda
      selectedDate: null, // Fecha seleccionada en el filtro
      selectedStatus: null, // Filtro de estado seleccionado
      statusOptions: [
        { label: 'Todos', value: null },
        { label: 'Pendiente', value: 'PENDIENTE' },
        { label: 'Asignado', value: 'ASIGNADO' },
        { label: 'En Proceso', value: 'EN_PROCESO' },
        { label: 'Finalizado', value: 'FINALIZADO' }
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

      // Filtro por búsqueda global (código de orden, solicitante, verificador)
      if (this.globalFilterValue) {
        const searchTerm = this.globalFilterValue.toLowerCase().trim();
        filtered = filtered.filter(order => {
          // Buscar en código de orden
          const orderCodeMatch = order.orderCode?.toLowerCase().includes(searchTerm);
          
          // Buscar en nombre de la empresa solicitante
          const companyMatch = order.applicantCompany?.companyName?.toLowerCase().includes(searchTerm);
          
          // Buscar en nombre del verificador (si está asignado)
          let verifierMatch = false;
          if (order.homeVisitDetails?.verifierId) {
            const verifierName = this.getVerifierById(order.homeVisitDetails.verifierId);
            verifierMatch = verifierName.toLowerCase().includes(searchTerm);
          }
          
          return orderCodeMatch || companyMatch || verifierMatch;
        });
      }

      // Filtro por estado seleccionado
      if (this.selectedStatus) {
        filtered = filtered.filter(order => {
          // Verificar si el estado coincide exactamente
          return order.status === this.selectedStatus;
        });
      }

      // Filtro por fecha seleccionada (fecha de visita programada)
      if (this.selectedDate) {
        // Usar formato local para evitar problemas de zona horaria
        const selectedDateStr = this.formatDateToLocal(this.selectedDate);
        
        filtered = filtered.filter(order => {
          if (order.homeVisitDetails?.visitDate) {
            try {
              // Parsear la fecha usando formato local para evitar diferencias de zona horaria
              const visitDateStr = this.formatDateToLocal(new Date(order.homeVisitDetails.visitDate + 'T00:00:00'));
              return visitDateStr === selectedDateStr;
            } catch (error) {
              console.warn('Error parsing visitDate:', order.homeVisitDetails.visitDate, error);
              return false;
            }
          }
          return false;
        });
      }

      return filtered;
    },

  },


  methods: {

    getVerifierById(verifierId) {
      if (!verifierId || !this.verifiersArray.length) {
        return 'PENDIENTE';
      }

      const verifier = this.verifiersArray.find(v => v.id === verifierId);
      return verifier ? verifier.name : 'PENDIENTE';
    },

    getVisitDate(homeVisitDetails) {
      if (!homeVisitDetails || !homeVisitDetails.visitDate) {
        return 'PENDIENTE';
      }
      
      // Formatear la fecha para mostrar en formato legible, evitando problemas de zona horaria
      const date = new Date(homeVisitDetails.visitDate + 'T00:00:00');
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },

    // Método auxiliar para formatear fechas de manera consistente
    formatDateToLocal(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    // Eliminar múltiples órdenes seleccionadas
    onDeleteSelectedItems(selectedItems) {
      // Recorrer cada orden seleccionada y eliminarla
      selectedItems.forEach(item => {
        this.deleteOrder(item.id);
      });
    },

    // Navegar a la vista de detalles de la orden
    onViewItem(item) {
      console.log('Ver detalles de orden:', item);
      // Implementar navegación a vista de detalles

      // Navegar con router a /admin/order-details
      this.$router.push({
        name: 'order-details',
        query: { id: item.id }
      });



    },

    // Limpia todos los filtros (global, estado, fecha)
    onClearFilters() {
      this.globalFilterValue = '';
      this.selectedStatus = null;
      this.selectedDate = null;
    },

    // Actualiza el valor del filtro global
    onGlobalFilterChange(value) {
      this.globalFilterValue = value;
    },

    // Retorna la severidad para el tag de estado
    getStatusSeverity(status) {
      switch (status) {
        case 'PENDIENTE':
          return 'warn';
        case 'ASIGNADO':
          return 'info';
        case 'EN_PROCESO':
          return 'info';
        case 'FINALIZADO':
          return 'success';
        default:
          return 'info';
      }
    },

    deleteOrder(orderId) {

      this.loading = true;
      this.orderRequestApi.delete(orderId).then(() => {
        // Eliminar la orden del array local
        this.itemsArray = this.itemsArray.filter(order => order.id !== orderId);
        // Mostrar mensaje de éxito
        this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Orden eliminada correctamente', life: 3000 });

      }).catch(error => {

        console.error('Error al eliminar la orden:', error);

      }).finally(() => {
        this.loading = false;
      });
    },

    // Retornar todas las órdenes desde la API (si se implementa)
    getAllOrders() {
      this.loading = true;
      this.orderRequestApi.getAll().then(response => {
          this.itemsArray = response.data;
        })
        .catch(error => {
          console.error('Error al cargar las órdenes:', error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // Retorna todos los verificadores
    getAllVerifiers() {
      this.loading = true;
      this.verifierApi.getAll().then(response => {
          this.verifiersArray = response.data;
        })
        .catch(error => {
          console.error('Error al cargar los verificadores:', error);
        })
        .finally(() => {
          this.loading = false;
        });
    }

  },

  created() {

    this.orderRequestApi = new OrderRequestApi('/orders');
    this.verifierApi = new VerifierApi('/verifiers');
    // Aquí podrías cargar las órdenes desde una API si es necesario
    this.getAllOrders();
    this.getAllVerifiers();

  }
}
</script>

<template>



  <div class="h-full overflow-hidden flex flex-column p-4">

    <!-- Título de la página -->
    <h2 class="text-2xl font-bold mb-2">Gestión de órdenes de verificación</h2>
    <p>Administra las órdenes de verificación, asigna verificadores y programa visitas.</p>

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
      search-placeholder="Busca por código de orden, solicitante, verificador..."
      @delete-selected-items-requested-manager="onDeleteSelectedItems"
      @delete-item-requested-manager="onDeleteItem"
      @view-item-requested-manager="onViewItem"
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

      <!-- Custom Status Column -->
      <template #status="{ data }">
        <pv-tag 
          :value="data.status"
          :severity="getStatusSeverity(data.status)"
          class="text-sm"
        />
      </template>

      <!-- Custom Verificador Column -->
      <template #verificador="{ data }">
        <span :class="{ 'text-orange-500 font-medium': !data.homeVisitDetails || !data.homeVisitDetails.verifierId }">
          {{ data.homeVisitDetails && data.homeVisitDetails.verifierId
              ? getVerifierById(data.homeVisitDetails.verifierId)
              : 'PENDIENTE' }}
        </span>
      </template>

      <!-- Custom Programacion Column -->
      <template #programacion="{ data }">
        <span :class="{ 'text-orange-500 font-medium': !data.homeVisitDetails || !data.homeVisitDetails.visitDate }">
          {{ data.homeVisitDetails && data.homeVisitDetails.visitDate
              ? getVisitDate(data.homeVisitDetails)
              : 'PENDIENTE' }}
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