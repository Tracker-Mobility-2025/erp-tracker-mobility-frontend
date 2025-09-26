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

</template>

<style scoped>

</style>