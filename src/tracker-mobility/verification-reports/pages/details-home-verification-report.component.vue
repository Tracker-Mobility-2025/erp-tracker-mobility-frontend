<script>


export default {
  name:'details-home-verification-report',

  props: {
    item: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {

      statusOptions: ['Pendiente', 'En Proceso', 'Completado', 'Cancelado']

    }
  },

  methods : {

    // Función para enviar el reporte de verificación por correo electrónico
    onSendVerificationReportByEmail() {
      // Lógica para enviar el reporte por correo electrónico
    },

    // Función para descargar o imprimir el reporte de verificación en formato PDF
    onDownloadOrPrintVerificationReport() {
      // Lógica para descargar o imprimir el reporte en PDF
    }

  }

};


</script>

<template>
  <!-- Detalles de la orden de servicio (se divide en cards tipo grid)-->
  <div class="order-container flex flex-column p-4 h-full w-full overflow-auto " >

    <!-- Breadcrumb -->
    <div class="text-base">
      <router-link
          :to="{ name: 'verification-reports' }"
          class="font-bold text-gray-900 no-underline hover:underline cursor-pointer"
      >
        Reportes de verificación
      </router-link>
      <span class="text-gray-500 font-bold"> / </span>
      <span class="text-blue-700 font-bold hover:underline cursor-pointer">
        detalle del reporte de verificación
      </span>
    </div>

    <!-- Número de orden a la izquierda y fecha de solicitud a la derecha -->
    <div class="flex align-content-center justify-content-between  mt-4 mb-2">
      <!-- Izquierda -->
      <h2 class="text-2xl xl:font-bold font-extrabold text-gray-900">
        Reporte:<span class="text-blue-700 xl:font-bold "> REP-2025-001</span>
      </h2>

      <!-- Derecha -->
      <span class="font-medium text-gray-900">
        Fecha de solicitud: 10/09/2025
      </span>
    </div>

    <!-- botones para imprimir, descargar o enviar por correo el reporte de verificación -->
    <div class="flex align-content-center justify-content-end mb-2 gap-2">
      <!-- Botón para enviar por correo -->
      <pv-button
          class="p-button-email p-button p-button-sm"
          @click="onSendVerificationReportByEmail"
      >
        <i class="pi pi-envelope p-button-icon-left"></i>
        <span class="p-button-label">Enviar por correo</span>
      </pv-button>
      <!-- Botón imprimir en PDF -->
      <pv-button
          class=" p-button-print p-button p-button-sm"
          @click="onDownloadOrPrintVerificationReport"
      >
        <i class="pi pi-print p-button-icon-left"></i>
        <span class="p-button-label">Imprimir PDF</span>
      </pv-button>
      <!-- Botón para descargar en PDF -->
      <pv-button
          class="p-button-download p-button p-button-sm"
          @click="onDownloadOrPrintVerificationReport"
      >
        <i class="pi pi-download p-button-icon-left"></i>
        <span class="p-button-label">Descargar PDF</span>
      </pv-button>
    </div>







      </div>



</template>

<style scoped>

/* Estilos personalizados para los botones */
/* Botón descargar en PDF */
.p-button-download {
  background-color: #7f8c8d !important; /* Verde */
  border-color: #7f8c8d !important;
}

.p-button-download:hover {
  background-color: #626f70 !important;  /* Verde oscuro */
  border-color: #626f70 !important;
}

/* Botón enviar por correo */
.p-button-email {
  background-color: #3498db !important;  /* Azul */
  border-color: #3498db !important;
}

.p-button-email:hover {
  background-color: #0b7dda !important; /* Azul oscuro */
  border-color: #0b7dda !important;
}

/* Botón imprimir en PDF */
.p-button-print {
  background-color: #27ae60 !important; /* Rojo */
  border-color: #27ae60 !important;
}
.p-button-print:hover {
  background-color: #1e8449 !important; /* Rojo oscuro */
  border-color: #1e8449 !important;
}

</style>