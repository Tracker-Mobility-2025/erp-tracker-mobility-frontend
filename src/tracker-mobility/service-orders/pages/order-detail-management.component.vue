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
      ],

      statusOptions: ['Pendiente', 'En Proceso', 'Completado', 'Cancelado']


    };
  },

  methods : {

    onDownloadDocument (payload) {
      // Lógica para descargar documento
      console.log(`Descargar documento: ${payload.type} para la orden ${payload.item.id}`);
      // Aquí iría la lógica real de descarga
    },


    // Asignar verificador a una orden de servicio (programar fecha de visita y hora de visita)
    onAssignVerifierToOrder() {
      // Lógica para asignar verificador
      this.$emit('assign-verifier', this.item);
    },


    // Actualizar estado del servicio
    onUpdateServiceStatus() {
      // Lógica para actualizar estado del servicio
      this.$emit('update-status', this.item);
    },



    // Enviar observaciones de la orden de servicio
    onSubmitOrderObservations() {
      // Lógica para enviar observaciones
      this.$emit('submit-observations', this.item);
    },




  }

};

</script>

<template>

  <!-- Detalles de la orden de servicio (se divide en cards tipo grid)-->
  <div class="order-container flex flex-column p-4 h-full w-full overflow-auto " >

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


    <!-- Grid de detalles de la orden (con dos columnas: izquierda más ancha, derecha más estrecha) -->
    <div class="order-content flex gap-4 h-full w-full">

      <!-- Columna izquierda (2/3 del ancho) -->
      <div class="flex flex-column gap-4" style="flex: 2;">
        <order-description
            :order="item"
            @download-document="onDownloadDocument"
        />
      </div>

      <!-- Columna derecha (1/3 del ancho) -->
      <div class="flex flex-column gap-4" style="flex: 1;">
        <order-actions
            :item="item"
            :verifiers-list="verifiersList"
            :status-options="statusOptions"
            @assign-verifier="onAssignVerifierToOrder"
            @update-status="onUpdateServiceStatus"
            @submit-observations="onSubmitOrderObservations"
        />
      </div>

    </div>

  </div>



</template>

<style scoped>

</style>