<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useOrderRequestStore } from '../../application/order-request.store.js';
import { useToast } from 'primevue/usetoast';
import FileUploader from '../../../shared/components/file-uploader.component.vue';

// Store & Toast
const store = useOrderRequestStore();
const toast = useToast();

// Emits
const emit = defineEmits(['next', 'back']);

// Estado local
const touched = ref({
  department: false,
  province: false,
  district: false,
  homeAddress: false,
  mapLocation: false,
  facadePhoto: false
});

const showValidation = ref(false);
let addressToastTimeout = null;

// Validaciones
const fieldErrors = computed(() => {
  const errors = {};
  
  if (touched.value.department || showValidation.value) {
    if (!store.client.department || store.client.department.trim().length < 2) {
      errors.department = 'Ingresa un departamento';
    }
  }
  
  if (touched.value.province || showValidation.value) {
    if (!store.client.province || store.client.province.trim().length < 2) {
      errors.province = 'Ingresa una provincia';
    }
  }
  
  if (touched.value.district || showValidation.value) {
    if (!store.client.district || store.client.district.trim().length < 2) {
      errors.district = 'Ingresa un distrito';
    }
  }
  
  if (touched.value.homeAddress || showValidation.value) {
    if (!store.client.homeAddress || store.client.homeAddress.trim().length < 5) {
      errors.homeAddress = 'Ingresa una dirección válida';
    } else if (store.client.homeAddress.length > 300) {
      errors.homeAddress = `Dirección muy larga (${store.client.homeAddress.length}/300 caracteres)`;
    }
  }
  
  if (touched.value.mapLocation || showValidation.value) {
    if (!store.client.mapLocation || store.client.mapLocation.trim().length < 5) {
      errors.mapLocation = 'Pega la URL de Google Maps';
    } else {
      try {
        const urlObj = new URL(store.client.mapLocation);
        const validHost = urlObj.hostname.endsWith('google.com') || urlObj.hostname.endsWith('goo.gl') || urlObj.hostname.endsWith('maps.app.goo.gl');
        if (!/^https?:$/.test(urlObj.protocol) || !validHost) {
          errors.mapLocation = 'Ingresa una URL válida de Google Maps';
        }
      } catch (e) {
        errors.mapLocation = 'Ingresa una URL válida de Google Maps';
      }
    }
  }
  
  if (touched.value.facadePhoto || showValidation.value) {
    const facadePhoto = store.client.documents.find(doc => doc.type === 'FOTO_FACHADA_VIVIENDA');
    if (!facadePhoto) {
      errors.facadePhoto = 'La fotografía de la fachada es obligatoria';
    }
  }
  
  return errors;
});

const isFormValid = computed(() => {
  const facadePhoto = store.client.documents.find(doc => doc.type === 'FOTO_FACHADA_VIVIENDA');
  const basicOk =
    store.client.department &&
    store.client.province &&
    store.client.district &&
    store.client.homeAddress &&
    store.client.mapLocation &&
    facadePhoto;
  
  return Boolean(basicOk && Object.keys(fieldErrors.value).length === 0);
});

// Watchers
watch(() => store.client.homeAddress, (newValue) => {
  if (newValue && newValue.length > 300) {
    clearTimeout(addressToastTimeout);
    addressToastTimeout = setTimeout(() => {
      toast.add({
        severity: 'warn',
        summary: 'Dirección muy larga',
        detail: `La dirección tiene ${newValue.length} caracteres. El máximo permitido es 300 caracteres.`,
        life: 5000
      });
    }, 1000);
  }
});

// Métodos
const onFieldBlur = (fieldName) => {
  touched.value[fieldName] = true;
};

const validateTextOnly = (event) => {
  if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(event.key) || ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    return;
  }
  event.preventDefault();
};

const onFileSelected = (file) => {
  const existingIndex = store.client.documents.findIndex(doc => doc.type === 'FOTO_FACHADA_VIVIENDA');
  const facadeDocument = {
    type: 'FOTO_FACHADA_VIVIENDA',
    file: file,
    url: null
  };
  
  if (existingIndex >= 0) {
    store.client.documents[existingIndex] = facadeDocument;
  } else {
    store.client.documents.push(facadeDocument);
  }
  
  touched.value.facadePhoto = true;
};

const onFileRemoved = () => {
  const existingIndex = store.client.documents.findIndex(doc => doc.type === 'FOTO_FACHADA_VIVIENDA');
  if (existingIndex >= 0) {
    store.client.documents.splice(existingIndex, 1);
  }
  touched.value.facadePhoto = true;
};

const handleFileValidationError = (errors) => {
  errors.forEach(error => {
    toast.add({ severity: 'warn', summary: 'Error de archivo', detail: error.message, life: 3000 });
  });
};

const onNext = () => {
  showValidation.value = true;
  if (!isFormValid.value) {
    return;
  }
  emit('next');
};

const onBack = () => {
  emit('back');
};

// Lifecycle
onMounted(() => {
  // Limpiar tipos de documento antiguos
  const oldTypes = ['FACADE_PHOTO', 'SERVICE_RECEIPT', 'IDENTITY_DOCUMENT'];
  store.client.documents = store.client.documents.filter(doc => !oldTypes.includes(doc.type));
});

onBeforeUnmount(() => {
  if (addressToastTimeout) {
    clearTimeout(addressToastTimeout);
  }
});
</script>

<template>
  <div class="flex justify-content-center w-full">
    <div class="surface-card border-round-lg shadow-3 p-4 w-full" style="max-width: 1200px;">
      <form class="formgrid grid p-fluid" @submit.prevent="onNext" @keydown.enter.prevent>
        <!-- Título -->
        <div class="col-12 mb-3">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-home text-2xl text-primary"></i>
            <h2 class="m-0 text-xl font-semibold text-primary">Datos de domicilio</h2>
          </div>
        </div>

        <!-- Departamento -->
        <div class="field col-12 md:col-4">
          <label for="departamento" class="block mb-2 font-semibold text-color">
            Departamento <span class="text-red-500">*</span>
          </label>
          <pv-input-text
            id="departamento"
            v-model="store.client.department"
            placeholder="Lima"
            class="w-full"
            @blur="onFieldBlur('department')"
            @keydown="validateTextOnly"
          />
          <small v-if="fieldErrors.department" class="text-red-500 block mt-1">{{ fieldErrors.department }}</small>
        </div>

        <!-- Provincia -->
        <div class="field col-12 md:col-4">
          <label for="provincia" class="block mb-2 font-semibold text-color">
            Provincia <span class="text-red-500">*</span>
          </label>
          <pv-input-text
            id="provincia"
            v-model="store.client.province"
            placeholder="Lima"
            class="w-full"
            @blur="onFieldBlur('province')"
            @keydown="validateTextOnly"
          />
          <small v-if="fieldErrors.province" class="text-red-500 block mt-1">{{ fieldErrors.province }}</small>
        </div>

        <!-- Distrito -->
        <div class="field col-12 md:col-4">
          <label for="distrito" class="block mb-2 font-semibold text-color">
            Distrito <span class="text-red-500">*</span>
          </label>
          <pv-input-text
            id="distrito"
            v-model="store.client.district"
            placeholder="Miraflores"
            class="w-full"
            @blur="onFieldBlur('district')"
            @keydown="validateTextOnly"
          />
          <small v-if="fieldErrors.district" class="text-red-500 block mt-1">{{ fieldErrors.district }}</small>
        </div>

        <!-- Dirección completa -->
        <div class="field col-12">
          <label for="direccion" class="block mb-2 font-semibold text-color">
            Dirección completa <span class="text-red-500">*</span>
          </label>
          <pv-textarea
            id="direccion"
            v-model="store.client.homeAddress"
            placeholder="Av. Principal 123, Dpto. 4B"
            rows="3"
            class="w-full"
            @blur="onFieldBlur('homeAddress')"
          />
          <small v-if="fieldErrors.homeAddress" class="text-red-500 block mt-1">{{ fieldErrors.homeAddress }}</small>
          <small v-else class="text-color-secondary block mt-1">{{ store.client.homeAddress?.length || 0 }}/300 caracteres</small>
        </div>

        <!-- URL Google Maps -->
        <div class="field col-12">
          <label for="maps" class="block mb-2 font-semibold text-color">
            Ubicación por Google Maps <span class="text-red-500">*</span>
          </label>
          <pv-icon-field>
            <pv-input-icon class="pi pi-map-marker" />
            <pv-input-text
              id="maps"
              v-model="store.client.mapLocation"
              placeholder="https://maps.google.com/..."
              class="w-full"
              @blur="onFieldBlur('mapLocation')"
            />
          </pv-icon-field>
          <small v-if="fieldErrors.mapLocation" class="text-red-500 block mt-1">{{ fieldErrors.mapLocation }}</small>
        </div>

        <!-- Foto fachada -->
        <div class="field col-12">
          <label class="block mb-2 font-semibold text-color">
            Foto de fachada de la vivienda <span class="text-red-500">*</span>
          </label>
          <file-uploader
            id="image-uploader-fachada"
            accept="image/*"
            :max-size-mb="5"
            @file-selected="onFileSelected"
            @file-removed="onFileRemoved"
            @validation-error="handleFileValidationError"
          />
          <small v-if="fieldErrors.facadePhoto" class="text-red-500 block mt-1">{{ fieldErrors.facadePhoto }}</small>
        </div>

        <!-- Botones -->
        <div class="col-12 flex justify-content-between gap-2 mt-4">
          <pv-button
            label="Regresar"
            icon="pi pi-arrow-left"
            severity="secondary"
            outlined
            @click="onBack"
            class="px-5"
          />
          <pv-button
            label="Siguiente"
            icon="pi pi-arrow-right"
            iconPos="right"
            type="submit"
            :disabled="!isFormValid"
            class="px-5"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.formgrid {
  row-gap: 1rem;
}

.field {
  margin-bottom: 0;
}
</style>
