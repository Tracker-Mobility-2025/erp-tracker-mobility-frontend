<script>
export default {
  name: "module-under-development",
  props: {
    moduleName: {
      type: String,
      default: "Módulo"
    },
    estimatedDate: {
      type: String,
      default: null
    },
    showProgress: {
      type: Boolean,
      default: true
    },
    progressPercentage: {
      type: Number,
      default: 65
    }
  }
}
</script>

<template>
  <div class="development-container flex align-items-center justify-content-center h-full">
    <pv-card class="development-card w-full max-w-3xl shadow-3 border-round">
      <template #content>
        <!-- Header compacto -->
        <div class="text-center mb-4">
          <div class="mb-3">
            <i class="pi pi-cog text-4xl text-primary development-icon"></i>
          </div>

          <h2 class="text-2xl font-bold text-primary mb-2 line-height-3">
            {{ moduleName }} en Desarrollo
          </h2>

          <div class="flex justify-content-center mb-3">
            <pv-tag severity="info" icon="pi pi-clock" class="px-2 py-1">
              <span class="text-sm font-medium">En Desarrollo</span>
            </pv-tag>
          </div>
        </div>

        <!-- Progreso compacto -->
        <div v-if="showProgress" class="mb-4">
          <div class="flex justify-content-between align-items-center mb-2">
            <span class="text-sm font-medium text-700">Progreso</span>
            <pv-chip :label="`${progressPercentage}%`" class="bg-primary text-white text-xs" />
          </div>
          <pv-progress-bar
            :value="progressPercentage"
            class="development-progress"
            :showValue="false"
          />
        </div>

        <!-- Características en grid compacto -->
        <div class="grid mb-4">
          <div class="col-6 mb-2">
            <div class="feature-item flex align-items-center p-2 bg-blue-50 border-round">
              <i class="pi pi-palette text-blue-500 mr-2"></i>
              <span class="text-sm text-700">UI/UX</span>
            </div>
          </div>
          <div class="col-6 mb-2">
            <div class="feature-item flex align-items-center p-2 bg-green-50 border-round">
              <i class="pi pi-cog text-green-500 mr-2"></i>
              <span class="text-sm text-700">Backend</span>
            </div>
          </div>
          <div class="col-6 mb-2">
            <div class="feature-item flex align-items-center p-2 bg-purple-50 border-round">
              <i class="pi pi-shield text-purple-500 mr-2"></i>
              <span class="text-sm text-700">Testing</span>
            </div>
          </div>
          <div class="col-6 mb-2">
            <div class="feature-item flex align-items-center p-2 bg-orange-50 border-round">
              <i class="pi pi-link text-orange-500 mr-2"></i>
              <span class="text-sm text-700">APIs</span>
            </div>
          </div>
        </div>

        <!-- Fecha estimada compacta -->
        <div v-if="estimatedDate" class="mb-4">
          <div class="flex align-items-center justify-content-center p-3 bg-yellow-50 border-left-3 border-yellow-500 border-round">
            <i class="pi pi-calendar text-yellow-600 mr-2"></i>
            <span class="text-sm font-medium text-800">
              Disponible: <strong>{{ estimatedDate }}</strong>
            </span>
          </div>
        </div>

        <!-- Footer minimalista -->
        <div class="text-center pt-3 border-top-1 border-200">
          <p class="text-xs text-600 mb-0">
            <i class="pi pi-info-circle mr-1"></i>
            Contáctanos para más información sobre el desarrollo
          </p>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.development-container {
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
  padding: 1rem;
}

.development-card {
  background: var(--color-white);
  position: relative;
  overflow: hidden;
  max-height: calc(100vh - 8rem);
}

.development-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-border-cards) 100%);
}

.development-icon {
  position: relative;
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.development-progress :deep(.p-progressbar) {
  height: 8px;
  background: var(--color-background);
  border-radius: 4px;
}

.development-progress :deep(.p-progressbar-value) {
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-border-cards) 100%);
  border-radius: 4px;
}

.feature-item {
  transition: all 0.2s ease;
}

.feature-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Animación de entrada */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.development-card {
  animation: fadeInUp 0.5s ease-out;
}

/* Responsive compacto */
@media (max-width: 768px) {
  .development-container {
    padding: 0.5rem;
  }

  .development-card {
    max-height: calc(100vh - 4rem);
  }
}
</style>
