<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  orders: {
    type: Array,
    required: true,
    default: () => []
  },
});

const emit = defineEmits(['remove-order']);

// State
const search = ref('');
const selectedStatus = ref('Todos');
const selectedDate = ref(null);

const statusOptions = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Asignado', value: 'ASIGNADO' },
  { label: 'En Proceso', value: 'EN_PROCESO' },
  { label: 'Finalizado', value: 'FINALIZADO' },
];

// Computed
const filteredOrders = computed(() => {
  return props.orders.filter((order) => {
    // Filtro por texto - buscar en código de orden y dirección
    const matchesSearch = !search.value || search.value.trim().length === 0 || 
        (order.orderCode && order.orderCode.toLowerCase().trim().replace(/\s+/g, ' ').includes(search.value.toLowerCase().trim().replace(/\s+/g, ' '))) ||
        (order.client && order.client.location && order.client.location.homeAddress &&
         order.client.location.homeAddress.toLowerCase().trim().replace(/\s+/g, ' ').includes(search.value.toLowerCase().trim().replace(/\s+/g, ' ')));

    // Filtro por estado
    const matchesStatus = selectedStatus.value === 'Todos' || order.status === selectedStatus.value;

    // Filtro por fecha
    const matchesDate = !selectedDate.value || isSameDate(order.homeVisitDetails?.visitDate, selectedDate.value);

    return matchesSearch && matchesStatus && matchesDate;
  });
});

// Methods
function formatDate(date) {
  if (!date) return 'Sin fecha';
  
  try {
    let dateToFormat;
    
    if (date.includes('T')) {
      const datePart = date.split('T')[0];
      const [year, month, day] = datePart.split('-');
      dateToFormat = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (date.includes('-')) {
      const [year, month, day] = date.split('-');
      dateToFormat = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      dateToFormat = new Date(date);
    }
    
    if (isNaN(dateToFormat.getTime())) return 'Fecha inválida';
    
    const day = dateToFormat.getDate().toString().padStart(2, '0');
    const month = (dateToFormat.getMonth() + 1).toString().padStart(2, '0');
    const year = dateToFormat.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Error en fecha';
  }
}

function isSameDate(date1, date2) {
  if (!date1 || !date2) return false;
  
  try {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  } catch (error) {
    console.error('Error comparando fechas:', error);
    return false;
  }
}

function clearFilters() {
  search.value = '';
  selectedStatus.value = 'Todos';
  selectedDate.value = null;
}

function removeOrder(order) {
  if (order.status === 'FINALIZADO' || order.status === 'EN_PROCESO') {
    return; // No permitir remover órdenes finalizadas o en proceso
  }
  emit('remove-order', order);
}
</script>

<template>
  <div class="w-full flex-1 flex-column gap-3">
    <!-- Filtros -->
    <div class="flex w-full gap-2 mb-4 flex-wrap">
      <pv-icon-field class="flex-grow-1">
        <pv-input-icon class="pi pi-search" />
        <pv-input-text
          v-model="search"
          placeholder="Busca por código de orden o dirección..."
          class="w-full"
        />
      </pv-icon-field>

      <pv-dropdown
        v-model="selectedStatus"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        placeholder="Estado: Todos"
        class="flex-1"
      />

      <pv-calendar
        v-model="selectedDate"
        date-format="dd/mm/yy"
        placeholder="dd/mm/aaaa"
        show-icon
        class="flex-1"
      />

      <pv-button
        label="Limpiar filtros"
        icon="pi pi-filter-slash"
        severity="secondary"
        outlined
        class="flex-shrink-0"
        @click="clearFilters"
      />
    </div>

    <!-- Lista de órdenes como tarjetas -->
    <pv-card
      v-for="order in filteredOrders"
      :key="order.orderCode"
      class="mb-3"
    >
      <template #content>
        <div class="flex align-items-center gap-3">
          <!-- Botón circular para quitar órdenes de servicio asignadas -->
          <i
            class="pi pi-minus-circle text-5xl font-bold pr-4 transition-colors duration-200"
            :class="{
              'text-red-500 hover:text-red-700 cursor-pointer': order.status === 'ASIGNADO',
              'text-gray-300 cursor-not-allowed': order.status === 'FINALIZADO' || order.status === 'EN_PROCESO'
            }"
            @click="removeOrder(order)"
          ></i>

          <!-- Información principal -->
          <div class="flex flex-column flex-1">
            <div class="grid text-sm text-600 font-semibold">
              <div class="col-3 flex align-items-center gap-1">
                <i class="pi pi-hashtag text-blue-500"></i>
                Código de Orden
              </div>
              <div class="col-3 flex align-items-center gap-1">
                <i class="pi pi-map-marker text-blue-500"></i>
                Dirección
              </div>
              <div class="col-3 flex align-items-center gap-1">
                <i class="pi pi-calendar text-blue-500"></i>
                Fecha de visita programada
              </div>
              <div class="col-3 flex align-items-center gap-1">
                <i class="pi pi-info-circle text-blue-500"></i>
                Estado
              </div>
            </div>

            <!-- Datos de la orden -->
            <div class="grid text-sm">
              <div class="col-3 font-bold text-dark">{{ order.orderCode }}</div>
              <div class="col-3 font-bold text-dark">{{ order.client?.location?.homeAddress || 'Sin dirección' }}</div>
              <div class="col-3 font-bold text-dark">
                {{ formatDate(order.homeVisitDetails?.visitDate) }}
              </div>
              <div class="col-3 font-bold text-dark">{{ order.status }}</div>
            </div>

            <div class="grid text-sm mt-2">
              <!-- Enlace Google Maps -->
              <div class="col-12">
                <span class="text-600 flex align-items-center gap-1">
                  <i class="pi pi-map text-blue-500"></i>
                  Enlace google maps:
                </span>
                <a
                  v-if="order.client?.location?.mapLocation"
                  :href="order.client.location.mapLocation"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800"
                >
                  {{ order.client.location.mapLocation }}
                </a>
                <span v-else class="text-gray-400">Sin ubicación</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </pv-card>

    <!-- Si no hay órdenes -->
    <div v-if="filteredOrders.length === 0" class="text-center text-gray-500 py-4">
      <i class="pi pi-inbox text-4xl mb-3"></i>
      <p class="m-0">No hay órdenes que coincidan con los filtros aplicados.</p>
    </div>
  </div>
</template>
