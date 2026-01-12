<script setup>
import { computed } from 'vue';

/**
 * Componente para mostrar referencias de contacto (familiares, arrendador, etc.)
 * Presentation Layer - Display Component.
 */

// Props
const props = defineProps({
  references: {
    type: Array,
    default: () => []
  },
  landlordName: {
    type: String,
    default: ''
  },
  landlordPhone: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    default: true
  }
});

// Computed: Combinar arrendador con referencias
const allReferences = computed(() => {
  const refs = [...props.references];
  
  // Agregar arrendador si existe
  if (props.landlordName || props.landlordPhone) {
    refs.push({
      id: 'landlord',
      fullName: props.landlordName || 'Sin nombre',
      phoneNumber: props.landlordPhone || 'Sin teléfono',
      relation: 'Arrendador'
    });
  }
  
  return refs;
});
</script>

<template>
  <pv-card v-if="visible && allReferences.length > 0" class="mb-4">
    <template #header>
      <div class="p-3 border-bottom-1 surface-border">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-users text-2xl text-white"></i>
          <span class="text-xl font-semibold">Datos Referenciales de Familiares o Arrendadores</span>
        </div>
      </div>
    </template>

    <template #content>
      <div class="grid">
        <div 
          v-for="reference in allReferences" 
          :key="reference.id"
          class="col-12 md:col-6 lg:col-4">
          <div class="h-full flex flex-column p-3 border-round border-2 surface-border bg-surface-0" style="min-height: 140px;">
            <!-- Avatar e ícono -->
            <div class="flex align-items-center gap-3 mb-3">
              <div class="flex align-items-center justify-content-center border-circle bg-pink-500" 
                   style="width: 48px; height: 48px;">
                <i class="pi pi-user text-2xl text-white"></i>
              </div>
              <h4 class="m-0 font-bold text-900 text-lg">{{ reference.fullName }}</h4>
            </div>

            <!-- Teléfono -->
            <div class="flex align-items-center gap-2 mb-3">
              <i class="pi pi-phone text-pink-500"></i>
              <span class="font-semibold text-900">{{ reference.phoneNumber || 'Sin teléfono' }}</span>
            </div>

            <!-- Relación -->
            <div class="mt-auto">
              <div class="p-2 border-round bg-pink-50 text-center">
                <span class="text-xs text-600 font-semibold">Relación: </span>
                <span class="text-xs font-bold text-pink-900">{{ reference.relation || 'No especificado' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
</style>
