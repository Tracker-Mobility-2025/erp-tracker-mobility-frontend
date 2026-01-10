<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Toolbar from '../../../shared-v2/presentation/components/toolbar.vue';

const route = useRoute();
const router = useRouter();

const orderId = ref(null);
const loading = ref(false);

onMounted(() => {
  orderId.value = route.query.id;
});

const handleBack = () => {
  router.push({ name: 'order-requests-list' });
};
</script>

<template>
  <div class="h-full w-full flex flex-column">
    <toolbar 
      title="Detalle de Solicitud" 
      description="Visualiza la información completa de la solicitud" 
      :show-back-button="true"
      @back="handleBack"
    />

    <div class="flex-1 p-4 overflow-auto">
      <div class="surface-card border-round-lg shadow-2 p-4">
        <div class="text-center p-5">
          <i class="pi pi-info-circle text-4xl text-primary mb-3"></i>
          <h3 class="text-xl font-semibold text-900 mb-2">Vista de Detalle</h3>
          <p class="text-600">Esta vista está en construcción. ID de orden: {{ orderId }}</p>
          <pv-button 
            label="Volver a Mis Solicitudes" 
            icon="pi pi-arrow-left"
            class="mt-3"
            @click="handleBack"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos personalizados si es necesario */
</style>
