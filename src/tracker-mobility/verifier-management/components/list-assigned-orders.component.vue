<script>
export default {
  name: "list-assigned-orders",

  props: {
    items: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      search: "",
      selectedStatus: "Todos",
      selectedDate: null,

      statusOptions: [
        {label: "Todos", value: "Todos"},
        {label: "Pendiente", value: "PENDIENTE"},
        {label: "Asignado", value: "ASIGNADO"},
        {label: "En Proceso", value: "EN_PROCESO"},
        {label: "Finalizado", value: "FINALIZADO"},
      ]
    };
  },

  computed: {
    filteredOrders() {
      return this.items.filter((order) => {
        // Filtro por texto - buscar en código de orden y dirección
        const matchesSearch = !this.search || 
            (order.orderCode && order.orderCode.toLowerCase().includes(this.search.toLowerCase())) ||
            (order.client && order.client.dwelling && order.client.dwelling.homeAddress && 
             order.client.dwelling.homeAddress.toLowerCase().includes(this.search.toLowerCase()));

        // Filtro por estado
        const matchesStatus = this.selectedStatus === "Todos" || order.status === this.selectedStatus;

        // Filtro por fecha - comparar solo fechas sin hora para evitar problemas de zona horaria
        const matchesDate = !this.selectedDate || this.isSameDate(order.homeVisitDetails?.visitDate, this.selectedDate);

        return matchesSearch && matchesStatus && matchesDate;
      });
    },
  },

  methods: {
    formatDate(date) {
      if (!date) return "Sin fecha";
      
      try {
        // Crear fecha sin problemas de zona horaria
        const dateObj = new Date(date);
        
        // Verificar si la fecha es válida
        if (isNaN(dateObj.getTime())) {
          return "Fecha inválida";
        }
        
        // Formatear fecha en español peruano
        return dateObj.toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          timeZone: "America/Lima"
        });
      } catch (error) {
        console.error('Error formateando fecha:', error);
        return "Error en fecha";
      }
    },

    isSameDate(date1, date2) {
      if (!date1 || !date2) return false;
      
      try {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        
        // Comparar solo año, mes y día (ignorar hora)
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
      } catch (error) {
        console.error('Error comparando fechas:', error);
        return false;
      }
    },

    clearFilters() {
      this.search = "";
      this.selectedStatus = "Todos";
      this.selectedDate = null;
    },

    removeOrder(order){
      console.log('Intentando remover orden:', order);

      // Emitir evento al componente padre para manejar la remoción
      this.$emit('remove-order', order);
    },

  },

  created() {


  }


};
</script>

<template>
  <div class="w-full flex-1 flex-column gap-3">
    <h3 class="text-xlg font-bold mb-3 flex align-items-center gap-2">
      <i class="pi pi-clipboard-list text-blue-500"></i>
      Órdenes asignadas
    </h3>

    <!-- Filtros -->
    <div class="flex w-full gap-2 mb-4 flex-wrap">
      <pv-icon-field class="flex-grow-1">
        <pv-input-icon class="pi pi-search text-blue-500" />
        <pv-input-text
            v-model="search"
            placeholder="Busca por código de orden o dirección..."
            class="w-full h-full"
        />
      </pv-icon-field>

      <pv-dropdown
          v-model="selectedStatus"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          placeholder="Estado: Todos"
          class="flex-1 h-full"
      />

      <pv-calendar
          v-model="selectedDate"
          date-format="dd/mm/yy"
          placeholder="dd/mm/aaaa"
          show-icon
          class="flex-1 h-full"
      />

      <pv-button
          label="Limpiar filtros"
          icon="pi pi-filter-slash text-blue-500"
          @click="clearFilters"
          class="p-button-secondary flex-shrink-0 h-full"
      />
    </div>

    <!-- Lista de órdenes como tarjetas -->
    <pv-card
        v-for="order in filteredOrders"
        :key="order.orderCode"
        class="mb-3 shadow-none border-1 border-round-lg surface-ground"
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
              <div class="col-3 font-bold text-dark">{{ order.client.dwelling.homeAddress }}</div>
              <div class="col-3 font-bold text-dark">
                {{ formatDate(order.homeVisitDetails.visitDate) }}
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
                    v-if="order.client && order.client.location && order.client.location.mapLocation"
                    :href="order.client.location.mapLocation"
                    target="_blank"
                    class="text-blue-600"
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
    <div v-if="filteredOrders.length === 0" class="text-center text-gray-500">
      No hay órdenes asignadas.
    </div>
  </div>
</template>

<style scoped>
</style>
