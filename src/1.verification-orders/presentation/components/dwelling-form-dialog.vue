<template>
  <Dialog 
    v-model:visible="visible" 
    :header="title"
    :modal="true"
    :style="{ width: '700px' }"
    :breakpoints="{ '960px': '90vw' }"
    @update:visible="onVisibilityChange"
  >
    <div class="dwelling-form">
      <div class="grid">
        <!-- Tipo de Vivienda -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="dwelling-type">Tipo de Vivienda *</label>
            <Dropdown 
              id="dwelling-type"
              v-model="formData.dwellingType"
              :options="dwellingTypeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar"
              class="w-full"
              :class="{ 'p-invalid': errors.dwellingType }"
            />
            <small v-if="errors.dwellingType" class="p-error">{{ errors.dwellingType }}</small>
          </div>
        </div>

        <!-- Número de Pisos -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="number-floors">Número de Pisos *</label>
            <InputNumber 
              id="number-floors"
              v-model="formData.numberFloors"
              :min="1"
              :max="50"
              placeholder="Ej: 2"
              class="w-full"
              :class="{ 'p-invalid': errors.numberFloors }"
            />
            <small v-if="errors.numberFloors" class="p-error">{{ errors.numberFloors }}</small>
          </div>
        </div>

        <!-- Piso Ocupado -->
        <div class="col-12 md:col-6" v-if="formData.numberFloors > 1">
          <div class="field">
            <label for="floor-occupied">Piso Ocupado</label>
            <InputNumber 
              id="floor-occupied"
              v-model="formData.floorOccupied"
              :min="1"
              :max="formData.numberFloors"
              placeholder="Ej: 1"
              class="w-full"
            />
          </div>
        </div>

        <!-- Color de Fachada -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="facade-color">Color de Fachada</label>
            <InputText 
              id="facade-color"
              v-model="formData.facadeColor"
              placeholder="Ej: Blanco"
              class="w-full"
            />
          </div>
        </div>

        <!-- Material -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="dwelling-material">Material *</label>
            <Dropdown 
              id="dwelling-material"
              v-model="formData.dwellingMaterial"
              :options="materialOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar"
              class="w-full"
              :class="{ 'p-invalid': errors.dwellingMaterial }"
            />
            <small v-if="errors.dwellingMaterial" class="p-error">{{ errors.dwellingMaterial }}</small>
          </div>
        </div>

        <!-- Condición -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="dwelling-condition">Condición *</label>
            <Dropdown 
              id="dwelling-condition"
              v-model="formData.dwellingCondition"
              :options="conditionOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar"
              class="w-full"
              :class="{ 'p-invalid': errors.dwellingCondition }"
            />
            <small v-if="errors.dwellingCondition" class="p-error">{{ errors.dwellingCondition }}</small>
          </div>
        </div>

        <!-- Tipo de Techo -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="roof-type">Tipo de Techo</label>
            <Dropdown 
              id="roof-type"
              v-model="formData.roofType"
              :options="roofTypeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar"
              class="w-full"
            />
          </div>
        </div>

        <!-- Amoblado -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="type-furnished">Amoblado</label>
            <Dropdown 
              id="type-furnished"
              v-model="formData.typeFurnished"
              :options="furnishedOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar"
              class="w-full"
            />
          </div>
        </div>

        <!-- Divider -->
        <div class="col-12">
          <Divider />
          <h4>Estacionamiento</h4>
        </div>

        <!-- Tiene Garaje -->
        <div class="col-12">
          <div class="field">
            <div class="flex align-items-center gap-2">
              <Checkbox 
                v-model="formData.hasGarage" 
                :binary="true"
                inputId="has-garage"
              />
              <label for="has-garage" class="mb-0">Tiene garaje/estacionamiento</label>
            </div>
          </div>
        </div>

        <!-- Tipo de Garaje -->
        <div class="col-12 md:col-6" v-if="formData.hasGarage">
          <div class="field">
            <label for="garage-type">Tipo de Garaje</label>
            <Dropdown 
              id="garage-type"
              v-model="formData.garageType"
              :options="garageTypeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar"
              class="w-full"
            />
          </div>
        </div>

        <!-- Distancia del Garaje -->
        <div class="col-12 md:col-6" v-if="formData.hasGarage">
          <div class="field">
            <label for="garage-distance">Distancia (metros)</label>
            <InputNumber 
              id="garage-distance"
              v-model="formData.garageDistance"
              :min="0"
              :max="1000"
              placeholder="Ej: 50"
              class="w-full"
              suffix=" m"
            />
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
import { ref, computed, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import Divider from 'primevue/divider';
import {
  DwellingType,
  DwellingMaterial,
  DwellingCondition,
  TypeFurnished,
  RoofType,
  GarageType,
  DwellingTranslations
} from '../../domain/constants/dwelling.constants.js';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  dwelling: {
    type: Object,
    default: null
  },
  title: {
    type: String,
    default: 'Información de Vivienda'
  }
});

const emit = defineEmits(['update:visible', 'save']);

const formData = ref({
  dwellingType: null,
  numberFloors: 1,
  floorOccupied: null,
  facadeColor: null,
  dwellingMaterial: null,
  dwellingCondition: null,
  typeFurnished: null,
  roofType: null,
  hasGarage: false,
  garageType: null,
  garageDistance: null
});

const errors = ref({});
const saving = ref(false);

// Options
const dwellingTypeOptions = Object.keys(DwellingType).map(key => ({
  label: DwellingTranslations[DwellingType[key]],
  value: DwellingType[key]
}));

const materialOptions = Object.keys(DwellingMaterial).map(key => ({
  label: DwellingTranslations[DwellingMaterial[key]],
  value: DwellingMaterial[key]
}));

const conditionOptions = Object.keys(DwellingCondition).map(key => ({
  label: DwellingTranslations[DwellingCondition[key]],
  value: DwellingCondition[key]
}));

const furnishedOptions = Object.keys(TypeFurnished).map(key => ({
  label: DwellingTranslations[TypeFurnished[key]],
  value: TypeFurnished[key]
}));

const roofTypeOptions = Object.keys(RoofType).map(key => ({
  label: DwellingTranslations[RoofType[key]],
  value: RoofType[key]
}));

const garageTypeOptions = Object.keys(GarageType).map(key => ({
  label: DwellingTranslations[GarageType[key]],
  value: GarageType[key]
}));

// Watch for dwelling changes
watch(() => props.dwelling, (newDwelling) => {
  if (newDwelling) {
    formData.value = { ...newDwelling };
  } else {
    resetForm();
  }
}, { immediate: true });

function resetForm() {
  formData.value = {
    dwellingType: null,
    numberFloors: 1,
    floorOccupied: null,
    facadeColor: null,
    dwellingMaterial: null,
    dwellingCondition: null,
    typeFurnished: null,
    roofType: null,
    hasGarage: false,
    garageType: null,
    garageDistance: null
  };
  errors.value = {};
}

function validate() {
  errors.value = {};

  if (!formData.value.dwellingType) {
    errors.value.dwellingType = 'El tipo de vivienda es requerido';
  }

  if (!formData.value.numberFloors || formData.value.numberFloors < 1) {
    errors.value.numberFloors = 'El número de pisos es requerido';
  }

  if (!formData.value.dwellingMaterial) {
    errors.value.dwellingMaterial = 'El material es requerido';
  }

  if (!formData.value.dwellingCondition) {
    errors.value.dwellingCondition = 'La condición es requerida';
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
.dwelling-form {
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

.p-error {
  display: block;
  margin-top: 0.25rem;
  color: var(--red-500);
  font-size: 0.875rem;
}
</style>
