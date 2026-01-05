<template>
  <Card class="dwelling-info-card">
    <template #title>
      <div class="flex align-items-center justify-content-between">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-home text-2xl"></i>
          <span>Información de la Vivienda</span>
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
      <div v-if="dwelling" class="dwelling-content">
        <div class="grid">
          <!-- Tipo de Vivienda -->
          <div class="col-12 md:col-6">
            <div class="field-info">
              <label class="field-label">Tipo de Vivienda</label>
              <div class="field-value">
                <Tag :value="getDwellingTypeLabel(dwelling.dwellingType)" severity="info" />
              </div>
            </div>
          </div>

          <!-- Número de Pisos -->
          <div class="col-12 md:col-6">
            <div class="field-info">
              <label class="field-label">Número de Pisos</label>
              <div class="field-value">{{ dwelling.numberFloors || 'No especificado' }}</div>
            </div>
          </div>

          <!-- Piso Ocupado -->
          <div class="col-12 md:col-6" v-if="dwelling.floorOccupied">
            <div class="field-info">
              <label class="field-label">Piso Ocupado</label>
              <div class="field-value">{{ dwelling.floorOccupied }}</div>
            </div>
          </div>

          <!-- Material -->
          <div class="col-12 md:col-6">
            <div class="field-info">
              <label class="field-label">Material</label>
              <div class="field-value">{{ getDwellingMaterialLabel(dwelling.dwellingMaterial) }}</div>
            </div>
          </div>

          <!-- Condición -->
          <div class="col-12 md:col-6">
            <div class="field-info">
              <label class="field-label">Condición</label>
              <div class="field-value">
                <Tag :value="getDwellingConditionLabel(dwelling.dwellingCondition)" 
                     :severity="getConditionSeverity(dwelling.dwellingCondition)" />
              </div>
            </div>
          </div>

          <!-- Tipo de Techo -->
          <div class="col-12 md:col-6">
            <div class="field-info">
              <label class="field-label">Tipo de Techo</label>
              <div class="field-value">{{ getRoofTypeLabel(dwelling.roofType) }}</div>
            </div>
          </div>

          <!-- Amoblado -->
          <div class="col-12 md:col-6">
            <div class="field-info">
              <label class="field-label">Amoblado</label>
              <div class="field-value">{{ getTypeFurnishedLabel(dwelling.typeFurnished) }}</div>
            </div>
          </div>

          <!-- Color de Fachada -->
          <div class="col-12 md:col-6" v-if="dwelling.facadeColor">
            <div class="field-info">
              <label class="field-label">Color de Fachada</label>
              <div class="field-value">{{ dwelling.facadeColor }}</div>
            </div>
          </div>

          <!-- Garaje -->
          <div class="col-12">
            <Divider />
            <h4 class="mt-2 mb-3">Estacionamiento</h4>
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="field-info">
                  <label class="field-label">Tiene Garaje</label>
                  <div class="field-value">
                    <Tag :value="dwelling.hasGarage ? 'Sí' : 'No'" 
                         :severity="dwelling.hasGarage ? 'success' : 'secondary'" />
                  </div>
                </div>
              </div>

              <div class="col-12 md:col-6" v-if="dwelling.hasGarage">
                <div class="field-info">
                  <label class="field-label">Tipo de Garaje</label>
                  <div class="field-value">{{ getGarageTypeLabel(dwelling.garageType) }}</div>
                </div>
              </div>

              <div class="col-12 md:col-6" v-if="dwelling.hasGarage && dwelling.garageDistance">
                <div class="field-info">
                  <label class="field-label">Distancia</label>
                  <div class="field-value">{{ dwelling.garageDistance }} metros</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-data-message">
        <i class="pi pi-info-circle mr-2"></i>
        <span>No hay información de vivienda registrada</span>
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
  DwellingTranslations,
  DwellingType,
  DwellingMaterial,
  DwellingCondition,
  TypeFurnished,
  RoofType,
  GarageType
} from '../../domain/constants/dwelling.constants.js';

const props = defineProps({
  dwelling: {
    type: Object,
    default: null
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

defineEmits(['edit']);

const getDwellingTypeLabel = (type) => DwellingTranslations[type] || type || 'No especificado';
const getDwellingMaterialLabel = (material) => DwellingTranslations[material] || material || 'No especificado';
const getDwellingConditionLabel = (condition) => DwellingTranslations[condition] || condition || 'No especificado';
const getTypeFurnishedLabel = (type) => DwellingTranslations[type] || type || 'No especificado';
const getRoofTypeLabel = (type) => DwellingTranslations[type] || type || 'No especificado';
const getGarageTypeLabel = (type) => DwellingTranslations[type] || type || 'No especificado';

const getConditionSeverity = (condition) => {
  switch (condition) {
    case DwellingCondition.EXCELENTE: return 'success';
    case DwellingCondition.BUENO: return 'info';
    case DwellingCondition.REGULAR: return 'warning';
    case DwellingCondition.MALO: return 'danger';
    case DwellingCondition.MUY_MALO: return 'danger';
    default: return 'secondary';
  }
};
</script>

<style scoped>
.dwelling-info-card {
  margin-bottom: 1.5rem;
}

.dwelling-content {
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

.no-data-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-color-secondary);
  font-style: italic;
}
</style>
