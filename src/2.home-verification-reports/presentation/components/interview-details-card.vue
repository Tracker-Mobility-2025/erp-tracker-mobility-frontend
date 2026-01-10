<script setup>
import { computed } from 'vue';
import {
  DwellingTypeTranslations,
  ResidenceTypeTranslations,
  DwellingMaterialTranslations,
  DwellingConditionTranslations,
  ZoneTypeTranslations,
  GarageTypeTranslations,
  DistanceToDwellingTranslations,
  TypeFurnishedTranslations,
  RoofTypeTranslations,
  ZoneCharacteristicsTranslations,
  AccessTypeTranslations,
  AreaRiskTranslations
} from '../constants/verification-report-ui.constants.js';

/**
 * Componente para mostrar los detalles de la entrevista de verificación domiciliaria.
 * Presentation Layer - Display Component.
 * Muestra información de residencia, vivienda, características de la zona y garaje.
 */

// Props
const props = defineProps({
  // Información de Residencia
  livesWith: {
    type: String,
    default: ''
  },
  isResident: {
    type: Boolean,
    default: false
  },
  timeLivingText: {
    type: String,
    default: ''
  },
  
  // Información de Vivienda
  dwellingType: {
    type: String,
    default: ''
  },
  residenceType: {
    type: String,
    default: ''
  },
  apartmentInformation: {
    type: String,
    default: ''
  },
  typeFurnished: {
    type: String,
    default: ''
  },
  roofType: {
    type: String,
    default: ''
  },
  facadeColor: {
    type: String,
    default: ''
  },
  
  // Características
  dwellingMaterial: {
    type: String,
    default: ''
  },
  dwellingCondition: {
    type: String,
    default: ''
  },
  zoneType: {
    type: String,
    default: ''
  },
  zoneCharacteristics: {
    type: Array,
    default: () => []
  },
  accessType: {
    type: String,
    default: ''
  },
  
  // Zona y Garaje (cards destacadas)
  areaRisk: {
    type: Array,
    default: () => []
  },
  garageType: {
    type: String,
    default: ''
  },
  distanceToDwelling: {
    type: String,
    default: ''
  },
  
  // Control de visibilidad
  visible: {
    type: Boolean,
    default: true
  }
});

// Computed
const residentText = computed(() => props.isResident ? 'Sí' : 'No');

const areaRiskText = computed(() => {
  if (!props.areaRisk || props.areaRisk.length === 0) {
    return 'Ninguno';
  }
  return props.areaRisk
    .map(risk => AreaRiskTranslations[risk] || risk)
    .join(', ');
});

const zoneCharacteristicsText = computed(() => {
  if (!props.zoneCharacteristics || props.zoneCharacteristics.length === 0) {
    return 'No especificado';
  }
  return props.zoneCharacteristics
    .map(char => ZoneCharacteristicsTranslations[char] || char)
    .join(', ');
});

const typeFurnishedText = computed(() => {
  return TypeFurnishedTranslations[props.typeFurnished] || props.typeFurnished || 'No especificado';
});

const roofTypeText = computed(() => {
  return RoofTypeTranslations[props.roofType] || props.roofType || 'No especificado';
});

const accessTypeText = computed(() => {
  return AccessTypeTranslations[props.accessType] || props.accessType || 'No especificado';
});

const garageTypeText = computed(() => {
  return GarageTypeTranslations[props.garageType] || props.garageType || 'No especificado';
});

const distanceText = computed(() => {
  return DistanceToDwellingTranslations[props.distanceToDwelling] || props.distanceToDwelling || 'No especificado';
});

const dwellingTypeText = computed(() => {
  return DwellingTypeTranslations[props.dwellingType] || props.dwellingType || 'No especificado';
});

const residenceTypeText = computed(() => {
  return ResidenceTypeTranslations[props.residenceType] || props.residenceType || 'No especificado';
});

const materialText = computed(() => {
  return DwellingMaterialTranslations[props.dwellingMaterial] || props.dwellingMaterial || 'No especificado';
});

const conditionText = computed(() => {
  return DwellingConditionTranslations[props.dwellingCondition] || props.dwellingCondition || 'No especificado';
});

const zoneTypeText = computed(() => {
  return ZoneTypeTranslations[props.zoneType] || props.zoneType || 'No especificado';
});
</script>

<template>
  <pv-card v-if="visible" class="mb-4">
    <template #header>
      <div class="p-3 border-bottom-1 surface-border">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-comments text-2xl text-white"></i>
          <span class="text-xl font-semibold">Detalles de la Entrevista con el Cliente</span>
        </div>
      </div>
    </template>

    <template #content>
      <div class="grid">
      
        <!-- Sección: Vivienda -->
        <div class="col-12 md:col-6">
          <div class="data-card dwelling-info-card h-full flex flex-column" style="min-height: 400px;">
            <div class="flex align-items-center gap-2 mb-3 pb-2 border-bottom-1 surface-border">
              <i class="pi pi-building text-xl text-primary"></i>
              <span class="font-bold text-900">Características de la Vivienda</span>
            </div>
            <div class="flex flex-column gap-3">
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm text-600 font-medium">Vivienda es</span>
                <span class="text-sm text-900 font-bold">{{ residenceTypeText }}</span>
              </div>
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm text-600 font-medium">Tipo de vivienda</span>
                <span class="text-sm text-900 font-bold">{{ dwellingTypeText }}</span>
              </div>
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm text-600 font-medium">Cant. de pisos y piso en que vive</span>
                <span class="text-sm text-900 font-bold">{{ apartmentInformation || 'No especificado' }}</span>
              </div>
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm text-600 font-medium">La vivienda está</span>
                <span class="text-sm text-900 font-bold">{{ typeFurnishedText }}</span>
              </div>
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm text-600 font-medium">Techo de vivienda</span>
                <span class="text-sm text-900 font-bold">{{ roofTypeText }}</span>
              </div>
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm text-600 font-medium">Material</span>
                <span class="text-sm text-900 font-bold">{{ materialText }}</span>
              </div>
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm text-600 font-medium">Estado</span>
                <span class="text-sm text-900 font-bold">{{ conditionText }}</span>
              </div>
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm text-600 font-medium">Color de fachada</span>
                <span class="text-sm text-900 font-bold">{{ facadeColor || 'No especificado' }}</span>
              </div>
            </div>
          </div>
        </div>

          <!-- Sección: Residencia y Zona -->
        <div class="col-12 md:col-6">
          <div class="data-card residence-info-card h-full flex flex-column" style="min-height: 400px;">
            <div class="flex align-items-center gap-2 mb-3 pb-2 border-bottom-1 surface-border">
              <i class="pi pi-home text-xl text-primary"></i>
              <span class="font-bold text-900">Información de Residencia y Zona</span>
            </div>
            <div class="flex flex-column gap-3">
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm text-600 font-medium">Vive con</span>
                <span class="text-sm text-900 font-bold">{{ livesWith || 'No especificado' }}</span>
              </div>
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm text-600 font-medium">Reside</span>
                <span class="text-sm text-900 font-bold">{{ residentText }}</span>
              </div>
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm text-600 font-medium">Tiempo de residencia</span>
                <span class="text-sm text-900 font-bold">{{ timeLivingText || 'No especificado' }}</span>
              </div>
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm text-600 font-medium">Zona</span>
                <span class="text-sm text-900 font-bold">{{ zoneTypeText }}</span>
              </div>
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm text-600 font-medium">Característica de la zona</span>
                <span class="text-sm text-900 font-bold">{{ zoneCharacteristicsText }}</span>
              </div>
              <div class="flex justify-content-between align-items-center">
                <span class="text-sm text-600 font-medium">Acceso a la vivienda</span>
                <span class="text-sm text-900 font-bold">{{ accessTypeText }}</span>
              </div>
            </div>
          </div>
        </div>


      </div>

      <!-- Cajas destacadas -->
      <div class="grid mt-4">
        <div class="col-12 md:col-4">
          <div class="success-card text-center p-3">
            <div class="text-sm font-semibold text-600 mb-2 uppercase">Riesgo de la Zona</div>
            <div class="text-lg font-bold text-900">{{ areaRiskText }}</div>
          </div>
        </div>

        <div class="col-12 md:col-4">
          <div class="info-card text-center p-3">
            <div class="text-sm font-semibold text-600 mb-2 uppercase">La cochera es</div>
            <div class="text-lg font-bold text-900">{{ garageTypeText }}</div>
          </div>
        </div>

        <div class="col-12 md:col-4">
          <div class="warning-card text-center p-3">
            <div class="text-sm font-semibold text-600 mb-2 uppercase">Distancia Cochera</div>
            <div class="text-lg font-bold text-900">{{ distanceText }}</div>
          </div>
        </div>
      </div>
    </template>
</pv-card>
</template>

<style scoped>
/* Estilos personalizados para cards con bordes visibles */
.residence-info-card {
  border: 2px solid var(--primary-300);
  background: var(--primary-50);
}

.dwelling-info-card {
  border: 2px solid var(--green-300);
  background: var(--green-50);
}
</style>
