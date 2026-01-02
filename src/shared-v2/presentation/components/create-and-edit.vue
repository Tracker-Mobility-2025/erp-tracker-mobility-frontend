<script setup>
// ===========================
// IMPORTS
// ===========================
// Importación de dependencias de Vue para estado reactivo y ciclo de vida
import { computed, onMounted } from 'vue'

// ===========================
// PROPS
// ===========================
// Definición de propiedades: configuración del diálogo para crear/editar entidades
const props = defineProps({
  entity: {
    type: Object,
    default: null
  },
  visible: {
    type: Boolean,
    default: false
  },
  entityName: {
    type: String,
    default: ''
  },
  edit: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'standard', 'large'].includes(value)
  },
  customButtonLabel: {
    type: String,
    default: null
  }
})

// ===========================
// EMITS
// ===========================
// Definición de eventos: cancelar y guardar operación
const emit = defineEmits(['canceled-shared', 'saved-shared'])

// ===========================
// COMPUTED PROPERTIES
// ===========================
// Propiedades computadas para títulos, labels y estilos dinámicos del diálogo
const headerTitle = computed(() => {
  return `${props.edit ? 'Editar' : 'Nuevo'} ${props.entityName}`
})

const submitLabel = computed(() => {
  return props.customButtonLabel || (props.edit ? 'Actualizar' : 'Crear')
})

const dialogStyle = computed(() => {
  const styles = {
    default: { width: '400px' },
    standard: { width: '600px' },
    large: { width: '900px' }
  }
  return styles[props.size] || styles.default
})

// ===========================
// METHODS - EVENT HANDLERS
// ===========================
// Métodos para manejar eventos de cancelar y guardar
const onCancelRequested = () => {
  emit('canceled-shared')
}

const onSaveRequested = () => {
  emit('saved-shared', props.entity)
}

// ===========================
// LIFECYCLE HOOKS
// ===========================
// Inicialización y logging al montar el componente
onMounted(() => {
  console.log('Create and Edit component mounted', props.entity)
})
</script>

<template>
  <pv-dialog 
    :visible="visible" 
    :modal="true" 
    :style="dialogStyle" 
    class="p-fluid" 
    :header="entityName" 
    :closable="false"
  >
    <template #header>
      <div class="flex justify-content-start">
        <div>{{ headerTitle }}</div>
      </div>
    </template>

    <!-- Slot para el contenido personalizado -->
    <slot name="content"></slot>

    <template #footer>
      <div class="flex justify-content-end gap-2 w-full">
        <pv-button 
          type="button" 
          :label="submitLabel" 
          class="p-button-primary w-full"
          icon="pi pi-check" 
          @click="onSaveRequested"
        />
        <pv-button 
          type="button" 
          label="Cancelar" 
          class="p-button-secondary w-full"
          icon="pi pi-times"
          @click="onCancelRequested"
        />
      </div>
    </template>
  </pv-dialog>
</template>

<style scoped>
</style>
