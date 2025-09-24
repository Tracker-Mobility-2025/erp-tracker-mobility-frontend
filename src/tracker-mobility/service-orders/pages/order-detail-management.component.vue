<script>

import OrderDescription from "../components/order-description.component.vue";
import OrderActions from "../components/order-actions.component.vue";

export default {
  name: 'order-detail-management',
  components: {OrderActions, OrderDescription},

  props: {
    item: {
      type: Object,
      required: false,
      default : () => ({
        id: null,
        clientName: '',
        clientContact: '',
        clientAddress: '',
        serviceType: '',
        scheduledDate: '',
        status: 'Pendiente',
        assignedVerifier: null,
        observations: ''

      })
    },
  },

  data() {
    return {

      verifiersList: [
        { id: 1, name: 'Verificador 1' },
        { id: 2, name: 'Verificador 2' },
        { id: 3, name: 'Verificador 3' }
      ]


    };
  },

  methods : {
    // Asignar verificador a una orden de servicio (programar fecha de visita y hora de visita)
    assignVerifierToOrder() {
      // Lógica para asignar verificador
    },


    // Actualizar estado del servicio
    updateServiceStatus() {
      // Lógica para actualizar estado del servicio
    },



    // Enviar observaciones de la orden de servicio
    submitOrderObservations() {
      // Lógica para enviar observaciones
    },


  }

};

</script>

<template>

  <!-- Detalles de la orden de servicio (se divide en cards tipo grid)-->
  <div class="flex flex-column p-4 h-full overflow-auto " >

    <!-- Breadcrumb -->
    <div class="text-base">
      <router-link
          to="/admin/service-orders"
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
    <div class="flex align-content-center justify-content-between  mt-4 mb-2">
      <!-- Izquierda -->
      <h2 class="text-2xl xl:font-bold font-extrabold text-gray-900">
        Orden:<span class="text-blue-700 xl:font-bold "> ORD-2025-001</span>
      </h2>

      <!-- Derecha -->
      <span class="text-sm font-medium text-gray-900">
        Fecha de solicitud: 10/09/2025
      </span>
    </div>


    <!-- Grid de detalles de la orden (con dos columnas y cada columna tiene cards en forma vertical) -->
    <div class=" flex gap-4 mt-4 h-full">

      <!-- Columna izquierda -->
      <div class="flex flex-column gap-4">
        <order-description :order="item"></order-description>
      </div>

      <!-- Columna derecha -->
      <div class="flex flex-column gap-4">
        <order-actions  :item="item"></order-actions>
      </div>

    </div>

  </div>



</template>

<style scoped>

</style>