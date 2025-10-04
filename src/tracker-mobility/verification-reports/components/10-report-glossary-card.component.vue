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
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-book text-white"></i>
        Glosario
      </h3>
    </template>
    <template #content>
      
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

:deep(.p-card-header) {
  background-color: #4A60D0;
  border-radius: 0.375rem 0.375rem 0 0;
  overflow: hidden;
}

:deep(.p-card) {
  overflow: hidden;
  border-radius: 0.375rem;
}

ul {
  list-style-type: disc;
}

ul li {
  margin-bottom: 0.75rem;
}
</style>