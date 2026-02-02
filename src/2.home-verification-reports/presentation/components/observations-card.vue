<script setup>
import { ref, watch } from 'vue';

/**
 * Componente para mostrar observaciones del reporte
 * Presentation Layer - Display Component.
 */

// Props
const props = defineProps({
  observations: {
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
const emit = defineEmits(['update:observations']);

// State
const localObservations = ref([...props.observations]);
const newObservation = ref('');

// Watch for external changes
watch(() => props.observations, (newValue) => {
  localObservations.value = [...(newValue || [])];
}, { deep: true, immediate: true });

// Methods
const handleAddObservation = () => {
  if (newObservation.value.trim()) {
    const updatedObservations = [
      ...localObservations.value,
      { id: Date.now(), value: newObservation.value.trim() }
    ];
    localObservations.value = updatedObservations;
    emit('update:observations', updatedObservations);
    newObservation.value = '';
  }
};

const handleRemoveObservation = (index) => {
  const updatedObservations = localObservations.value.filter((_, i) => i !== index);
  localObservations.value = updatedObservations;
  emit('update:observations', updatedObservations);
};
</script>

<template>
  <pv-card v-if="visible && (observations.length > 0 || canEdit)" class="mb-4" :class="{ 'editable-card': canEdit }">
    <template #header>
      <div class="p-3 border-bottom-1 surface-border" :class="{ 'editable-header': canEdit }">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-exclamation-circle text-2xl" :class="canEdit ? 'text-900' : 'text-white'"></i>
          <span class="text-xl font-semibold" :class="canEdit ? 'text-900' : ''">Observaciones</span>
          <span v-if="canEdit" class="text-xs font-bold px-2 py-1 border-round bg-orange-600 text-white ml-auto animate-pulse">
            <i class="pi pi-pencil mr-1"></i>EDITABLE
          </span>
        </div>
      </div>
    </template>

    <template #content>
      <div class="flex flex-column gap-2">
        <div 
          v-for="(observation, index) in localObservations" 
          :key="observation.id"
          class="flex align-items-start gap-3 p-3 border-round border-1 border-yellow-300 bg-yellow-50">
          <div class="flex align-items-center justify-content-center border-circle bg-yellow-500 text-white font-bold"
               style="min-width: 28px; height: 28px; font-size: 0.875rem;">
            {{ index + 1 }}
          </div>
          <p class="m-0 text-900 flex-1">{{ observation.value }}</p>
          <pv-button
            v-if="canEdit"
            icon="pi pi-times"
            class="p-button-rounded p-button-text p-button-danger p-button-sm"
            @click="handleRemoveObservation(index)"
          />
        </div>

        <!-- Add new observation -->
        <div v-if="canEdit" class="flex gap-2 mt-2">
          <pv-input-text
            v-model="newObservation"
            placeholder="Nueva observación..."
            class="flex-1 editable-input"
            @keyup.enter="handleAddObservation"
          />
          <pv-button
            label="Agregar"
            icon="pi pi-plus"
            @click="handleAddObservation"
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
