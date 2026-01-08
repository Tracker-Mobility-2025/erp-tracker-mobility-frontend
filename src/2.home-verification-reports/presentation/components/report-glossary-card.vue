<script setup>
const props = defineProps({
  glossaryItems: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-book text-white"></i>
        Glosario del reporte
      </h3>
    </template>
    <template #content>
      <div v-if="glossaryItems.length > 0" class="formgrid grid">
        <div 
          v-for="(item, index) in glossaryItems" 
          :key="index"
          class="field col-12"
        >
          <label class="font-semibold text-color-secondary">
            {{ item.term }}
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item.definition }}
          </p>
        </div>
      </div>
      <div v-else class="text-center p-4">
        <p class="text-color-secondary m-0">
          <i class="pi pi-info-circle mr-2"></i>
          No hay términos en el glosario
        </p>
      </div>
    </template>
  </pv-card>
</template>
