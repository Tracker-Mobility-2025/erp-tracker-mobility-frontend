<script>
export default {
  name: 'observations-the-report-card',

  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({
        observations: [
          'EL CLIENTE DIO COMO REFERENCIA A LA SEÑORA LUCILA, QUIEN EN LA ENTREVISTA DUO QUE ES LA SUEGRA Y QUE SOLO ES INQUILINA, NO LA DUEÑA DEL LUGAR. POR ESO, NO SE PUDO CONTACTAR A LA TITULAR PARA ASEGURAR LA RESIDENCIA EN LA DIRECCIÓN MENCIONADA.',
          'EL LUGAR QUE EL CLIENTE SEÑALA PARA LA COCHERA ES UN PASILLO POR DONDE PASAN LAS PERSONAS. CABE RESALTAR QUE HAY UN DEPARTAMENTO EN LA PARTE DE ATRÁS, LO QUE DIFICULTA EL PASO.'
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
        <i class="pi pi-exclamation-triangle text-white"></i>
        Observación
      </h3>
    </template>
    <template #content>
      
      <div class="formgrid grid">
        <div class="field col-12">
          <ol class="pl-4 m-0">
            <li v-for="(observation, index) in item?.observations || []" :key="index" class="mb-3 text-dark line-height-3">
              {{ observation }}
            </li>
          </ol>
          <p v-if="!item?.observations || item.observations.length === 0" class="text-color m-0">No hay observaciones registradas</p>
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

:deep(.p-card-header) {
  background-color: #4A60D0;
  border-radius: 0.375rem 0.375rem 0 0;
  overflow: hidden;
}

:deep(.p-card) {
  overflow: hidden;
  border-radius: 0.375rem;
}
</style>