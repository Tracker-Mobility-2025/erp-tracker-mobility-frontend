<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderRequestForm } from '../composables/use-order-request-form.js';
import { useOrderRequestStore } from '../../application/order-request.store.js';

// Componentes de los pasos
import CustomerData from '../components/1-customer-data.vue';
import AddressData from '../components/2-address-data.vue';
import SupportDocsLandlord from '../components/3-support-docs-landlord.vue';
import Resumen from '../components/4-resumen.vue';
import Toolbar from '../../../shared-v2/presentation/components/toolbar.vue';

const router = useRouter();
const store = useOrderRequestStore();

// Usar el composable para la lógica del formulario
const {
  initForm,
  handleNext,
  handleBack,
  handleCancel,
  handleComplete,
  handleFinish
} = useOrderRequestForm();

// Inicializar el formulario al montar
onMounted(async () => {
  await initForm();
});
</script>

<template>
  <div class="order-request-form-container h-full w-full flex flex-column">
    <!-- Toolbar -->
    <toolbar
      title="Nueva Solicitud"
      description="Completa los pasos para crear una solicitud de visita domiciliaria"
      :show-back-button="true"
    >
      <template #actions>
        <div class="flex align-items-center gap-2">
          <span class="text-white text-sm">Paso {{ store.currentStep }} de {{ store.totalSteps }}</span>
          <pv-badge :value="store.currentStep" severity="info" />
        </div>
      </template>
    </toolbar>

    <div class="flex-1 overflow-auto p-4">
      <!-- Header con progreso -->
      <div class="progress-header surface-card shadow-2 p-4 mb-4">
        <div class="flex flex-column gap-3" style="max-width: 1200px; margin: 0 auto;">
          
          <!-- Paso actual -->
          <div class="flex justify-content-between align-items-center">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-file-edit text-xl text-primary"></i>
              <h2 class="m-0 text-xl font-semibold text-900">{{ store.stepTitle }}</h2>
            </div>
            <div class="text-right">
              <span class="text-sm text-600">{{ store.progressPercentage }}% completado</span>
            </div>
          </div>

        <!-- Barra de progreso -->
        <div class="w-full">
          <pv-progress-bar 
            :value="store.progressPercentage" 
            :show-value="false"
            style="height: 8px;"
          />
        </div>

        <!-- Indicadores de pasos -->
        <div class="flex justify-content-between align-items-center gap-2">
          <div 
            v-for="step in store.totalSteps" 
            :key="step"
            class="flex-1 flex align-items-center gap-2"
          >
            <div 
              class="step-indicator flex align-items-center justify-content-center"
              :class="{
                'step-completed': step < store.currentStep,
                'step-active': step === store.currentStep,
                'step-pending': step > store.currentStep
              }"
            >
              <i 
                v-if="step < store.currentStep" 
                class="pi pi-check text-white text-sm"
              ></i>
              <span v-else class="text-sm font-semibold">{{ step }}</span>
            </div>
            <div 
              v-if="step < store.totalSteps" 
              class="flex-1 step-line"
              :class="{
                'step-line-completed': step < store.currentStep,
                'step-line-pending': step >= store.currentStep
              }"
            ></div>
          </div>
        </div>
        
        </div>
      </div>

      <!-- Contenido del paso actual -->
      <div class="step-content">
      <div v-if="store.currentStep === 1">
        <customer-data 
          @next="handleNext"
        />
      </div>

      <div v-else-if="store.currentStep === 2">
        <address-data 
          @next="handleNext"
          @back="handleBack"
        />
      </div>

      <div v-else-if="store.currentStep === 3">
        <support-docs-landlord 
          @back="handleBack"
          @cancel="handleCancel"
          @complete="handleComplete"
        />
      </div>

      <div v-else-if="store.currentStep === 4">
        <resumen 
          @finish="handleFinish"
        />
      </div>
    </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="store.loading" class="loading-overlay flex align-items-center justify-content-center">
      <div class="surface-card border-round-lg shadow-4 p-5 text-center">
        <i class="pi pi-spin pi-spinner text-4xl text-primary mb-3"></i>
        <div class="text-xl font-semibold text-900">Procesando solicitud...</div>
        <div class="text-sm text-600 mt-2">Por favor espera un momento</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-request-form-container {
  background: var(--surface-ground);
}

.progress-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
}

.step-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* Indicadores de pasos */
.step-indicator {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.step-completed {
  background: var(--green-500);
  color: white;
}

.step-active {
  background: var(--primary-500);
  color: white;
  box-shadow: 0 0 0 4px var(--primary-100);
}

.step-pending {
  background: var(--surface-200);
  color: var(--text-color-secondary);
}

/* Líneas de conexión entre pasos */
.step-line {
  height: 3px;
  transition: all 0.3s ease;
}

.step-line-completed {
  background: var(--green-500);
}

.step-line-pending {
  background: var(--surface-200);
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  backdrop-filter: blur(4px);
}

/* Responsive */
@media (max-width: 768px) {
  .progress-header {
    padding: 1rem !important;
  }

  .step-indicator {
    width: 28px;
    height: 28px;
  }
  
  .step-indicator span,
  .step-indicator i {
    font-size: 0.75rem;
  }
}
</style>
