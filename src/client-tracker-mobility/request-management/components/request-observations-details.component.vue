<script>
export default {
  name: 'request-observations-details',

  props: {
    observations: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      // Opciones de tipos de observación para etiquetas legibles
      observationTypeLabels: {
        'DOCUMENTO_IDENTIDAD': 'Documento de identidad',
        'RECIBO_SERVICIO': 'Recibo de servicio'
      },

      // Configuración de severidad por estado (para levantamiento de observaciones)
      statusConfig: {
        'PENDIENTE': { severity: 'danger', label: 'PENDIENTE', icon: 'pi-exclamation-triangle' },
        'RESUELTA': { severity: 'success', label: 'RESUELTA', icon: 'pi-check-circle' }
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
      return this.statusConfig[status] || { severity: 'info', label: status, icon: 'pi-info-circle' };
    },

    // TODO: Implementar la lógica para subsanar/resolver/levantar/corregir la observación
    handleSubsanarObservation(observation) {
      console.log('Subsanar observación:', observation);

      // TODO: Implementar aquí la lógica de subsanación
      // Opciones posibles:
      // 1. Mostrar un diálogo de confirmación
      // 2. Abrir un modal para subir documentos/evidencias
      // 3. Emitir evento al componente padre: this.$emit('subsanar-observation', observation)
      // 4. Hacer petición directa al API para cambiar estado a 'RESUELTA'
      // 5. Redirigir a otra vista para completar el proceso
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
            <pv-tag
                :severity="getStatusConfig(observation.status).severity"
                :value="getStatusConfig(observation.status).label"
                :icon="`pi ${getStatusConfig(observation.status).icon}`"
            />
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
