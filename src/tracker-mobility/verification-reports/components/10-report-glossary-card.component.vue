<script>

export default {
  name: 'report-glossary-card',

  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({
        glossaryItems: [
          {
            term: 'SE TRANSITA CON CAUTELA',
            definition: 'IMPLICA QUE SE DEBE PROCEDER CON CUIDADO Y ATENCIÓN AL MOVERSE O ACTUAR EN UNA DETERMINADA ÁREA O SITUACIÓN.'
          },
          {
            term: 'PRESENCIA - DELINCUENCIAL',
            definition: 'INDICA LA EXISTENCIA DE ACTIVIDAD CRIMINAL O LA PRESENCIA DE PERSONAS INVOLUCRADAS EN ACTIVIDADES DELICTIVAS EN EL ÁREA EN CUESTIÓN.'
          },
          {
            term: 'ZONA PELIGROSA',
            definition: 'SEÑALA UN LUGAR CON UN NIVEL DE RIESGO SIGNIFICATIVO, DONDE PUEDEN OCURRIR EVENTOS O SITUACIONES QUE REPRESENTAN AMENAZAS PARA LA SEGURIDAD.'
          }
        ]
      })
    },
  },

};

</script>

<template>
  <pv-card class="w-full">
    <template #content>
      <h3 class="text-lg font-bold mb-4 text-primary">Glosario</h3>
      
      <div class="formgrid grid">
        <div class="field col-12">
          <ul class="pl-4 m-0">
            <li v-for="(glossaryItem, index) in item?.glossaryItems || []" :key="index" class="mb-3 text-dark line-height-3">
              <span class="font-bold">{{ glossaryItem.term }}:</span> {{ glossaryItem.definition }}
            </li>
          </ul>
          <p v-if="!item?.glossaryItems || item.glossaryItems.length === 0" class="text-color m-0">No hay términos en el glosario</p>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
:deep(.p-card-content) {
  padding: 0.5rem;
}

ul {
  list-style-type: disc;
}

ul li {
  margin-bottom: 0.75rem;
}
</style>