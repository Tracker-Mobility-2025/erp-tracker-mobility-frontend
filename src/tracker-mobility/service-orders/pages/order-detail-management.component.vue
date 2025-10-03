<script>

import OrderDescription from "../components/order-description.component.vue";
import OrderActions from "../components/order-actions.component.vue";
import {OrderRequestApi} from "../services/order-request-api.service.js";
import {VerifierApi} from "../services/verifier-api.service.js";
import {OrderService} from "../models/order-service.entity.js";
import {Verifier} from "../../verifier-management/models/verifiers.entity.js";

export default {
  name: 'order-detail-management',
  components: {OrderActions, OrderDescription},

  data() {
    return {

      // Servicio para obtener detalles de la orden por ID
      orderRequestApi: new OrderRequestApi('/orders'),


      // Servicio para obtener lista de verificadores
      verifierApi: null,

      verifiersArray: [],

      statusOptions: [
        { label: 'Todos', value: null },
        { label: 'Pendiente', value: 'PENDIENTE' },
        { label: 'Asignado', value: 'ASIGNADO' },
        { label: 'En Proceso', value: 'EN_PROCESO' },
        { label: 'Finalizado', value: 'FINALIZADO' }
      ],

      // Item de la orden obtenido de la API
      item: null,

      // Estados de carga
      isLoading: true,
      hasError: false,
      errorMessage: ''


    };
  },

  methods : {

    onDownloadDocument (payload) {
      // Lógica para descargar documento
      console.log(`Descargar documento: ${payload.type} para la orden ${payload.item.id}`);
      // Aquí iría la lógica real de descarga
    },

    // Formatear fecha para mostrar
    formatDate(dateString) {
      if (!dateString) return 'No disponible';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit', 
          year: 'numeric'
        });
      } catch (error) {
        return 'Fecha inválida';
      }
    },

    getOrderDetailsByOrderId(orderId) {
      // Lógica para obtener detalles de la orden por ID
      console.log(`Obtener detalles de la orden con ID: `, orderId);
      
      this.isLoading = true;
      this.hasError = false;
      
      this.orderRequestApi.getById(orderId).then(response => {

          this.item = new OrderService(response.data);
          this.isLoading = false;

          console.log('Detalles de la orden obtenidos:', this.item);
        })
        .catch(error => {
          console.error('Error al obtener detalles de la orden:', error);
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage = 'Error al cargar los detalles de la orden. Por favor, intente nuevamente.';
        });

    },

    // Obtener lista de verificadores disponibles
    getAllVerifiers() {
      // Lógica para obtener lista de verificadores activos
      console.log('Obtener lista de verificadores disponibles');
      this.verifierApi.getAll().then(response => {

        this.verifiersArray = response.data.map(resource  => new Verifier(resource));

        // Filtrar solo los verificadores con status ACTIVE
        this.verifiersArray = this.verifiersArray.filter(verifier => verifier.status === 'ACTIVE');

        console.log('Lista de verificadores obtenida:', this.verifiersArray);

        })
        .catch(error => {
          console.error('Error al obtener lista de verificadores:', error);
        });
    }

  },


  created() {
    // Obtener el id de la query en router
    const orderId = this.$route.query.id;

    console.log(`Cargar detalles de la orden con ID: ${orderId}`);
    // Aquí iría la lógica real para cargar los detalles de la orden usando el orderId

    // Inicializar servicios
    this.orderRequestApi = new OrderRequestApi('/orders');
    this.verifierApi = new VerifierApi('/verifiers');


    // Llamar a la función para obtener lista de verificadores
    this.getAllVerifiers();
    // Llamar a la función para obtener detalles de la orden
    this.getOrderDetailsByOrderId(orderId);

  }

};

</script>

<template>

  <!-- Detalles de la orden de servicio (se divide en cards tipo grid)-->
  <div class="order-container flex flex-column p-4 h-full w-full overflow-auto " >

    <!-- Breadcrumb -->
    <div class="text-base">
      <router-link
          :to="{ name: 'service-orders' }"
          class="font-bold text-gray-900 no-underline hover:underline cursor-pointer"
      >
        Órdenes
      </router-link>
      <span class="text-gray-500 font-bold"> / </span>
      <span class="text-blue-700 font-bold hover:underline cursor-pointer">
        detalle de la orden
      </span>
    </div>

    <!-- Número de orden a la izquierda y fecha de solicitud a la derecha -->
    <div class="flex align-content-center justify-content-between  mt-4 mb-2" v-if="item">
      <!-- Izquierda -->
      <h2 class="text-2xl xl:font-bold font-extrabold text-gray-900">
        Orden:<span class="text-blue-700 xl:font-bold "> {{ item.orderCode || 'No disponible' }}</span>
      </h2>

      <!-- Derecha -->
      <span class="font-medium text-gray-900">
        Fecha de solicitud: {{ formatDate(item.requestDate) }}
      </span>
    </div>


    <!-- Estado de carga -->
    <div v-if="isLoading" class="flex justify-content-center align-items-center h-20rem">
      <pv-progressSpinner />
      <span class="ml-3">Cargando detalles de la orden...</span>
    </div>

    <!-- Estado de error -->
    <div v-else-if="hasError" class="flex justify-content-center align-items-center h-20rem">
      <pv-message severity="error" :closable="false">
        <template #default>
          <div class="flex flex-column align-items-center">
            <i class="pi pi-exclamation-triangle text-4xl mb-3"></i>
            <span>{{ errorMessage }}</span>
            <pv-button 
              label="Reintentar" 
              icon="pi pi-refresh" 
              class="mt-3"
              @click="getOrderDetailsByOrderId($route.query.id)"
            />
          </div>
        </template>
      </pv-message>
    </div>

    <!-- Grid de detalles de la orden (con dos columnas: izquierda más ancha, derecha más estrecha) -->
    <div v-else-if="item" class="order-content flex gap-4 h-full w-full">

      <!-- Columna izquierda (2/3 del ancho) -->
      <div class="flex flex-column gap-4" style="flex: 2;">
        <order-description
            :item="item"
            @download-document="onDownloadDocument"
        />
      </div>

      <!-- Columna derecha (1/3 del ancho) -->
      <div class="flex flex-column gap-4" style="flex: 1;">
        <order-actions
            :item="item"
            :verifiers-list="verifiersArray"
            :status-options="statusOptions"
        />
      </div>

    </div>

  </div>



</template>

<style scoped>

</style>