<template>
  <Dialog 
    v-model:visible="visible" 
    :header="title"
    :modal="true"
    :style="{ width: '700px' }"
    :breakpoints="{ '960px': '90vw' }"
    @update:visible="onVisibilityChange"
  >
    <div class="location-form">
      <div class="grid">
        <!-- Departamento -->
        <div class="col-12 md:col-4">
          <div class="field">
            <label for="department">Departamento *</label>
            <InputText 
              id="department"
              v-model="formData.department"
              placeholder="Ej: Lima"
              class="w-full"
              :class="{ 'p-invalid': errors.department }"
            />
            <small v-if="errors.department" class="p-error">{{ errors.department }}</small>
          </div>
        </div>

        <!-- Provincia -->
        <div class="col-12 md:col-4">
          <div class="field">
            <label for="province">Provincia *</label>
            <InputText 
              id="province"
              v-model="formData.province"
              placeholder="Ej: Lima"
              class="w-full"
              :class="{ 'p-invalid': errors.province }"
            />
            <small v-if="errors.province" class="p-error">{{ errors.province }}</small>
          </div>
        </div>

        <!-- Distrito -->
        <div class="col-12 md:col-4">
          <div class="field">
            <label for="district">Distrito *</label>
            <InputText 
              id="district"
              v-model="formData.district"
              placeholder="Ej: Miraflores"
              class="w-full"
              :class="{ 'p-invalid': errors.district }"
            />
            <small v-if="errors.district" class="p-error">{{ errors.district }}</small>
          </div>
        </div>

        <!-- Dirección -->
        <div class="col-12">
          <div class="field">
            <label for="home-address">Dirección completa *</label>
            <Textarea 
              id="home-address"
              v-model="formData.homeAddress"
              placeholder="Ej: Av. Larco 1234, Dpto 301"
              :rows="2"
              class="w-full"
              :class="{ 'p-invalid': errors.homeAddress }"
            />
            <small v-if="errors.homeAddress" class="p-error">{{ errors.homeAddress }}</small>
          </div>
        </div>

        <!-- Referencia -->
        <div class="col-12">
          <div class="field">
            <label for="reference">Referencia</label>
            <Textarea 
              id="reference"
              v-model="formData.reference"
              placeholder="Ej: A media cuadra del parque Kennedy"
              :rows="2"
              class="w-full"
            />
            <small class="text-color-secondary">Punto de referencia para facilitar la ubicación</small>
          </div>
        </div>

        <!-- Coordenadas GPS -->
        <div class="col-12">
          <Divider />
          <div class="flex align-items-center justify-content-between mb-3">
            <h4 class="m-0">Coordenadas GPS</h4>
            <Button 
              label="Obtener ubicación actual" 
              icon="pi pi-map-marker"
              size="small"
              severity="secondary"
              outlined
              @click="getCurrentLocation"
              :loading="loadingLocation"
            />
          </div>
        </div>

        <!-- Latitud -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="latitude">Latitud</label>
            <InputNumber 
              id="latitude"
              v-model="formData.latitude"
              placeholder="-12.0464"
              :min-fraction-digits="6"
              :max-fraction-digits="6"
              class="w-full"
            />
            <small class="text-color-secondary">Ejemplo: -12.046374</small>
          </div>
        </div>

        <!-- Longitud -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="longitude">Longitud</label>
            <InputNumber 
              id="longitude"
              v-model="formData.longitude"
              placeholder="-77.0428"
              :min-fraction-digits="6"
              :max-fraction-digits="6"
              class="w-full"
            />
            <small class="text-color-secondary">Ejemplo: -77.042793</small>
          </div>
        </div>

        <!-- Vista previa del mapa -->
        <div class="col-12" v-if="formData.latitude && formData.longitude">
          <div class="map-preview">
            <i class="pi pi-map text-4xl text-primary mb-2"></i>
            <p class="mb-2">Ubicación: {{ formData.latitude }}, {{ formData.longitude }}</p>
            <Button 
              label="Ver en Google Maps" 
              icon="pi pi-external-link"
              size="small"
              text
              @click="openInGoogleMaps"
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
import { ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import Divider from 'primevue/divider';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  location: {
    type: Object,
    default: null
  },
  title: {
    type: String,
    default: 'Ubicación'
  }
});

const emit = defineEmits(['update:visible', 'save']);
const toast = useToast();

const formData = ref({
  department: null,
  province: null,
  district: null,
  homeAddress: null,
  reference: null,
  mapLocation: null,
  latitude: null,
  longitude: null
});

const errors = ref({});
const saving = ref(false);
const loadingLocation = ref(false);

// Watch for location changes
watch(() => props.location, (newLocation) => {
  if (newLocation) {
    formData.value = { ...newLocation };
  } else {
    resetForm();
  }
}, { immediate: true });

function resetForm() {
  formData.value = {
    department: null,
    province: null,
    district: null,
    homeAddress: null,
    reference: null,
    mapLocation: null,
    latitude: null,
    longitude: null
  };
  errors.value = {};
}

function validate() {
  errors.value = {};

  if (!formData.value.department || formData.value.department.trim() === '') {
    errors.value.department = 'El departamento es requerido';
  }

  if (!formData.value.province || formData.value.province.trim() === '') {
    errors.value.province = 'La provincia es requerida';
  }

  if (!formData.value.district || formData.value.district.trim() === '') {
    errors.value.district = 'El distrito es requerido';
  }

  if (!formData.value.homeAddress || formData.value.homeAddress.trim() === '') {
    errors.value.homeAddress = 'La dirección es requerida';
  }

  return Object.keys(errors.value).length === 0;
}

async function getCurrentLocation() {
  if (!navigator.geolocation) {
    toast.add({
      severity: 'warn',
      summary: 'No disponible',
      detail: 'Tu navegador no soporta geolocalización',
      life: 3000
    });
    return;
  }

  loadingLocation.value = true;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      formData.value.latitude = position.coords.latitude;
      formData.value.longitude = position.coords.longitude;
      loadingLocation.value = false;
      toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Ubicación obtenida correctamente',
        life: 3000
      });
    },
    (error) => {
      loadingLocation.value = false;
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo obtener la ubicación',
        life: 3000
      });
    }
  );
}

function openInGoogleMaps() {
  if (formData.value.latitude && formData.value.longitude) {
    const url = `https://www.google.com/maps?q=${formData.value.latitude},${formData.value.longitude}`;
    window.open(url, '_blank');
  }
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
.location-form {
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

.map-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: var(--primary-50);
  border: 2px dashed var(--primary-200);
  border-radius: 8px;
  text-align: center;
}

.p-error {
  display: block;
  margin-top: 0.25rem;
  color: var(--red-500);
  font-size: 0.875rem;
}
</style>
