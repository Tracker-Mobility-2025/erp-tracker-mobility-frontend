<script>

import DataManager from "../../../shared/components/data-manager.component.vue";
import {OrderRequestApi} from "../services/order-request-api.service.js";
import {VerifierApi} from "../services/verifier-api.service.js";
import {NotificationMixin} from "../../../shared/utils/notification.utils.js";
import {OrderService} from "../models/order-service.entity.js";

export default {
  name: "service-order-management",
  components: {
    DataManager
  },

  // Usar el mixin para notificaciones
  mixins: [NotificationMixin],

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
        { field: 'orderCode', header: 'Código de orden', sortable: true, style: 'width: 120px;' },
        { field: 'cliente', header: 'Cliente', sortable: true, template: 'cliente', style: 'width: 200px;' },
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
        { label: 'Completada', value: 'COMPLETADA' },
        { label: 'Cancelada', value: 'CANCELADA' },
        { label: 'Observado', value: 'OBSERVADO' },
        { label: 'Subsanada', value: 'SUBSANADA' }
      ],
      title: {
        singular: 'orden de verificación',
        plural: 'órdenes de verificación'
      },
      loading: false,
      loadingTimeout: null,
      hasLoadingError: false,
      loadingTimeoutDuration: 15000 // 15 segundos de timeout
    }
  },


  computed: {
    // Filtro combinado que aplica todos los filtros activos
    filteredItemsArray() {
      let filtered = [...this.itemsArray];

      // Filtro por búsqueda global (código de orden, solicitante, verificador)
      // Solo aplicar filtro si hay contenido real (no null, no undefined, no string vacío o solo espacios)
      if (this.globalFilterValue && this.globalFilterValue.trim().length > 0) {
        // Normalizar el término de búsqueda: quitar espacios extra y convertir a minúsculas
        const searchTerm = this.globalFilterValue.toLowerCase().trim().replace(/\s+/g, ' ');
        filtered = filtered.filter(order => {
          // Buscar en código de orden
          const orderCodeMatch = order.orderCode && order.orderCode.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm);
          
          // Buscar en nombre de la empresa solicitante
          const companyMatch = order.applicantCompany?.companyName && 
            order.applicantCompany.companyName.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm);
          
          // Buscar en nombre del verificador (si está asignado)
          let verifierMatch = false;
          if (order.homeVisitDetails?.verifierId) {
            const verifierName = this.getVerifierById(order.homeVisitDetails.verifierId);
            verifierMatch = verifierName.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm);
          }
          
          // Buscar en nombre completo del cliente
          let clientMatch = false;
          if (order.client) {
            const clientFullName = this.getClientFullName(order.client);
            clientMatch = clientFullName.toLowerCase().trim().replace(/\s+/g, ' ').includes(searchTerm);
          }

          return orderCodeMatch || companyMatch || verifierMatch || clientMatch;
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

    getClientFullName(client) {
      if (!client || !client.name || !client.lastName) {
        return 'Sin datos';
      }
      return client.getFullName ? client.getFullName() : `${client.name} ${client.lastName}`;
    },

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

    // Eliminar una orden individual
    onDeleteItem(item) {
      console.log('Eliminar orden individual:', item);
      this.deleteOrder(item.id);
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

    // Retorna la clase CSS para el estado
    getStatusClass(status) {
      const statusMap = {
        'PENDIENTE': 'status-pendiente',
        'ASIGNADO': 'status-asignado',
        'EN_PROCESO': 'status-en-proceso',
        'COMPLETADA': 'status-completada',
        'CANCELADA': 'status-cancelada',
        'OBSERVADO': 'status-observado',
        'SUBSANADA': 'status-subsanada'
      };
      return statusMap[status] || 'status-default';
    },

    // Retorna el color personalizado para el estado (mantener para compatibilidad temporal)
    getStatusColor(status) {
      switch (status) {
        case 'PENDIENTE':
          return '#A8A8A8';
        case 'ASIGNADO':
          return '#1976D2';
        case 'EN_PROCESO':
          return '#FFC107';
        case 'COMPLETADA':
          return '#4CAF50';
        case 'CANCELADA':
          return '#D32F2F';
        case 'OBSERVADO':
          return '#FB8C00';
        case 'SUBSANADA':
          return '#66BB6A';
        default:
          return '#E0E0E0';
      }
    },

    // Retorna si debe usar texto blanco (mantener para compatibilidad temporal)
    shouldUseWhiteText(status) {
      return ['ASIGNADO', 'COMPLETADA', 'CANCELADA', 'OBSERVADO', 'SUBSANADA'].includes(status);
    },

    // Obtener cantidad de órdenes por estado
    getCountByStatus(status) {
      if (status === 'EN_PROCESO') {
        return this.itemsArray.filter(o => o.status === 'EN_PROCESO' || o.status === 'ASIGNADO').length;
      }
      return this.itemsArray.filter(o => o.status === status).length;
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
      return this.orderRequestApi.getAll().then(response => {
        // Validar respuesta usando función modular
        this.validateServerResponse(response, 'órdenes');

        // Mapear los datos del API a instancias de OrderService
        this.itemsArray = response.data.map(orderData => new OrderService(orderData));

        // Ordenar por fecha de solicitud (más reciente primero)
        this.itemsArray.sort((a, b) => {
          const dateA = this.parseLocalDate(a.requestDate);
          const dateB = this.parseLocalDate(b.requestDate);

          // Si alguna fecha es null, mover al final
          if (!dateA) return 1;
          if (!dateB) return -1;

          // Ordenar descendente (más reciente primero)
          return dateB.getTime() - dateA.getTime();
        });

        console.log('Órdenes de servicio cargadas:', this.itemsArray);
      }).catch(error => {
        this.itemsArray = []; // Limpiar datos en caso de error
        this.handleServerError(error, 'las órdenes');
        throw error; // Re-lanzar para manejar en loadAllData
      });
    },

    // Retorna todos los verificadores
    getAllVerifiers() {
      return this.verifierApi.getAll().then(response => {
        // Validar respuesta usando función modular
        this.validateServerResponse(response, 'verificadores');

        this.verifiersArray = response.data;
        console.log('Verificadores cargados:', this.verifiersArray);
      })
      .catch(error => {
        this.verifiersArray = []; // Limpiar datos en caso de error
        this.handleServerError(error, 'los verificadores');
        // No re-lanzar el error para que no bloquee la carga de órdenes
      });
    },

    // Cargar todos los datos (órdenes y verificadores) en paralelo
    loadAllData() {
      this.loading = true;
      this.hasLoadingError = false;

      // Configurar timeout para detectar carga lenta
      this.loadingTimeout = setTimeout(() => {
        if (this.loading) {
          this.hasLoadingError = true;
          console.warn('La carga de datos está tomando más tiempo del esperado');
        }
      }, this.loadingTimeoutDuration);

      // Cargar ambos recursos en paralelo
      Promise.all([
        this.getAllOrders(),
        this.getAllVerifiers()
      ])
      .then(() => {
        // Ambas cargas completadas exitosamente
        this.hasLoadingError = false;
        console.log('Todos los datos cargados correctamente');
      })
      .catch(error => {
        // Al menos una carga falló
        this.hasLoadingError = true;
        console.error('Error al cargar datos:', error);
      })
      .finally(() => {
        // Limpiar timeout
        if (this.loadingTimeout) {
          clearTimeout(this.loadingTimeout);
          this.loadingTimeout = null;
        }
        // Finalizar estado de carga
        this.loading = false;
      });
    },

    // Método para reintentar la carga de datos
    retryLoadData() {
      this.loadAllData();
    }

  },

  created() {

    this.orderRequestApi = new OrderRequestApi('/orders');
    this.verifierApi = new VerifierApi('/verifiers');

    // Cargar todos los datos
    this.loadAllData();

  },

  beforeUnmount() {
    // Limpiar timeout si existe al destruir el componente
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
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