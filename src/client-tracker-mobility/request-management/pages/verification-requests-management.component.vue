<script>

import {VerificationRequest} from "../models/verification-request.entity.js";
import {VerificationRequestsApi} from "../services/verification-requests-api.service.js";
import {useAuthenticationStore} from "../../../tracker-mobility/security/services/authentication.store.js";
import DataManager from "../../../shared/components/data-manager.component.vue";

// Constants
const STATUS_OPTIONS = [
  { label: 'Todos', value: null },
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Asignado', value: 'ASIGNADO' },
  { label: 'En Proceso', value: 'EN_PROCESO' },
  { label: 'Completada', value: 'COMPLETADA' },
  { label: 'Cancelada', value: 'CANCELADA' },
  { label: 'Observado', value: 'OBSERVADO' },
  { label: 'Subsanada', value: 'SUBSANADA' },
  { label: 'Ent Faltante', value: 'ENTREVISTA_ARRENDADOR_FALTANTE' }
]

const STATUS_MAP = {
  'PENDIENTE': 'status-pendiente',
  'ASIGNADO': 'status-asignado', 
  'EN_PROCESO': 'status-en-proceso',
  'COMPLETADA': 'status-completada',
  'CANCELADA': 'status-cancelada',
  'OBSERVADO': 'status-observado',
  'SUBSANADA': 'status-subsanada',
  'ENTREVISTA_ARRENDADOR_FALTANTE': 'status-entrevista-arrendador-faltante'
}

const COLUMNS = [
  { field: 'orderCode', header: 'Código de solicitud', sortable: true, style: 'width: 160px;' },
  { field: 'requestDate', header: 'Fecha de solicitud', sortable: true, template: 'requestDate', style: 'width: 150px;' },
  { field: 'status', header: 'Estado', sortable: true, template: 'status', style: 'width: 120px;' },
  { field: 'observations', header: 'Obs. Pendientes', sortable: false, template: 'pendingObservations', style: 'width: 140px;' },
  { field: 'homeVisitDetails.visitDate', header: 'Visita', sortable: true, template: 'visitDate', style: 'width: 130px;' },
  { field: 'clientName', header: 'Cliente', sortable: true, template: 'clientName', style: 'width: 180px;' },
  { field: 'client.phoneNumber', header: 'Contacto', sortable: true, style: 'width: 140px;' }
]

const TITLE = {
  singular: 'Solicitud de verificación',
  plural: 'Solicitud de verificación'
}

export default {
  name: 'verification-requests-management',

  components: {
    DataManager
  },

  data() {
    return {
      verificationRequestsApi: null,
      itemsArray: [],
      columns: COLUMNS,
      globalFilterValue: '',
      selectedDate: null,
      selectedStatus: null,
      statusOptions: STATUS_OPTIONS,
      title: TITLE,
      loading: false
    };
  },

  computed: {
    filteredItemsArray() {
      let filtered = [...this.itemsArray];

      // Filtro por búsqueda global
      if (this.globalFilterValue?.trim().length > 0) {
        const searchTerm = this.globalFilterValue.toLowerCase().trim();
        const safeSearch = (value) => value && String(value).toLowerCase().trim().includes(searchTerm);
        
        filtered = filtered.filter(order => {
          return safeSearch(order.orderCode) ||
                 safeSearch(this.formatDate(order.requestDate)) ||
                 safeSearch(order.status?.replace(/_/g, ' ')) ||
                 safeSearch(order.client?.getFullName()) ||
                 safeSearch(order.client?.phoneNumber);
        });
      }

      // Filtro por estado
      if (this.selectedStatus) {
        filtered = filtered.filter(order => order.status === this.selectedStatus);
      }

      // Filtro por fecha
      if (this.selectedDate) {
        const selectedDateStr = this.formatDateForComparison(this.selectedDate);
        filtered = filtered.filter(order => {
          try {
            return order.requestDate && this.formatDateForComparison(order.requestDate) === selectedDateStr;
          } catch {
            return false;
          }
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
    }
  },

  methods: {

    // Obtener cantidad de órdenes por estado
    getCountByStatus(status) {
      if (status === 'EN_PROCESO') {
        return this.itemsArray.filter(o => o.status === 'EN_PROCESO' || o.status === 'ASIGNADO').length;
      }
      return this.itemsArray.filter(o => o.status === status).length;
    },

    // Eliminar múltiples órdenes seleccionadas
    onDeleteSelectedItems(selectedItems) {
      // Recorrer cada orden seleccionada y eliminarla
      selectedItems.forEach(item => {
        this.deleteOrder(item.id);
      });
    },

    // Eliminar una orden individual
    onDeleteItem(item) {
      this.deleteOrder(item.id);
    },

    // Navegar a la vista de detalles de la solicitud
    onViewItem(item) {
      this.$router.push({
        name: 'verification-request-details',
        query: { id: item.id }
      });
    },

    // Limpia todos los filtros
    onClearFilters() {
      Object.assign(this, {
        globalFilterValue: '',
        selectedStatus: null,
        selectedDate: null
      });
    },

    // Actualiza el valor del filtro global
    onGlobalFilterChange(value) {
      this.globalFilterValue = value;
    },

    // Retorna la clase CSS para el estado
    getStatusClass(status) {
      return STATUS_MAP[status] || 'status-default';
    },

    // Contar observaciones pendientes de una solicitud
    getPendingObservationsCount(item) {
      if (!item || !item.observations || !Array.isArray(item.observations)) {
        return 0;
      }
      return item.observations.filter(obs => obs.status === 'PENDIENTE').length;
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
        return null;
      }
    },

    // Formatear fecha a dd/mm/aaaa
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      
      try {
        const date = this.parseLocalDate(dateString);
        if (!date || isNaN(date.getTime())) return 'Fecha inválida';
        
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
      } catch {
        return 'Error';
      }
    },

    // Formatear fecha para comparación (aaaa-mm-dd)
    formatDateForComparison(dateInput) {
      if (!dateInput) return null;
      
      try {
        const date = dateInput instanceof Date ? dateInput : this.parseLocalDate(dateInput);
        if (!date || isNaN(date.getTime())) return null;
        
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      } catch {
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
    async getVerificationRequestsByCompanyEmployee() {
      this.loading = true;
      try {
        const response = await this.verificationRequestsApi.getVerificationRequestsByEmployeeEmail(this.currentUser.username);
        
        this.validateServerResponse(response, 'solicitudes de verificación');
        
        this.itemsArray = response.data.map(item => new VerificationRequest(item));

        // Ordenar por fecha de solicitud (más reciente primero)
        this.itemsArray.sort((a, b) => {
          const dateA = this.parseLocalDate(a.requestDate);
          const dateB = this.parseLocalDate(b.requestDate);
          if (!dateA) return 1;
          if (!dateB) return -1;
          return dateB.getTime() - dateA.getTime();
        });
      } catch (error) {
        this.handleServerError(error, 'solicitudes de verificación');
      } finally {
        this.loading = false;
      }
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
    <!-- Header con título + descripción -->
    <div class="mb-3">
      <h2 class="text-3xl font-bold mb-2">Gestión de solicitudes de verificación</h2>
      <p class="m-0">Administra las solicitudes de verificación domiciliarias solicitadas.</p>
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
        :show-delete="false"
        :show-export="false"
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
          >
            <template #option="slotProps">
              <div class="flex align-items-center justify-content-between w-full">
                <span>{{ slotProps.option.label }}</span>
                <span 
                  v-if="slotProps.option.value !== null"
                  class="badge-custom"
                  :class="getStatusClass(slotProps.option.value)"
                >
                  {{ getCountByStatus(slotProps.option.value) }}
                </span>
                <span 
                  v-else
                  class="badge-custom status-todos"
                >
                  {{ itemsArray.length }}
                </span>
              </div>
            </template>
          </pv-select>
          
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
        <span 
          class="status-tag"
          :class="getStatusClass(data.status)"
        >
          {{ data.status.replace(/_/g, ' ') }}
        </span>
      </template>

      <!-- Custom Pending Observations Column -->
      <template #pendingObservations="{ data }">
        <div class="flex align-items-center gap-2">
          <span 
            class="badge-custom"
            :class="getPendingObservationsCount(data) > 0 ? 'status-cancelada' : 'status-completada'"
          >
            {{ getPendingObservationsCount(data) }}
          </span>
          <span class="text-sm" :class="getPendingObservationsCount(data) > 0 ? 'text-red-600 font-semibold' : 'text-green-600'">
            {{ getPendingObservationsCount(data) > 0 ? 'Pendientes' : 'Sin observaciones' }}
          </span>
        </div>
      </template>

      <!-- Custom Visit Date Column -->
      <template #visitDate="{ data }">
        <span :class="{ 'text-orange-500 font-medium': !data.homeVisitDetails || !data.homeVisitDetails.visitDate }">
          {{ data.homeVisitDetails && data.homeVisitDetails.visitDate
            ? formatDate(data.homeVisitDetails.visitDate)
            : 'PENDIENTE' }}
        </span>
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
/* Los estilos de estados ahora están centralizados en src/style.css */
</style>