<template>
  <Card class="location-info-card">
    <template #title>
      <div class="flex align-items-center justify-content-between">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-map text-2xl"></i>
          <span>Ubicación</span>
        </div>
        <Button 
          v-if="!readonly"
          icon="pi pi-pencil" 
          label="Editar"
          size="small"
          text
          @click="$emit('edit')"
        />
      </div>
    </template>

    <template #content>
      <div v-if="location" class="location-content">
        <div class="grid">
          <!-- Dirección Completa -->
          <div class="col-12">
            <div class="field-info">
              <label class="field-label">Dirección Completa</label>
              <div class="field-value address-value">
                <i class="pi pi-home mr-2"></i>
                {{ location.fullAddress }}
              </div>
            </div>
          </div>

          <!-- Departamento -->
          <div class="col-12 md:col-4">
            <div class="field-info">
              <label class="field-label">Departamento</label>
              <div class="field-value">{{ location.department || 'No especificado' }}</div>
            </div>
          </div>

          <!-- Provincia -->
          <div class="col-12 md:col-4">
            <div class="field-info">
              <label class="field-label">Provincia</label>
              <div class="field-value">{{ location.province || 'No especificado' }}</div>
            </div>
          </div>

          <!-- Distrito -->
          <div class="col-12 md:col-4">
            <div class="field-info">
              <label class="field-label">Distrito</label>
              <div class="field-value">{{ location.district || 'No especificado' }}</div>
            </div>
          </div>

          <!-- Dirección -->
          <div class="col-12">
            <div class="field-info">
              <label class="field-label">Dirección</label>
              <div class="field-value">{{ location.homeAddress || 'No especificado' }}</div>
            </div>
          </div>

          <!-- Referencia -->
          <div class="col-12" v-if="location.reference">
            <div class="field-info">
              <label class="field-label">Referencia</label>
              <div class="field-value reference-value">
                <i class="pi pi-info-circle mr-2"></i>
                {{ location.reference }}
              </div>
            </div>
          </div>

          <!-- Coordenadas -->
          <div class="col-12" v-if="location.hasCoordinates">
            <Divider />
            <h4 class="mt-2 mb-3">Coordenadas GPS</h4>
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="field-info">
                  <label class="field-label">Latitud</label>
                  <div class="field-value">{{ location.latitude }}</div>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="field-info">
                  <label class="field-label">Longitud</label>
                  <div class="field-value">{{ location.longitude }}</div>
                </div>
              </div>

              <div class="col-12">
                <Button 
                  label="Ver en Google Maps" 
                  icon="pi pi-map-marker"
                  severity="secondary"
                  outlined
                  @click="openInGoogleMaps"
                  class="w-full md:w-auto" />
              </div>
            </div>
          </div>

          <!-- Ubicación en Mapa -->
          <div class="col-12" v-if="location.mapLocation">
            <Divider />
            <h4 class="mt-2 mb-3">Ubicación en Mapa</h4>
            <div class="map-placeholder">
              <i class="pi pi-map text-4xl text-400"></i>
              <p class="mt-3">Mapa guardado disponible</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-data-message">
        <i class="pi pi-info-circle mr-2"></i>
        <span>No hay información de ubicación registrada</span>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Divider from 'primevue/divider';

const props = defineProps({
  location: {
    type: Object,
    default: null
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

defineEmits(['edit']);

const openInGoogleMaps = () => {
  if (props.location && props.location.hasCoordinates) {
    const url = `https://www.google.com/maps?q=${props.location.latitude},${props.location.longitude}`;
    window.open(url, '_blank');
  }
};
</script>

<style scoped>
.location-info-card {
  margin-bottom: 1.5rem;
}

.location-content {
  padding: 0.5rem 0;
}

.field-info {
  margin-bottom: 1rem;
}

.field-label {
  display: block;
  font-weight: 600;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.field-value {
  font-size: 1rem;
  color: var(--text-color);
}

.address-value {
  font-weight: 500;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: var(--primary-50);
  border-left: 4px solid var(--primary-500);
  border-radius: 6px;
}

.reference-value {
  display: flex;
  align-items: start;
  padding: 0.75rem;
  background: var(--surface-50);
  border-radius: 6px;
  font-style: italic;
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: var(--surface-50);
  border: 2px dashed var(--surface-300);
  border-radius: 8px;
  color: var(--text-color-secondary);
}

.no-data-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-color-secondary);
  font-style: italic;
}
</style>
