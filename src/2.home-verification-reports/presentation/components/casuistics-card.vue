<script setup>
import { ref, watch } from 'vue';

/**
 * Componente para mostrar casuística del reporte
 * Presentation Layer - Display Component.
 */

// Props
const props = defineProps({
  casuistics: {
    type: Array,
    default: () => []
  },
  visible: {
    type: Boolean,
    default: true
  },
  canEdit: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['update:casuistics']);

// State
const localCasuistics = ref([...props.casuistics]);
const newCasuistic = ref('');

// Watch for external changes
watch(() => props.casuistics, (newValue) => {
  localCasuistics.value = [...(newValue || [])];
}, { deep: true, immediate: true });

// Methods
const handleAddCasuistic = () => {
  if (newCasuistic.value.trim()) {
    const updatedCasuistics = [
      ...localCasuistics.value,
      { id: Date.now(), value: newCasuistic.value.trim() }
    ];
    localCasuistics.value = updatedCasuistics;
    emit('update:casuistics', updatedCasuistics);
    newCasuistic.value = '';
  }
};

const handleRemoveCasuistic = (index) => {
  const updatedCasuistics = localCasuistics.value.filter((_, i) => i !== index);
  localCasuistics.value = updatedCasuistics;
  emit('update:casuistics', updatedCasuistics);
};
</script>

<template>
  <pv-card v-if="visible && (casuistics.length > 0 || canEdit)" class="mb-4" :class="{ 'editable-card': canEdit }">
    <template #header>
      <div class="p-3 border-bottom-1 surface-border" :class="{ 'editable-header': canEdit }">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-list text-2xl" :class="canEdit ? 'text-900' : 'text-white'"></i>
          <span class="text-xl font-semibold" :class="canEdit ? 'text-900' : ''">Casuística</span>
          <span v-if="canEdit" class="text-xs font-bold px-2 py-1 border-round bg-orange-600 text-white ml-auto animate-pulse">
            <i class="pi pi-pencil mr-1"></i>EDITABLE
          </span>
        </div>
      </div>
    </template>

    <template #content>
      <div class="flex flex-column gap-2">
        <div 
          v-for="(item, index) in localCasuistics" 
          :key="item.id"
          class="flex align-items-start gap-3 p-3 border-round border-1 border-green-300 bg-green-50">
          <div class="flex align-items-center justify-content-center border-circle bg-green-500 text-white font-bold"
               style="min-width: 28px; height: 28px; font-size: 0.875rem;">
            {{ index + 1 }}
          </div>
          <p class="m-0 text-900 flex-1">{{ item.value }}</p>
          <pv-button
            v-if="canEdit"
            icon="pi pi-times"
            class="p-button-rounded p-button-text p-button-danger p-button-sm"
            @click="handleRemoveCasuistic(index)"
          />
        </div>

        <!-- Add new casuistic -->
        <div v-if="canEdit" class="flex gap-2 mt-2">
          <pv-input-text
            v-model="newCasuistic"
            placeholder="Nueva casuística..."
            class="flex-1 editable-input"
            @keyup.enter="handleAddCasuistic"
          />
          <pv-button
            label="Agregar"
            icon="pi pi-plus"
            @click="handleAddCasuistic"
          />
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.editable-card {
  border: 3px solid var(--primary-color);
  box-shadow: 0 0 20px rgba(33, 150, 243, 0.3);
}

.editable-header {
  background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);
  border-bottom: 2px solid #ffc107 !important;
}

.editable-input {
  animation: pulse-input 2s ease-in-out infinite;
}

.editable-input:focus {
  animation: none;
}

@keyframes pulse-input {
  0%, 100% {
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.3);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(33, 150, 243, 0.5);
  }
}
</style>
