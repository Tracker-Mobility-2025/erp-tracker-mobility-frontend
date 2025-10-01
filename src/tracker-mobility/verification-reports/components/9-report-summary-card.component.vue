<script>

export default {
  name: 'report-summary-card',

  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({
        summary: 'EL CLIENTE VIVE CON SU PAREJA E HIJO EN UNA CASA ALQUILADA UBICADA EN CALLE 27 LAS PRADERAS MZ K LOTE 46 SANTA ANITA. LA COCHERA ESTÁ DENTRO DE LA MISMA PROPIEDAD. COMO REFERENCIA, EL CLIENTE PROPORCIONÓ EL NÚMERO DE TELÉFONO DE SU FAMILIAR (SUEGRA) LUCILA 914011796 QUIEN INDICÓ SER UNA INQUILINA NO SE PUDO CONTACTAR CON EL TITULAR DEL PREDIO LA ZONA ES SEGURA – DATACRIM.'
      })
    },
  },

};

</script>

<template>
  <pv-card class="w-full">
    <template #content>
      <h3 class="text-lg font-bold mb-4 text-primary">Resumen</h3>
      
      <div class="formgrid grid">
        <div class="field col-12">
          <p class="text-dark line-height-3 m-0">
            {{ item?.summary || 'No hay resumen disponible' }}
          </p>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
:deep(.p-card-content) {
  padding: 0.5rem;
}
</style>