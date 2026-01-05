<template>
  <Dialog 
    v-model:visible="visible" 
    :header="title"
    :modal="true"
    :style="{ width: '700px' }"
    :breakpoints="{ '960px': '90vw' }"
    @update:visible="onVisibilityChange"
  >
    <div class="zone-form">
      <div class="grid">
        <!-- Tipo de Zona -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="zone-type">Tipo de Zona *</label>
            <Dropdown 
              id="zone-type"
              v-model="formData.zoneType"
              :options="zoneTypeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar"
              class="w-full"
              :class="{ 'p-invalid': errors.zoneType }"
            />
            <small v-if="errors.zoneType" class="p-error">{{ errors.zoneType }}</small>
          </div>
        </div>

        <!-- Tipo de Acceso -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="access-type">Tipo de Acceso *</label>
            <Dropdown 
              id="access-type"
              v-model="formData.accessType"
              :options="accessTypeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar"
              class="w-full"
              :class="{ 'p-invalid': errors.accessType }"
            />
            <small v-if="errors.accessType" class="p-error">{{ errors.accessType }}</small>
          </div>
        </div>

        <!-- Nivel de Riesgo -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="risk-level">Nivel de Riesgo *</label>
            <Dropdown 
              id="risk-level"
              v-model="formData.riskLevel"
              :options="riskLevelOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar"
              class="w-full"
              :class="{ 'p-invalid': errors.riskLevel }"
            />
            <small v-if="errors.riskLevel" class="p-error">{{ errors.riskLevel }}</small>
          </div>
        </div>

        <!-- Transporte Público -->
        <div class="col-12 md:col-6">
          <div class="field">
            <div class="flex align-items-center gap-2 mt-4">
              <Checkbox 
                v-model="formData.hasPublicTransport" 
                :binary="true"
                inputId="has-transport"
              />
              <label for="has-transport" class="mb-0">Tiene transporte público disponible</label>
            </div>
          </div>
        </div>

        <!-- Características de la Zona -->
        <div class="col-12">
          <Divider />
          <h4>Características de la Zona</h4>
        </div>

        <div class="col-12">
          <div class="field">
            <label>Selecciona las características que aplican</label>
            <div class="characteristics-grid">
              <div v-for="char in characteristicOptions" :key="char.value" class="characteristic-item">
                <Checkbox 
                  v-model="formData.zoneCharacteristics"
                  :inputId="`char-${char.value}`"
                  :value="char.value"
                />
                <label :for="`char-${char.value}`" class="ml-2 mb-0">{{ char.label }}</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Servicios Cercanos -->
        <div class="col-12">
          <Divider />
          <h4>Servicios Cercanos</h4>
        </div>

        <div class="col-12">
          <div class="field">
            <label>Selecciona los servicios disponibles cerca</label>
            <div class="services-grid">
              <div v-for="service in serviceOptions" :key="service.value" class="service-item">
                <Checkbox 
                  v-model="formData.nearbyServices"
                  :inputId="`service-${service.value}`"
                  :value="service.value"
                />
                <label :for="`service-${service.value}`" class="ml-2 mb-0">{{ service.label }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="Cancelar" severity="secondary" @click="onCancel" />
      <Button label="Guardar" :loading="saving" @click="onSave" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import Divider from 'primevue/divider';
import {
  ZoneType,
  ZoneCharacteristic,
  AccessType,
  RiskLevel,
  NearbyService,
  ZoneTranslations
} from '../../domain/constants/zone.constants.js';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  zone: {
    type: Object,
    default: null
  },
  title: {
    type: String,
    default: 'Información de la Zona'
  }
});

const emit = defineEmits(['update:visible', 'save']);

const formData = ref({
  zoneType: null,
  zoneCharacteristics: [],
  accessType: null,
  riskLevel: null,
  hasPublicTransport: false,
  nearbyServices: []
});

const errors = ref({});
const saving = ref(false);

// Options
const zoneTypeOptions = Object.keys(ZoneType).map(key => ({
  label: ZoneTranslations[ZoneType[key]],
  value: ZoneType[key]
}));

const accessTypeOptions = Object.keys(AccessType).map(key => ({
  label: ZoneTranslations[AccessType[key]],
  value: AccessType[key]
}));

const riskLevelOptions = Object.keys(RiskLevel).map(key => ({
  label: ZoneTranslations[RiskLevel[key]],
  value: RiskLevel[key]
}));

const characteristicOptions = Object.keys(ZoneCharacteristic).map(key => ({
  label: ZoneTranslations[ZoneCharacteristic[key]],
  value: ZoneCharacteristic[key]
}));

const serviceOptions = Object.keys(NearbyService).map(key => ({
  label: ZoneTranslations[NearbyService[key]],
  value: NearbyService[key]
}));

// Watch for zone changes
watch(() => props.zone, (newZone) => {
  if (newZone) {
    formData.value = {
      zoneType: newZone.zoneType,
      zoneCharacteristics: [...(newZone.zoneCharacteristics || [])],
      accessType: newZone.accessType,
      riskLevel: newZone.riskLevel,
      hasPublicTransport: newZone.hasPublicTransport,
      nearbyServices: [...(newZone.nearbyServices || [])]
    };
  } else {
    resetForm();
  }
}, { immediate: true });

function resetForm() {
  formData.value = {
    zoneType: null,
    zoneCharacteristics: [],
    accessType: null,
    riskLevel: null,
    hasPublicTransport: false,
    nearbyServices: []
  };
  errors.value = {};
}

function validate() {
  errors.value = {};

  if (!formData.value.zoneType) {
    errors.value.zoneType = 'El tipo de zona es requerido';
  }

  if (!formData.value.accessType) {
    errors.value.accessType = 'El tipo de acceso es requerido';
  }

  if (!formData.value.riskLevel) {
    errors.value.riskLevel = 'El nivel de riesgo es requerido';
  }

  return Object.keys(errors.value).length === 0;
}

async function onSave() {
  if (!validate()) {
    return;
  }

  saving.value = true;
  try {
    await emit('save', formData.value);
    onVisibilityChange(false);
  } finally {
    saving.value = false;
  }
}

function onCancel() {
  onVisibilityChange(false);
}

function onVisibilityChange(value) {
  emit('update:visible', value);
  if (!value) {
    resetForm();
  }
}
</script>

<style scoped>
.zone-form {
  padding: 1rem 0;
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.characteristics-grid,
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: var(--surface-50);
  border-radius: 8px;
}

.characteristic-item,
.service-item {
  display: flex;
  align-items: center;
}

.p-error {
  display: block;
  margin-top: 0.25rem;
  color: var(--red-500);
  font-size: 0.875rem;
}
</style>
