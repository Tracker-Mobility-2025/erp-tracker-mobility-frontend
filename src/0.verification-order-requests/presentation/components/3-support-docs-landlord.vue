<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useOrderRequestStore } from '../../application/order-request.store.js';
import { useToast } from 'primevue/usetoast';
import FileUploader from '../../../shared/components/file-uploader.component.vue';

// Store & Toast
const store = useOrderRequestStore();
const toast = useToast();

// Emits
const emit = defineEmits(['next', 'back', 'cancel', 'complete']);

// Estado local
const touched = ref({
  reciboServicio: false,
  documentoIdentidad: false,
  nombres: false,
  numeroContacto: false
});

const showValidation = ref(false);
const showCancelDialog = ref(false);
const showSubmitDialog = ref(false);

// Computed properties para archivos
const serviceReceiptFile = computed({
  get() {
    const doc = store.client.documents.find(d => d.type === 'RECIBO_SERVICIO');
    return doc?.file || null;
  },
  set(file) {
    const existingIndex = store.client.documents.findIndex(d => d.type === 'RECIBO_SERVICIO');
    if (file) {
      const document = { type: 'RECIBO_SERVICIO', file: file, url: null };
      if (existingIndex >= 0) {
        store.client.documents[existingIndex] = document;
      } else {
        store.client.documents.push(document);
      }
    } else if (existingIndex >= 0) {
      store.client.documents.splice(existingIndex, 1);
    }
  }
});

const identityDocFile = computed({
  get() {
    const doc = store.client.documents.find(d => d.type === 'DOCUMENTO_IDENTIDAD');
    return doc?.file || null;
  },
  set(file) {
    const existingIndex = store.client.documents.findIndex(d => d.type === 'DOCUMENTO_IDENTIDAD');
    if (file) {
      const document = { type: 'DOCUMENTO_IDENTIDAD', file: file, url: null };
      if (existingIndex >= 0) {
        store.client.documents[existingIndex] = document;
      } else {
        store.client.documents.push(document);
      }
    } else if (existingIndex >= 0) {
      store.client.documents.splice(existingIndex, 1);
    }
  }
});

// Validaciones
const isLandlordPhoneValid = computed(() => {
  const phone = store.client.landlordPhoneNumber;
  if (!phone) return false;
  const compact = String(phone).replace(/[\s-]/g, '');
  return /^9\d{8}$/.test(compact);
});

const fieldErrors = computed(() => {
  const errors = {};
  
  // Documentación de respaldo (siempre obligatoria)
  if (touched.value.reciboServicio || showValidation.value) {
    const reciboDoc = store.client.documents.find(d => d.type === 'RECIBO_SERVICIO');
    if (!reciboDoc) {
      errors.reciboServicio = 'El archivo es obligatorio';
    }
  }
  
  if (touched.value.documentoIdentidad || showValidation.value) {
    const identityDoc = store.client.documents.find(d => d.type === 'DOCUMENTO_IDENTIDAD');
    if (!identityDoc) {
      errors.documentoIdentidad = 'El archivo es obligatorio';
    }
  }
  
  // Datos del arrendador (SOLO si es inquilino)
  if (store.client.isTenant) {
    if (touched.value.nombres || showValidation.value) {
      if (!store.client.landlordName || store.client.landlordName.trim().length < 2) {
        errors.nombres = 'Ingresa nombres válidos';
      }
    }
    
    if (touched.value.numeroContacto || showValidation.value) {
      if (!store.client.landlordPhoneNumber) {
        errors.numeroContacto = 'El número de contacto es obligatorio';
      } else if (!isLandlordPhoneValid.value) {
        errors.numeroContacto = 'Debe iniciar con 9 y tener 9 dígitos';
      }
    }
  }
  
  return errors;
});

const isFormValid = computed(() => {
  const reciboDoc = store.client.documents.find(d => d.type === 'RECIBO_SERVICIO');
  const identityDoc = store.client.documents.find(d => d.type === 'DOCUMENTO_IDENTIDAD');
  const docsOk = reciboDoc && identityDoc;
  
  // Si NO es inquilino, no exigimos arrendador
  const landlordOk = !store.client.isTenant ||
    (store.client.landlordName && store.client.landlordPhoneNumber && isLandlordPhoneValid.value);
  
  return Boolean(docsOk && landlordOk && Object.keys(fieldErrors.value).length === 0);
});

// Watchers
watch(() => store.client.isTenant, (val) => {
  if (!val) {
    store.client.landlordName = '';
    store.client.landlordPhoneNumber = '';
    touched.value.nombres = false;
    touched.value.numeroContacto = false;
  }
});

// Métodos
const onFieldBlur = (field) => {
  touched.value[field] = true;
};

const validateTextOnly = (event) => {
  if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(event.key) || ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    return;
  }
  event.preventDefault();
};

const onReciboSelected = (file) => {
  serviceReceiptFile.value = file;
  touched.value.reciboServicio = true;
};

const onReciboRemoved = () => {
  serviceReceiptFile.value = null;
  touched.value.reciboServicio = true;
};

const onReciboValidationError = (errors) => {
  errors.forEach(error => {
    toast.add({ severity: 'warn', summary: 'Error de archivo', detail: error.message, life: 3000 });
  });
};

const onIdentidadSelected = (file) => {
  identityDocFile.value = file;
  touched.value.documentoIdentidad = true;
};

const onIdentidadRemoved = () => {
  identityDocFile.value = null;
  touched.value.documentoIdentidad = true;
};

const onIdentidadValidationError = (errors) => {
  errors.forEach(error => {
    toast.add({ severity: 'warn', summary: 'Error de archivo', detail: error.message, life: 3000 });
  });
};

const onCancel = () => {
  showCancelDialog.value = true;
};

const confirmCancel = () => {
  showCancelDialog.value = false;
  emit('cancel');
};

const cancelCancel = () => {
  showCancelDialog.value = false;
};

const onBack = () => {
  emit('back');
};

const onSubmit = () => {
  showValidation.value = true;
  
  if (!isFormValid.value) {
    return;
  }
  
  showSubmitDialog.value = true;
};

const confirmSubmit = async () => {
  showSubmitDialog.value = false;
  
  try {
    await store.createOrder();
    
    if (store.orderResponse) {
      toast.add({
        severity: 'success',
        summary: 'Solicitud Creada',
        detail: `Solicitud creada exitosamente. Código: ${store.orderResponse.orderCode}`,
        life: 5000
      });
      
      emit('complete', store.orderResponse);
    }
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Ocurrió un error al crear la solicitud',
      life: 5000
    });
  }
};

const cancelSubmit = () => {
  showSubmitDialog.value = false;
};

// Lifecycle
onMounted(() => {
  // Limpiar tipos de documento antiguos
  const oldTypes = ['FACADE_PHOTO', 'SERVICE_RECEIPT', 'IDENTITY_DOCUMENT', 'DNI', 'CARNET_EXTRANJERIA', 'PTP', 'RECIBO_AGUA', 'RECIBO_LUZ'];
  store.client.documents = store.client.documents.filter(doc => !oldTypes.includes(doc.type));
});
</script>

<template>
  <div class="flex justify-content-center w-full">
    <div class="surface-card border-round-lg shadow-3 p-4 w-full" style="max-width: 1200px;">
      <form class="formgrid grid p-fluid" @submit.prevent="onSubmit" @keydown.enter.prevent>
        
        <!-- Título: Documentación de respaldo -->
        <div class="col-12 mb-3">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-folder text-2xl text-primary"></i>
            <h2 class="m-0 text-xl font-semibold text-primary">Documentación de respaldo</h2>
          </div>
        </div>

        <!-- Recibo de servicio -->
        <div class="field col-12 md:col-6">
          <file-uploader
            v-model="serviceReceiptFile"
            input-id="file-uploader-recibo"
            file-type="any"
            label="Copia de recibo de servicio (Luz o Agua)"
            placeholder="Haz clic para subir recibo"
            hint="Imagen, PDF, DOC o DOCX (máximo 10MB)"
            drag-text=" o arrastra aquí"
            :max-file-size="10 * 1024 * 1024"
            :accepted-formats="[
              'image/jpeg', 'image/png', 'image/webp', 'image/gif',
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]"
            :error-messages="{
              fileTooBig: 'El archivo es muy grande. Máximo {maxSize}',
              invalidFormat: 'Solo se permiten: {formats}'
            }"
            required
            @file-selected="onReciboSelected"
            @file-removed="onReciboRemoved"
            @validation-error="onReciboValidationError"
          />
          <small v-if="fieldErrors.reciboServicio" class="text-red-500 block mt-1">{{ fieldErrors.reciboServicio }}</small>
        </div>

        <!-- Documento de identidad -->
        <div class="field col-12 md:col-6">
          <file-uploader
            v-model="identityDocFile"
            input-id="file-uploader-identidad"
            file-type="any"
            label="Copia de documento de identidad"
            placeholder="Haz clic para subir documento"
            hint="Imagen, PDF, DOC o DOCX (máximo 10MB)"
            drag-text=" o arrastra aquí"
            :max-file-size="10 * 1024 * 1024"
            :accepted-formats="[
              'image/jpeg', 'image/png', 'image/webp', 'image/gif',
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]"
            :error-messages="{
              fileTooBig: 'El archivo es muy grande. Máximo {maxSize}',
              invalidFormat: 'Solo se permiten: {formats}'
            }"
            required
            @file-selected="onIdentidadSelected"
            @file-removed="onIdentidadRemoved"
            @validation-error="onIdentidadValidationError"
          />
          <small v-if="fieldErrors.documentoIdentidad" class="text-red-500 block mt-1">{{ fieldErrors.documentoIdentidad }}</small>
        </div>

        <!-- ¿Es inquilino? -->
        <div class="field col-12">
          <div class="flex align-items-center gap-3">
            <pv-input-switch
              inputId="es-inquilino"
              v-model="store.client.isTenant"
            />
            <label for="es-inquilino" class="font-medium text-color cursor-pointer">¿Es inquilino?</label>
          </div>
        </div>

        <div class="col-12" v-if="store.client.isTenant">
          <pv-divider />
        </div>

        <!-- Datos del arrendador -->
        <template v-if="store.client.isTenant">
          <div class="col-12 mb-3">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-building text-2xl text-primary"></i>
              <h2 class="m-0 text-xl font-semibold text-primary">Datos del arrendador</h2>
            </div>
          </div>

          <!-- Nombres -->
          <div class="field col-12 md:col-6">
            <label for="land-nombres" class="block mb-2 font-semibold text-color">
              Nombres <span class="text-red-500">*</span>
            </label>
            <pv-input-text
              id="land-nombres"
              v-model="store.client.landlordName"
              placeholder="Nombre completo del arrendador"
              class="w-full"
              @blur="onFieldBlur('nombres')"
              @keydown="validateTextOnly"
            />
            <small v-if="fieldErrors.nombres" class="text-red-500 block mt-1">{{ fieldErrors.nombres }}</small>
          </div>

          <!-- Teléfono -->
          <div class="field col-12 md:col-6">
            <label for="land-telefono" class="block mb-2 font-semibold text-color">
              Número de contacto <span class="text-red-500">*</span>
            </label>
            <pv-icon-field class="w-full">
              <pv-input-icon class="pi pi-phone" />
              <pv-input-mask
                id="land-telefono"
                v-model="store.client.landlordPhoneNumber"
                mask="999 999 999"
                placeholder="999 888 777"
                class="w-full"
                @blur="onFieldBlur('numeroContacto')"
              />
            </pv-icon-field>
            <small v-if="fieldErrors.numeroContacto" class="text-red-500 block mt-1">{{ fieldErrors.numeroContacto }}</small>
          </div>
        </template>

        <!-- Botones -->
        <div class="col-12 flex justify-content-between gap-2 mt-4">
          <pv-button
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            outlined
            @click="onCancel"
            class="px-5"
          />

          <div class="flex gap-2">
            <pv-button
              label="Regresar"
              icon="pi pi-arrow-left"
              severity="secondary"
              :disabled="store.loading"
              @click="onBack"
              class="px-5"
            />
            <pv-button
              :label="store.loading ? 'Enviando...' : 'Enviar solicitud'"
              :icon="store.loading ? 'pi pi-spin pi-spinner' : 'pi pi-send'"
              type="submit"
              :disabled="!isFormValid || store.loading"
              :loading="store.loading"
              class="px-5"
            />
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- Dialog de confirmación para cancelar -->
  <pv-dialog
    v-model:visible="showCancelDialog"
    modal
    :closable="false"
    :style="{ width: '400px' }"
    header="Confirmar cancelación"
  >
    <div class="flex flex-column gap-3">
      <div class="flex align-items-center gap-2">
        <i class="pi pi-exclamation-triangle text-orange-500 text-2xl"></i>
        <span>¿Está seguro que desea cancelar la solicitud?</span>
      </div>
      <p class="text-color-secondary text-sm m-0">
        Se perderán todos los datos ingresados y regresará al inicio del formulario.
      </p>
    </div>
    
    <template #footer>
      <div class="flex justify-content-end gap-2">
        <pv-button
          label="No, continuar"
          severity="secondary"
          outlined
          @click="cancelCancel"
        />
        <pv-button
          label="Sí, cancelar"
          severity="danger"
          @click="confirmCancel"
        />
      </div>
    </template>
  </pv-dialog>

  <!-- Dialog de confirmación para enviar -->
  <pv-dialog
    v-model:visible="showSubmitDialog"
    modal
    :closable="false"
    :style="{ width: '400px' }"
    header="Confirmar envío"
  >
    <div class="flex flex-column gap-3">
      <div class="flex align-items-center gap-2">
        <i class="pi pi-check-circle text-green-500 text-2xl"></i>
        <span>¿Está seguro que desea enviar la solicitud?</span>
      </div>
      <p class="text-color-secondary text-sm m-0">
        Una vez enviada, se creará la orden de servicio y se procesará la solicitud.
      </p>
    </div>
    
    <template #footer>
      <div class="flex justify-content-end gap-2">
        <pv-button
          label="Cancelar"
          severity="secondary"
          outlined
          @click="cancelSubmit"
        />
        <pv-button
          label="Enviar solicitud"
          severity="success"
          @click="confirmSubmit"
        />
      </div>
    </template>
  </pv-dialog>
</template>

<style scoped>
.formgrid {
  row-gap: 1rem;
}

.field {
  margin-bottom: 0;
}
</style>
