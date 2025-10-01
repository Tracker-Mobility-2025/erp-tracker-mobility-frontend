<script>

export default {
  name: 'casuistry-report-card',

  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({
        casuistryItems: [
          {
            title: 'Dificultades de comunicación con el arrendador',
            description: 'no se ha logrado establecer comunicación con el dueño de la vivienda donde el cliente alquila, lo que impide la verificación de información clave sobre las condiciones de arrendamiento y la relación con el propietario.'
          }
        ]
      })
    },
  },
}

</script>

<template>
  <pv-card class="w-full">
    <template #content>
      <h3 class="text-lg font-bold mb-4 text-primary">Casuística</h3>
      
      <div class="formgrid grid">
        <div class="field col-12">
          <ol class="pl-4 m-0">
            <li v-for="(casuistry, index) in item?.casuistryItems || []" :key="index" class="mb-3 text-dark line-height-3">
              <span class="font-bold">{{ casuistry.title }}:</span> {{ casuistry.description }}
            </li>
          </ol>
          <p v-if="!item?.casuistryItems || item.casuistryItems.length === 0" class="text-color m-0">No hay casuística registrada</p>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
:deep(.p-card-content) {
  padding: 0.5rem;
}

ol {
  counter-reset: item;
}

ol li {
  display: block;
  margin-bottom: 0.5em;
  padding-left: 1em;
}

ol li:before {
  content: counter(item) ". ";
  counter-increment: item;
  font-weight: bold;
  color: var(--primary-color);
}
</style>