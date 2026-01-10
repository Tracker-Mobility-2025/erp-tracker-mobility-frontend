<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Toolbar from '../../../shared-v2/presentation/components/toolbar.vue';
import DataManager from '../../../shared-v2/presentation/components/data-manager.vue';
import { OrderRequestApi } from '../../infrastructure/order-request.api.js';

// Router y API
const router = useRouter();
const orderRequestApi = new OrderRequestApi();

// Estados locales
const loading = ref(false);
const orders = ref([]);
const globalFilterValue = ref('');
const selectedStatus = ref('');
const dateRange = ref(null);

// Configuración
const title = { singular: 'Solicitud de Orden', plural: 'Mis Solicitudes' };

// Columnas de la tabla
const columns = [
  { field: 'orderCode', header: 'Código', sortable: true },
  { field: 'clientName', header: 'Cliente', sortable: true },
  { field: 'clientPhoneNumber', header: 'Teléfono', sortable: true },
  { field: 'status', header: 'Estado', sortable: true, template: 'status' },
  { field: 'obsPendientes', header: 'Obs. Pendientes', sortable: true },
  { field: 'requestDateFormatted', header: 'Fecha Solicitud', sortable: true },
  { field: 'visitDateFormatted', header: 'Fecha Visita', sortable: true }
];

// Opciones de estado
const statusOptions = [
  { label: 'Todos los estados', value: '' },
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Asignado', value: 'ASIGNADO' },
  { label: 'En Proceso', value: 'EN_PROCESO' },
  { label: 'Completada', value: 'COMPLETADA' },
  { label: 'Observado', value: 'OBSERVADO' },
  { label: 'Subsanada', value: 'SUBSANADA' },
  { label: 'Cancelada', value: 'CANCELADA' }
];

// Traducciones de estado
const statusTranslations = {
  'PENDIENTE': 'Pendiente',
  'ASIGNADO': 'Asignado',
  'EN_PROCESO': 'En Proceso',
  'COMPLETADA': 'Completada',
  'OBSERVADO': 'Observado',
  'SUBSANADA': 'Subsanada',
  'CANCELADA': 'Cancelada'
};

// Clases CSS por estado
const statusClasses = {
  'PENDIENTE': 'status-pendiente',
  'ASIGNADO': 'status-asignado',
  'EN_PROCESO': 'status-en-proceso',
  'COMPLETADA': 'status-completada',
  'OBSERVADO': 'status-observado',
  'SUBSANADA': 'status-subsanada',
  'CANCELADA': 'status-cancelada'
};

// Iconos por estado
const statusIcons = {
  'PENDIENTE': 'pi pi-clock',
  'ASIGNADO': 'pi pi-user',
  'EN_PROCESO': 'pi pi-spinner',
  'COMPLETADA': 'pi pi-check-circle',
  'OBSERVADO': 'pi pi-exclamation-triangle',
  'SUBSANADA': 'pi pi-check',
  'CANCELADA': 'pi pi-times-circle'
};

// Computed - Órdenes procesadas con fechas formateadas
const processedOrders = computed(() => {
  return orders.value.map(order => ({
    ...order,
    requestDateFormatted: formatDate(order.requestDate),
    visitDateFormatted: formatDate(order.visitDate)
  }));
});

// Computed - Órdenes filtradas
const filteredOrders = computed(() => {
  let result = processedOrders.value;

  // Filtro de búsqueda global
  if (globalFilterValue.value) {
    const searchLower = globalFilterValue.value.toLowerCase();
    result = result.filter(order => 
      order.orderCode?.toLowerCase().includes(searchLower) ||
      order.clientName?.toLowerCase().includes(searchLower) ||
      order.clientPhoneNumber?.toLowerCase().includes(searchLower)
    );
  }

  // Filtro por estado
  if (selectedStatus.value) {
    result = result.filter(order => order.status === selectedStatus.value);
  }

  // Filtro por rango de fechas
  if (dateRange.value && dateRange.value[0]) {
    const startDate = dateRange.value[0];
    const endDate = dateRange.value[1] || startDate;
    
    result = result.filter(order => {
      if (!order.requestDate) return false;
      const orderDate = new Date(order.requestDate);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }

  return result;
});

// Métodos
function formatDate(dateString) {
  if (!dateString) return 'No especificado';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
}

function getStatusClass(status) {
  return statusClasses[status] || 'status-default';
}

function getStatusLabel(status) {
  return statusTranslations[status] || status;
}

function getStatusIcon(status) {
  return statusIcons[status] || 'pi pi-circle';
}

function getCountByStatus(status) {
  if (!status) return processedOrders.value.length;
  return processedOrders.value.filter(order => order.status === status).length;
}

function onGlobalFilterChange(value) {
  globalFilterValue.value = value;
}

function onClearFilters() {
  globalFilterValue.value = '';
  selectedStatus.value = '';
  dateRange.value = null;
}

function handleViewDetails(order) {
  router.push({ 
    name: 'order-request-detail', 
    query: { id: order.id } 
  });
}

function handleNewRequest() {
  router.push({ name: 'order-request-form' });
}

async function fetchOrders() {
  loading.value = true;
  try {
    // Obtener corporateEmail del localStorage
    const corporateEmail = localStorage.getItem('username');
    
    if (!corporateEmail) {
      console.error('No se encontró corporateEmail en localStorage');
      return;
    }

    const response = await orderRequestApi.getByCorporateEmail(corporateEmail);
    orders.value = response.data || [];
  } catch (error) {
    console.error('Error al cargar órdenes:', error);
    orders.value = [];
  } finally {
    loading.value = false;
  }
}

// Lifecycle
onMounted(async () => {
  await fetchOrders();
});
</script>

<template>
  <div class="h-full w-full flex flex-column">
    
    <toolbar 
      title="Mis Solicitudes" 
      description="Consulta y gestiona tus solicitudes de verificación domiciliaria" 
      :show-back-button="false"
    />

    <div class="flex-1 p-4 overflow-auto">
      <div>
        <data-manager
          :items="processedOrders"
          :filtered-items="filteredOrders"
          :global-filter-value="globalFilterValue"
          :columns="columns"
          :title="title"
          :loading="loading"
          :dynamic="true"
          :show-new="true"
          :show-delete="false"
          :show-export="false"
          :show-selection="false"
          :show-actions="true"
          :show-view-action="true"
          :view-action-icon-only="true"
          :rows="10"
          :rows-per-page-options="[5, 10, 20, 50]"
          search-placeholder="Buscar por código, cliente o teléfono..."
          new-button-label="Nueva Solicitud"
          @global-filter-change="onGlobalFilterChange"
          @clear-filters="onClearFilters"
          @view-item-requested-manager="handleViewDetails"
          @new-item-requested-manager="handleNewRequest"
        >
          <!-- Filtros personalizados -->
          <template #filters="{ clearFilters }">
            <pv-dropdown
              v-model="selectedStatus"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              placeholder="Filtrar por estado"
              class="w-full md:w-auto"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center gap-2">
                  <span class="font-semibold">Estado:</span>
                  <span :class="['status-tag', getStatusClass(slotProps.value)]">
                    <i :class="getStatusIcon(slotProps.value)" class="mr-1"></i>
                    {{ getStatusLabel(slotProps.value) }}
                  </span>
                </div>
                <span v-else>{{ slotProps.placeholder }}</span>
              </template>
              
              <template #option="slotProps">
                <div class="flex align-items-center justify-content-between w-full gap-2">
                  <span>{{ slotProps.option.label }}</span>
                  <span 
                    :class="['badge-custom', getStatusClass(slotProps.option.value)]"
                  >
                    {{ getCountByStatus(slotProps.option.value) }}
                  </span>
                </div>
              </template>
            </pv-dropdown>
            
            <pv-calendar
              v-model="dateRange"
              selection-mode="range"
              :manual-input="false"
              date-format="dd/mm/yy"
              placeholder="Filtrar por fecha"
              class="w-full md:w-auto"
              show-icon
            />
            
            <pv-button
              label="Limpiar filtros"
              icon="pi pi-filter-slash"
              class="p-button-secondary p-button-outlined w-full md:w-auto"
              @click="onClearFilters"
            />
          </template>

          <!-- Status Column Template -->
          <template #status="slotProps">
            <span 
              :class="['status-tag', getStatusClass(slotProps.data.status)]"
            >
              <i :class="getStatusIcon(slotProps.data.status)" class="mr-1"></i>
              {{ getStatusLabel(slotProps.data.status) }}
            </span>
          </template>
        </data-manager>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-requests-management {
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .order-requests-management {
    padding: 1rem;
  }
}
</style>
