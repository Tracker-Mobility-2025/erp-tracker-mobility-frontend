<script setup>
import { ref, watch } from 'vue';

/**
 * Componente para mostrar resumen del reporte
 * Presentation Layer - Display Component.
 */

// Props
const props = defineProps({
  summary: {
    type: String,
    default: ''
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
const emit = defineEmits(['update:summary']);

// State
const localSummary = ref(props.summary || '');

// Watch for external changes
watch(() => props.summary, (newValue) => {
  localSummary.value = newValue || '';
}, { immediate: true });

// Methods
const handleInput = () => {
  emit('update:summary', localSummary.value);
};
</script>

<template>
  <pv-card v-if="visible && (summary || canEdit)" class="mb-4" :class="{ 'editable-card': canEdit }">
    <template #header>
      <div class="p-3 border-bottom-1 surface-border" :class="{ 'editable-header': canEdit }">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-file-edit text-2xl" :class="canEdit ? 'text-900' : 'text-white'"></i>
          <span class="text-xl font-semibold" :class="canEdit ? 'text-900' : ''">Resumen</span>
          <span v-if="canEdit" class="text-xs font-bold px-2 py-1 border-round bg-orange-600 text-white ml-auto animate-pulse">
            <i class="pi pi-pencil mr-1"></i>EDITABLE
          </span>
        </div>
      </div>
    </template>

    <template #content>
      <div v-if="canEdit" class="p-3">
        <pv-textarea
          v-model="localSummary"
          rows="8"
          class="w-full editable-input"
          placeholder="Ingrese el resumen del reporte..."
          @input="handleInput"
        />
      </div>
      <div v-else class="p-3 border-round border-1 surface-border bg-surface-50">
        <p class="m-0 text-900 line-height-3 white-space-pre-wrap">{{ summary }}</p>
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
