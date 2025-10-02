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
        {label: "Asignado", value: "Asignado"},
        {label: "Completado", value: "Completado"},
      ]
    };
  },

  computed: {
    filteredOrders() {
      return this.items.filter((order) => {
        // Filtro por texto
        const matchesSearch =
            !this.search ||
            order.id.toLowerCase().includes(this.search.toLowerCase()) ||
            order.address.toLowerCase().includes(this.search.toLowerCase());

        // Filtro por estado
        const matchesStatus =
            this.selectedStatus === "Todos" ||
            order.status === this.selectedStatus;

        // Filtro por fecha
        const matchesDate =
            !this.selectedDate ||
            new Date(order.date).toDateString() ===
            new Date(this.selectedDate).toDateString();

        return matchesSearch && matchesStatus && matchesDate;
      });
    },
  },

  methods: {

    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },

    clearFilters() {
      this.search = "";
      this.selectedStatus = "Todos";
      this.selectedDate = null;
    },

    removeOrder(order){
      // Solo emitir evento al componente padre
      this.$emit('remove-order', order);
    },

    confirmRemoveOrder(order) {
      // Validar si la orden puede ser removida
      if (order.status !== 'Asignado') {
        this.$toast.add({
          severity: 'warn',
          summary: 'Acción no permitida',
          detail: 'Solo se pueden remover órdenes con estado "Asignado"',
          life: 3000
        });
        return;
      }

      // Mostrar confirmación antes de remover
      this.$confirm.require({
        message: `¿Estás seguro de que deseas remover la orden ${order.id} de la lista de órdenes asignadas?`,
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, remover',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger',
        accept: () => {
          // Solo emitir evento al componente padre
          this.$emit('remove-order', order);
        },
        reject: () => {
          // No hacer nada si se cancela
        }
      });
    },

    canRemoveOrder(order) {
      // Verificar si una orden puede ser removida (solo las Asignado)
      return order.status === 'Asignado';
    },


  },

  created() {


  }


};
</script>

<template>
  <div class="w-full flex-1 flex-column gap-3">
    <h3 class="text-xlg font-bold mb-3">Órdenes asignadas</h3>

    <!-- Filtros -->
    <div class="flex w-full gap-2 mb-4 flex-wrap">
      <pv-icon-field class="flex-grow-1">
        <pv-input-icon class="pi pi-search" />
        <pv-input-text
            v-model="search"
            placeholder="Busca por ID de orden..."
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
          icon="pi pi-filter-slash"
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
                'text-red-500 hover:text-red-700 cursor-pointer': order.status === 'Asignado',
                'text-gray-300 cursor-not-allowed': order.status === 'Completado'
              }"
              v-tooltip.top="canRemoveOrder(order) ? 'Remover orden de la lista' : 'Solo se pueden remover órdenes asignadas'"
              @click="canRemoveOrder(order) ? confirmRemoveOrder(order) : null"
          ></i>


          <!-- Información principal -->
          <div class="flex flex-column flex-1">
            <div class="grid text-sm text-600 font-semibold">
              <div class="col-3">Código de Orden</div>
              <div class="col-3">Dirección</div>
              <div class="col-3">Fecha de visita programada</div>
              <div class="col-3">Estado</div>
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
                <span class="text-600">Enlace google maps: </span>
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
