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
        {label: "Pendiente", value: "Pendiente"},
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
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    clearFilters() {
      this.search = "";
      this.selectedStatus = "Todos";
      this.selectedDate = null;
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
        :key="order.id"
        class="mb-3 shadow-none border-1 border-round-lg surface-ground"
    >
      <template #content>
        <div class="flex align-items-center gap-3">
          <!-- Ícono de estado -->
          <i
              class="pi pi-minus-circle text-3xl"
              :class="{
              'text-red-500': order.status === 'Asignado',
              'text-gray-500': order.status === 'Completado',
              'text-yellow-500': order.status === 'Pendiente'
            }"
          ></i>

          <!-- Información principal -->
          <div class="flex flex-column flex-1">
            <div class="grid text-sm text-600 font-semibold">
              <div class="col-4">ID de Orden</div>
              <div class="col-4">Dirección</div>
              <div class="col-4">Fecha de visita programada</div>
            </div>

            <div class="grid text-sm">
              <div class="col-4 font-bold text-dark">{{ order.id }}</div>
              <div class="col-4 font-bold text-dark">{{ order.address }}</div>
              <div class="col-4 font-bold text-dark">
                {{ formatDate(order.date) }}
              </div>
            </div>

            <div class="grid text-sm mt-2">
              <!-- Enlace Google Maps -->
              <div class="col-8">
                <span class="text-600">Enlace google maps: </span>
                <a :href="order.googleMaps" target="_blank" class="text-blue-600">
                  {{ order.googleMaps }}
                </a>
              </div>

              <!-- Estado -->
              <div class="col-4">
                <span class="text-600">Estado: </span>
                <span class="font-bold">{{ order.status }}</span>
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
