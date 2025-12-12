<script>

import DataManager from "../../../shared/components/data-manager.component.vue";
import {OrderRequestApi} from "../services/order-request-api.service.js";
import {VerifierApi} from "../services/verifier-api.service.js";
import {NotificationMixin} from "../../../shared/utils/notification.utils.js";
import {OrderService} from "../models/order-service.entity.js";
import {useAuthenticationStore} from "../../security/services/authentication.store.js";

// Constantes de configuración
const STATUS_OPTIONS = [
  { label: 'Todos', value: null },
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Asignado', value: 'ASIGNADO' },
  { label: 'En Proceso', value: 'EN_PROCESO' },
  { label: 'Completada', value: 'COMPLETADA' },
  { label: 'Cancelada', value: 'CANCELADA' },
  { label: 'Observado', value: 'OBSERVADO' },
  { label: 'Subsanada', value: 'SUBSANADA' }
];

const STATUS_CLASSES = {
  'PENDIENTE': 'status-pendiente',
  'ASIGNADO': 'status-asignado',
  'EN_PROCESO': 'status-en-proceso',
  'COMPLETADA': 'status-completada',
  'CANCELADA': 'status-cancelada',
  'OBSERVADO': 'status-observado',
  'SUBSANADA': 'status-subsanada'
};

const COLUMNS_CONFIG = [
  { field: 'orderCode', header: 'Código de orden', sortable: true, style: 'width: 120px;' },
  { field: 'cliente', header: 'Cliente', sortable: true, template: 'cliente', style: 'width: 200px;' },
  { field: 'status', header: 'Estado', sortable: true, template: 'status', style: 'width: 120px;' },
  { field: 'applicantCompany.companyName', header: 'Solicitante', sortable: true, style: 'width: 150px;' },
  { field: 'verificador', header: 'Verificador', sortable: true, template: 'verificador', style: 'width: 150px;' },
  { field: 'programacion', header: 'Programación', sortable: true, template: 'programacion', style: 'width: 140px;' }
];

const LOADING_TIMEOUT_DURATION = 15000;

export default {
  name: "service-order-management",
  
  mixins: [NotificationMixin],
  
  components: { DataManager },

  data() {
    return {
      orderRequestApi: new OrderRequestApi('/orders'),
      verifierApi: new VerifierApi('/verifiers'),
      itemsArray: [],
      verifiersArray: [],
      columns: COLUMNS_CONFIG,
      globalFilterValue: '',
      selectedDate: null,
      selectedStatus: null,
      statusOptions: STATUS_OPTIONS,
      title: { singular: 'orden de verificación', plural: 'órdenes de verificación' },
      loading: false,
      loadingTimeout: null,
      hasLoadingError: false
    };
  },


  computed: {
    filteredItemsArray() {
      let filtered = [...this.itemsArray];

      // Filtro de búsqueda global
      if (this.globalFilterValue?.trim()) {
        const searchTerm = this.normalizeText(this.globalFilterValue);
        filtered = filtered.filter(order => {
          const orderCode = order.orderCode ? this.normalizeText(order.orderCode) : '';
          const company = order.applicantCompany?.companyName ? this.normalizeText(order.applicantCompany.companyName) : '';
          const verifier = order.homeVisitDetails?.verifierId ? this.normalizeText(this.getVerifierById(order.homeVisitDetails.verifierId)) : '';
          const client = order.client ? this.normalizeText(this.getClientFullName(order.client)) : '';

          return orderCode.includes(searchTerm) || company.includes(searchTerm) || 
                 verifier.includes(searchTerm) || client.includes(searchTerm);
        });
      }

      // Filtro por estado
      if (this.selectedStatus) {
        filtered = filtered.filter(order => order.status === this.selectedStatus);
      }

      // Filtro por fecha de visita
      if (this.selectedDate) {
        const selectedDateStr = this.formatDateToLocal(this.selectedDate);
        filtered = filtered.filter(order => {
          if (!order.homeVisitDetails?.visitDate) return false;
          try {
            const visitDateStr = this.formatDateToLocal(new Date(order.homeVisitDetails.visitDate + 'T00:00:00'));
            return visitDateStr === selectedDateStr;
          } catch (error) {
            console.warn('Error parsing visitDate:', order.homeVisitDetails.visitDate, error);
            return false;
          }
        });
      }

      return filtered;
    },

    // Verificar si el usuario actual es MASTER_ADMIN
    isMasterAdmin() {
      const authStore = useAuthenticationStore();
      return authStore.currentRole === 'MASTER_ADMIN';
    },

    // Habilitar eliminación solo para MASTER_ADMIN
    canDelete() {
      return this.isMasterAdmin;
    }
  },


  methods: {
    normalizeText(text) {
      return text.toLowerCase().trim().replace(/\s+/g, ' ');
    },

    getClientFullName(client) {
      if (!client?.name || !client?.lastName) return 'Sin datos';
      return client.getFullName?.() || `${client.name} ${client.lastName}`;
    },

    getVerifierById(verifierId) {
      if (!verifierId || !this.verifiersArray.length) return 'PENDIENTE';
      return this.verifiersArray.find(v => v.id === verifierId)?.name || 'PENDIENTE';
    },

    getVisitDate(homeVisitDetails) {
      if (!homeVisitDetails?.visitDate) return 'PENDIENTE';
      const date = new Date(homeVisitDetails.visitDate + 'T00:00:00');
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    },

    formatDateToLocal(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    async onDeleteSelectedItems(selectedItems) {
      this.loading = true;
      try {
        await Promise.all(selectedItems.map(item => this.orderRequestApi.delete(item.id)));
        this.itemsArray = this.itemsArray.filter(order => !selectedItems.some(item => item.id === order.id));
        this.showToast({ severity: 'success', summary: 'Éxito', detail: `${selectedItems.length} orden(es) eliminada(s) correctamente` });
      } catch (error) {
        console.error('Error al eliminar órdenes:', error);
        this.showToast({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar algunas órdenes' });
      } finally {
        this.loading = false;
      }
    },

    onDeleteItem(item) {
      this.deleteOrder(item.id);
    },

    onViewItem(item) {
      this.$router.push({ name: 'order-details', query: { id: item.id } });
    },

    onClearFilters() {
      Object.assign(this, { globalFilterValue: '', selectedStatus: null, selectedDate: null });
    },

    onGlobalFilterChange(value) {
      this.globalFilterValue = value;
    },

    getStatusClass(status) {
      return STATUS_CLASSES[status] || 'status-default';
    },

    getCountByStatus(status) {
      if (status === 'EN_PROCESO') {
        return this.itemsArray.filter(o => ['EN_PROCESO', 'ASIGNADO'].includes(o.status)).length;
      }
      return this.itemsArray.filter(o => o.status === status).length;
    },

    handleServerError(error, context = 'datos') {
      console.error(`Error al cargar ${context}:`, error);

      let errorMessage = '';
      if (error.response) {
        const { status } = error.response;
        errorMessage = status >= 500 
          ? `Error interno del servidor al cargar ${context}. Contacte al administrador.`
          : status >= 400 
            ? `Error en la solicitud de ${context}. Verifique los permisos.`
            : `Error del servidor (${status}) al cargar ${context}.`;
      } else if (error.request) {
        errorMessage = `No se pudo conectar con el servidor. Verifique su conexión.`;
      } else if (error.message?.includes('inválido') || error.message?.includes('formato')) {
        errorMessage = `Error en el formato de datos: ${error.message}`;
      }
      
      if (errorMessage) {
        this.showToast({ severity: 'error', summary: 'Error del servidor', detail: errorMessage, life: 7000 });
      }
    },

    // Función modular para validar respuesta del servidor
    validateServerResponse(response, context = 'datos') {
      if (!response || !response.hasOwnProperty('data') || !Array.isArray(response.data)) {
        throw new Error(`Formato de ${context} inválido del servidor`);
      }
      return true;
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

    async deleteOrder(orderId) {
      this.loading = true;
      try {
        await this.orderRequestApi.delete(orderId);
        this.itemsArray = this.itemsArray.filter(order => order.id !== orderId);
        this.showToast({ severity: 'success', summary: 'Éxito', detail: 'Orden eliminada correctamente' });
      } catch (error) {
        console.error('Error al eliminar la orden:', error);
        this.showToast({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la orden' });
      } finally {
        this.loading = false;
      }
    },

    async getAllOrders() {
      try {
        const response = await this.orderRequestApi.getAll();
        this.validateServerResponse(response, 'órdenes');
        
        this.itemsArray = response.data
          .map(orderData => new OrderService(orderData))
          .sort((a, b) => {
            const dateA = this.parseLocalDate(a.requestDate);
            const dateB = this.parseLocalDate(b.requestDate);
            if (!dateA) return 1;
            if (!dateB) return -1;
            return dateB.getTime() - dateA.getTime();
          });
        
        console.log('Órdenes cargadas:', this.itemsArray.length);
      } catch (error) {
        this.itemsArray = [];
        this.handleServerError(error, 'las órdenes');
        throw error;
      }
    },

    async getAllVerifiers() {
      try {
        const response = await this.verifierApi.getAll();
        this.validateServerResponse(response, 'verificadores');
        this.verifiersArray = response.data;
        console.log('Verificadores cargados:', this.verifiersArray.length);
      } catch (error) {
        this.verifiersArray = [];
        this.handleServerError(error, 'los verificadores');
      }
    },

    async loadAllData() {
      this.loading = true;
      this.hasLoadingError = false;

      this.loadingTimeout = setTimeout(() => {
        if (this.loading) {
          this.hasLoadingError = true;
          console.warn('Carga lenta detectada');
        }
      }, LOADING_TIMEOUT_DURATION);

      try {
        await Promise.all([this.getAllOrders(), this.getAllVerifiers()]);
        this.hasLoadingError = false;
      } catch (error) {
        this.hasLoadingError = true;
        console.error('Error al cargar datos:', error);
      } finally {
        this.clearLoadingTimeout();
        this.loading = false;
      }
    },

    retryLoadData() {
      this.loadAllData();
    },

    clearLoadingTimeout() {
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = null;
      }
    }

  },

  created() {
    this.loadAllData();
  },

  beforeUnmount() {
    this.clearLoadingTimeout();
  }
}
</script>

<template>

  <div class="h-full overflow-hidden flex flex-column p-4">
    <!-- Header con título + descripción -->
    <div class="flex justify-content-between align-items-center mb-1">
      <!-- Título y descripción -->
      <div class="flex flex-column">
        <h2 class="text-3xl font-bold mb-2">Gestión de órdenes de verificación</h2>
        <p>Administra las órdenes de verificación, asigna verificadores y programa visitas.</p>
      </div>
    </div>

    <!-- Mensaje de advertencia si la carga toma mucho tiempo -->
    <pv-message
      v-if="loading && hasLoadingError"
      severity="warn"
      :closable="false"
      class="mb-3"
    >
      <div class="flex align-items-center justify-content-between w-full">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-spin pi-spinner"></i>
          <span>La carga está tomando más tiempo del esperado. Por favor, espere o intente recargar.</span>
        </div>
        <pv-button
          label="Recargar"
          icon="pi pi-refresh"
          class="p-button-sm p-button-warning"
          @click="retryLoadData"
        />
      </div>
    </pv-message>

    <!-- Mensaje de error si la carga falló -->
    <pv-message
      v-if="!loading && hasLoadingError && itemsArray.length === 0"
      severity="error"
      :closable="false"
      class="mb-3"
    >
      <div class="flex align-items-center justify-content-between w-full">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-exclamation-triangle"></i>
          <span>No se pudieron cargar las órdenes. Por favor, intente nuevamente.</span>
        </div>
        <pv-button
          label="Reintentar"
          icon="pi pi-refresh"
          class="p-button-sm p-button-danger"
          @click="retryLoadData"
        />
      </div>
    </pv-message>

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
      :show-delete="canDelete"
      :show-export="false"
      :show-selection="true"
      :show-actions="true"
      :show-action-buttons="true"
      :rows="10"
      :rows-per-page-options="[5, 10, 15, 20, 50]"
      new-button-label="Nueva Orden"
      delete-button-label="Eliminar"
      export-button-label="Exportar"
      search-placeholder="Busca por código de orden, cliente, solicitante, verificador..."
      @delete-selected-items-requested-manager="onDeleteSelectedItems"
      @delete-item-requested-manager="onDeleteItem"
      @view-item-requested-manager="onViewItem"
      @global-filter-change="onGlobalFilterChange"
      @clear-filters="onClearFilters"
    >
      <!-- Custom Filters -->
      <template #filters="{ clearFilters }">
        <div class="flex align-items-center gap-2">

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
                  class="badge-custom ml-2"
                  :class="getStatusClass(slotProps.option.value)"
                >
                  {{ getCountByStatus(slotProps.option.value) }}
                </span>
                <span 
                  v-else
                  class="badge-custom ml-2 status-default"
                >
                  {{ itemsArray.length }}
                </span>
              </div>
            </template>
          </pv-select>
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
        <span 
          class="status-tag"
          :class="getStatusClass(data.status)"
        >
          {{ data.status.replace(/_/g, ' ') }}
        </span>
      </template>

      <!-- Custom Cliente Column -->
      <template #cliente="{ data }">
        <span :class="{ 'text-gray-500 font-italic': !data.client }">
          {{ data.client ? getClientFullName(data.client) : 'Sin datos' }}
        </span>
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
/* Badges personalizados para filtros */
.badge-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.5rem;
}

/* Tags de estado personalizados */
.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
}

/* Estilos usando variables CSS corporativas */
.text-orange-500 {
  color: var(--color-warning) !important;
}

/* Los estilos de botones ahora son globales en style.css */

/* Los estilos de input y dropdown ahora son globales en style.css */

/* Los estilos de tags y checkboxes ahora son globales en style.css */

/* Los estilos de botones de acción, paginador, tabla y toolbar ahora son globales en style.css */
</style>