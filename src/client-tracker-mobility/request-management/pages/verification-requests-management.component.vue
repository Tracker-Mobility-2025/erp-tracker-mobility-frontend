<script>

import {VerificationRequest} from "../models/verification-request.entity.js";
import {VerificationRequestsApi} from "../services/verification-requests-api.service.js";
import {useAuthenticationStore} from "../../../tracker-mobility/security/services/authentication.store.js";
import DataManager from "../../../shared/components/data-manager.component.vue";

export default {
  name: 'verification-requests-management',

  components: {
    DataManager
  },

  data() {
    return {

      // Servicio para obtener las solicitudes de verificación
      verificationRequestsApi: null,

      // Array de órdenes de verificación
      itemsArray: [],

      columns: [
        { field: 'orderCode', header: 'Código de solicitud', sortable: true, style: 'width: 160px;' },
        { field: 'requestDate', header: 'Fecha de solicitud', sortable: true, template: 'requestDate', style: 'width: 150px;' },
        { field: 'status', header: 'Estado', sortable: true, template: 'status', style: 'width: 120px;' },
        { field: 'clientName', header: 'Cliente', sortable: true, template: 'clientName', style: 'width: 180px;' },
        { field: 'client.phoneNumber', header: 'Contacto', sortable: true, style: 'width: 140px;' }
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
        singular: 'Solicitud de verificación',
        plural: 'Solicitud de verificación'
      },
      loading: false

    };
  },

  computed: {



    // Filtro combinado que aplica todos los filtros activos
    // Filtros basados en las columnas visibles del DataTable:
    // 1. Código de solicitud
    // 2. Fecha de solicitud
    // 3. Estado
    // 4. Cliente (nombre completo)
    // 5. Contacto (teléfono)
    filteredItemsArray() {
      let filtered = [...this.itemsArray];

      // Filtro por búsqueda global - busca en todas las columnas visibles
      if (this.globalFilterValue && this.globalFilterValue.trim().length > 0) {
        const searchTerm = this.globalFilterValue.toLowerCase().trim();
        
        filtered = filtered.filter(order => {
          // Helper para buscar de forma segura
          const safeSearch = (value) => {
            if (!value) return false;
            return String(value).toLowerCase().trim().includes(searchTerm);
          };

          // 1. Buscar en Código de solicitud
          const orderCodeMatch = safeSearch(order.orderCode);

          // 2. Buscar en Fecha de solicitud (formato dd/mm/aaaa)
          const requestDateMatch = order.requestDate && safeSearch(this.formatDate(order.requestDate));

          // 3. Buscar en Estado (normalizar guiones bajos)
          const statusMatch = order.status && safeSearch(order.status.replace(/_/g, ' '));

          // 4. Buscar en Cliente (nombre completo)
          const clientNameMatch = order.client?.getFullName && safeSearch(order.client.getFullName());

          // 5. Buscar en Contacto (teléfono del cliente)
          const phoneMatch = safeSearch(order.client?.phoneNumber);

          return orderCodeMatch || requestDateMatch || statusMatch || clientNameMatch || phoneMatch;
        });
      }

      // Filtro por estado seleccionado
      if (this.selectedStatus) {
        filtered = filtered.filter(order => order.status === this.selectedStatus);
      }

      // Filtro por fecha de solicitud (sin problemas de zona horaria)
      if (this.selectedDate) {
        const selectedDateStr = this.formatDateForComparison(this.selectedDate);

        filtered = filtered.filter(order => {
          if (order.requestDate) {
            try {
              // Usar el método parseLocalDate para evitar conversión de zona horaria
              const requestDateStr = this.formatDateForComparison(order.requestDate);
              return requestDateStr === selectedDateStr;
            } catch (error) {
              console.warn('Error parsing requestDate:', order.requestDate, error);
              return false;
            }
          }
          return false;
        });
      }

      return filtered;
    },


    currentUser() {
      const authStore = useAuthenticationStore();
      return {
        username: authStore.currentUsername,
        role: authStore.currentRole,
        isSignedIn: authStore.isSignedIn
      };
    },



  },

  methods: {

    // Eliminar múltiples órdenes seleccionadas
    onDeleteSelectedItems(selectedItems) {
      // Recorrer cada orden seleccionada y eliminarla
      selectedItems.forEach(item => {
        this.deleteOrder(item.id);
      });
    },

    // Eliminar una orden individual
    onDeleteItem(item) {
      console.log('Eliminar orden individual:', item);
      this.deleteOrder(item.id);
    },

    // Navegar a la vista de detalles de la solicitud
    onViewItem(item) {
      console.log('Ver detalles de solicitud:', item);
      this.$router.push({
        name: 'verification-request-details',
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

    // Parsear fecha string a objeto Date local (sin conversión de zona horaria)
    parseLocalDate(dateString) {
      if (!dateString) return null;
      
      try {
        // Si es formato ISO (YYYY-MM-DD), parsear como fecha local
        if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
          const [datePart] = dateString.split('T');
          const [year, month, day] = datePart.split('-').map(Number);
          // Crear fecha local sin conversión UTC
          return new Date(year, month - 1, day);
        }
        
        // Si ya es un objeto Date, retornarlo
        if (dateString instanceof Date) {
          return dateString;
        }
        
        // Para otros formatos, intentar parsear normalmente
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
      } catch (error) {
        console.error('Error al parsear fecha:', error);
        return null;
      }
    },

    // Formatear fecha a formato dd/mm/aaaa para visualización
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      
      try {
        // Usar parseLocalDate para evitar problemas de zona horaria
        const date = this.parseLocalDate(dateString);
        
        // Verificar si la fecha es válida
        if (!date || isNaN(date.getTime())) return 'Fecha inválida';
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
      } catch (error) {
        console.error('Error al formatear fecha:', error);
        return 'Error';
      }
    },

    // Formatear fecha para comparación (aaaa-mm-dd) sin conversión de zona horaria
    formatDateForComparison(dateInput) {
      if (!dateInput) return null;
      
      try {
        let date;
        
        // Si es un objeto Date del calendar de PrimeVue
        if (dateInput instanceof Date) {
          date = dateInput;
        } else {
          // Si es un string, parsearlo como fecha local
          date = this.parseLocalDate(dateInput);
        }
        
        if (!date || isNaN(date.getTime())) return null;
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      } catch (error) {
        console.error('Error al formatear fecha para comparación:', error);
        return null;
      }
    },

    // Función modular para manejar errores de servidor
    handleServerError(error, context = 'datos') {
      console.error(`Error al cargar ${context}:`, error);

      // Determinar si mostrar toast basado en el tipo de error
      let errorMessage = '';
      let showToast = false;

      if (error.response) {
        // Error de respuesta del servidor (4xx, 5xx)
        const status = error.response.status;
        showToast = true;

        if (status >= 500) {
          errorMessage = `Error interno del servidor al cargar ${context}. Por favor, contacte al administrador.`;
        } else if (status >= 400) {
          errorMessage = `Error en la solicitud de ${context}. Verifique los permisos de acceso.`;
        } else {
          errorMessage = `Error del servidor (${status}) al cargar ${context}.`;
        }
      } else if (error.request) {
        // Error de red o conexión
        showToast = true;
        errorMessage = `No se pudo conectar con el servidor para cargar ${context}. Verifique su conexión a internet.`;
      } else if (error.message && (error.message.includes('inválido') || error.message.includes('formato'))) {
        // Error de formato de datos del servidor
        showToast = true;
        errorMessage = `Error en el formato de datos del servidor: ${error.message}`;
      }

      if (showToast) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error del servidor',
          detail: errorMessage,
          life: 7000
        });
      }
    },

    // Función modular para validar respuesta del servidor
    validateServerResponse(response, context = 'datos') {
      if (!response || !response.hasOwnProperty('data') || !Array.isArray(response.data)) {
        throw new Error(`Formato de ${context} inválido del servidor`);
      }
      return true;
    },


    // Recuperar las solicitudes de verificación por empleado de empresa
    getVerificationRequestsByCompanyEmployee() {

      this.loading = true;
      this.verificationRequestsApi.getVerificationRequestsByEmployeeEmail(this.currentUser.username).then(response => {

        this.validateServerResponse(response, 'solicitudes de verificación');

        // Mapear los datos recibidos a entidades VerificationRequest
        this.itemsArray = response.data.map(item => new VerificationRequest(item));

        console.log('===== Solicitudes de Verificación del trabajador =====',this.itemsArray);

      }).catch(error => {
        this.handleServerError(error, 'solicitudes de verificación');
      }).finally(() => {
        this.loading = false;
      });
    }

  },


  created() {

    this.verificationRequestsApi = new VerificationRequestsApi('/orders');

    this.getVerificationRequestsByCompanyEmployee();

  }

};

</script>

<template>

  <div class="h-full overflow-hidden flex flex-column p-4">
    <!-- Header con título + descripción y resúmenes -->
    <div class="flex justify-content-between align-items-center mb-1">
      <!-- Título y descripción -->
      <div class="flex flex-column">
        <h2 class="text-3xl font-bold mb-2">Gestión de solicitudes de verificación</h2>
        <p>Administra las solicitudes de verificación domiciliarias solicitadas.</p>
      </div>

      <!-- Resumen de cantidad de órdenes -->
      <div class="flex gap-3 flex-wrap">
        <!-- Total de órdenes -->
        <div class="flex align-items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 border-round border-1 border-blue-200">
          <i class="pi pi-file-o text-blue-600"></i>
          <span class="font-semibold text-sm">Total:</span>
          <span class="font-bold">{{ itemsArray.length }}</span>
        </div>

        <!-- Órdenes Finalizadas -->
        <div class="flex align-items-center gap-2 bg-green-50 text-green-700 px-3 py-1 border-round border-1 border-green-200">
          <i class="pi pi-check-circle text-green-600"></i>
          <span class="font-semibold text-sm">Finalizadas:</span>
          <span class="font-bold">{{ itemsArray.filter(o => o.status === 'FINALIZADO').length }}</span>
        </div>

        <!-- Órdenes Pendientes -->
        <div class="flex align-items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1 border-round border-1 border-orange-200">
          <i class="pi pi-clock text-orange-600"></i>
          <span class="font-semibold text-sm">Pendientes:</span>
          <span class="font-bold">{{ itemsArray.filter(o => o.status === 'PENDIENTE').length }}</span>
        </div>

        <!-- Órdenes En Proceso -->
        <div class="flex align-items-center gap-2 bg-cyan-50 text-cyan-700 px-3 py-1 border-round border-1 border-cyan-200">
          <i class="pi pi-cog text-cyan-600"></i>
          <span class="font-semibold text-sm">En Proceso:</span>
          <span class="font-bold">{{ itemsArray.filter(o => o.status === 'EN_PROCESO' || o.status === 'ASIGNADO').length }}</span>
        </div>
      </div>
    </div>

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
        search-placeholder="Busca por código, fecha, estado, cliente o teléfono..."
        @delete-selected-items-requested-manager="onDeleteSelectedItems"
        @delete-item-requested-manager="onDeleteItem"
        @view-item-requested-manager="onViewItem"
        @global-filter-change="onGlobalFilterChange"
        @clear-filters="onClearFilters"
    >
      <!-- Custom Filters -->
      <template #filters="{ clearFilters }">
        <div class="flex align-items-center gap-2">

          <!-- Filtro por estado -->
          <pv-select
              v-model="selectedStatus"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              placeholder="Estado: Todos"
              class="flex-1 h-full"
          />
          
          <!-- Filtro por fecha de solicitud -->
          <pv-calendar
              id="requestDate"
              v-model="selectedDate"
              placeholder="Fecha de solicitud"
              dateFormat="dd/mm/yy"
              show-icon
              class="flex-1 h-full"
          />
          
          <!-- Botón para limpiar filtros -->
          <pv-button
              label="Limpiar filtros"
              icon="pi pi-filter-slash"
              @click="onClearFilters()"
              class="p-button-secondary flex-shrink-0 h-full"
          />
        </div>
      </template>

      <!-- Custom Request Date Column -->
      <template #requestDate="{ data }">
        <span>{{ formatDate(data.requestDate) }}</span>
      </template>

      <!-- Custom Status Column -->
      <template #status="{ data }">
        <pv-tag
            :value="data.status"
            :severity="getStatusSeverity(data.status)"
            class="text-sm"
        />
      </template>

      <!-- Custom Client Name Column -->
      <template #clientName="{ data }">
        <span>{{ data.client ? data.client.getFullName() : 'N/A' }}</span>
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

</style>