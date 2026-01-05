<template>
  <Card class="zone-info-card">
    <template #title>
      <div class="flex align-items-center justify-content-between">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-map-marker text-2xl"></i>
          <span>Información de la Zona</span>
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
      <div v-if="zone" class="zone-content">
        <div class="grid">
          <!-- Tipo de Zona -->
          <div class="col-12 md:col-6">
            <div class="field-info">
              <label class="field-label">Tipo de Zona</label>
              <div class="field-value">
                <Tag :value="getZoneTypeLabel(zone.zoneType)" severity="info" />
              </div>
            </div>
          </div>

          <!-- Tipo de Acceso -->
          <div class="col-12 md:col-6">
            <div class="field-info">
              <label class="field-label">Tipo de Acceso</label>
              <div class="field-value">{{ getAccessTypeLabel(zone.accessType) }}</div>
            </div>
          </div>

          <!-- Nivel de Riesgo -->
          <div class="col-12 md:col-6">
            <div class="field-info">
              <label class="field-label">Nivel de Riesgo</label>
              <div class="field-value">
                <Tag :value="getRiskLevelLabel(zone.riskLevel)" 
                     :severity="getRiskLevelColor(zone.riskLevel)" />
              </div>
            </div>
          </div>

          <!-- Transporte Público -->
          <div class="col-12 md:col-6">
            <div class="field-info">
              <label class="field-label">Transporte Público</label>
              <div class="field-value">
                <Tag :value="zone.hasPublicTransport ? 'Disponible' : 'No disponible'" 
                     :severity="zone.hasPublicTransport ? 'success' : 'secondary'" />
              </div>
            </div>
          </div>

          <!-- Características de la Zona -->
          <div class="col-12" v-if="zone.zoneCharacteristics && zone.zoneCharacteristics.length > 0">
            <Divider />
            <h4 class="mt-2 mb-3">Características de la Zona</h4>
            <div class="flex flex-wrap gap-2">
              <Tag v-for="characteristic in zone.zoneCharacteristics" 
                   :key="characteristic"
                   :value="getZoneCharacteristicLabel(characteristic)" 
                   severity="secondary" />
            </div>
          </div>

          <!-- Servicios Cercanos -->
          <div class="col-12" v-if="zone.nearbyServices && zone.nearbyServices.length > 0">
            <Divider />
            <h4 class="mt-2 mb-3">Servicios Cercanos</h4>
            <div class="services-grid">
              <div v-for="service in zone.nearbyServices" 
                   :key="service"
                   class="service-item">
                <i class="pi pi-check-circle text-green-500 mr-2"></i>
                <span>{{ getNearbyServiceLabel(service) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-data-message">
        <i class="pi pi-info-circle mr-2"></i>
        <span>No hay información de zona registrada</span>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';
import { 
  ZoneTranslations,
  ZoneColors
} from '../../domain/constants/zone.constants.js';

const props = defineProps({
  zone: {
    type: Object,
    default: null
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

defineEmits(['edit']);

const getZoneTypeLabel = (type) => ZoneTranslations[type] || type || 'No especificado';
const getAccessTypeLabel = (type) => ZoneTranslations[type] || type || 'No especificado';
const getRiskLevelLabel = (level) => ZoneTranslations[level] || level || 'No especificado';
const getZoneCharacteristicLabel = (characteristic) => ZoneTranslations[characteristic] || characteristic;
const getNearbyServiceLabel = (service) => ZoneTranslations[service] || service;

const getRiskLevelColor = (level) => ZoneColors[level] || 'secondary';
</script>

<style scoped>
.zone-info-card {
  margin-bottom: 1.5rem;
}

.zone-content {
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

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.service-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background: var(--surface-50);
  border-radius: 6px;
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
