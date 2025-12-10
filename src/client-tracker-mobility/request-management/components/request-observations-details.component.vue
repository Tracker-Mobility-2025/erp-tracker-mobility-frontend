<script>
export default {
  name: 'request-observations-details',

  props: {
    observations: {
      type: Array,
      default: () => []
    }
  },

  emits: ['subsanar-observation'],

  data() {
    return {
      // Opciones de tipos de observación para etiquetas legibles
      observationTypeLabels: {
        'DOCUMENTO_IDENTIDAD_BORROSO': 'Documento de identidad - Borroso o ilegible',
        'RECIBO_SERVICIO_BORROSO': 'Recibo de servicio - Borroso o ilegible',
        'FOTO_FACHADA_BORROSA': 'Foto fachada vivienda - Borrosa o ilegible',
        'UBICACION_INCORRECTA': 'Ubicación en mapa - Enlace incorrecto',
        'DATOS_CLIENTE_INCOMPLETOS': 'Datos del cliente - Incorrectos',
        'DATOS_ARRENDADOR_INCOMPLETOS': 'Datos del arrendador - Incorrectos',
        // Mantener compatibilidad con valores antiguos
        'DOCUMENTO_IDENTIDAD': 'Documento de identidad',
        'RECIBO_SERVICIO': 'Recibo de servicio'
      },

      // Configuración de estados de observaciones con colores personalizados
      statusConfig: {
        'PENDIENTE': { severity: 'danger', label: 'PENDIENTE', icon: 'pi-exclamation-triangle', color: '#FB8C00' },
        'RESUELTA': { severity: 'success', label: 'RESUELTA', icon: 'pi-check-circle', color: '#4CAF50' }
      }
    }
  },

  computed: {
    // Filtrar solo observaciones pendientes
    pendingObservations() {
      return this.observations.filter(obs => obs.status === 'PENDIENTE');
    },

    // Mostrar la card solo si hay observaciones pendientes
    shouldShowCard() {
      return this.pendingObservations && this.pendingObservations.length > 0;
    }
  },

  methods: {
    getObservationTypeLabel(type) {
      return this.observationTypeLabels[type] || type;
    },

    getStatusConfig(status) {
      return this.statusConfig[status] || { severity: 'info', label: status, icon: 'pi-info-circle', color: '#E0E0E0' };
    },

    getObservationColor(status) {
      const config = this.getStatusConfig(status);
      return config.color;
    },

    shouldUseWhiteTextObservation(status) {
      return ['PENDIENTE', 'RESUELTA'].includes(status);
    },

    // Manejar subsanación de observación - Emitir evento al padre para habilitar modo edición
    handleSubsanarObservation(observation) {
      console.log('Subsanar observación:', observation);

      // Emitir evento al componente padre con la observación
      this.$emit('subsanar-observation', observation);
    }
  }
}
</script>

<template>
  <!-- Solo mostrar la card si hay observaciones pendientes -->
  <pv-card v-if="shouldShowCard" class="w-full">
    <template #header>
      <div class="flex align-items-center gap-2 px-3 py-2" style="background-color: #4A60D0; color: white; border-top-left-radius: 6px; border-top-right-radius: 6px;">
        <i class="pi pi-exclamation-triangle" style="color: white;"></i>
        <span class="text-lg font-bold">Observaciones Pendientes</span>
      </div>
    </template>
    <template #content>
      <!-- Lista de observaciones pendientes -->
      <div class="flex flex-column gap-3">
        <div
            v-for="(observation, index) in pendingObservations"
            :key="observation.id || index"
            class="p-3 surface-ground border-round border-1 surface-border"
        >
          <!-- Header de la observación -->
          <div class="flex justify-content-between align-items-start mb-2">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-file text-primary"></i>
              <span class="font-semibold text-900">
                {{ getObservationTypeLabel(observation.observationType) }}
              </span>
            </div>
            <span
              class="observation-status-tag"
              :style="{
                backgroundColor: getObservationColor(observation.status),
                color: shouldUseWhiteTextObservation(observation.status) ? '#FFFFFF' : '#000000'
              }"
            >
              <i :class="`pi ${getStatusConfig(observation.status).icon} mr-1`"></i>
              {{ getStatusConfig(observation.status).label }}
            </span>
          </div>

          <!-- Descripción de la observación -->
          <div class="pl-4 border-left-3 border-primary mb-3">
            <p class="m-0 text-color line-height-3 white-space-pre-wrap">
              {{ observation.description }}
            </p>
          </div>

          <!-- Botón para resolver/subsanar la observación -->
          <div class="flex justify-content-end">
            <pv-button
                label="Subsanar Observación"
                icon="pi pi-check"
                class="p-button-success"
                size="small"
                @click="handleSubsanarObservation(observation)"
            />
          </div>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
/* Tags de estado de observaciones personalizados */
.observation-status-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
}

:deep(.p-card) {
  border-radius: 6px !important;
  overflow: hidden !important;
}

:deep(.p-card .p-card-header) {
  background-color: #4A60D0 !important;
  color: white !important;
  border-top-left-radius: 6px !important;
  border-top-right-radius: 6px !important;
  padding: 0 !important;
  border-bottom: none !important;
}

:deep(.p-card-content) {
  padding: 0.5rem;
}

.card-header {
  background-color: #4A60D0 !important;
  color: white !important;
}

.white-space-pre-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
