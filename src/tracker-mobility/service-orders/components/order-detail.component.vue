<script>

export default {
  name: 'order-detail',

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

      verifiersList: []


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
      <span class="font-bold text-gray-900">Órdenes</span>
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





  </div>


</template>

<style scoped>

</style>