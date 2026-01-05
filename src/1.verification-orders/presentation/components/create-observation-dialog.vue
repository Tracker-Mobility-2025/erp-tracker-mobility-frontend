<script setup>
import { ref, computed, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import Message from 'primevue/message';
import { 
  ObservationType, 
  ObservationTypeTranslations,
  ObservationTypeIcons 
} from '../../domain/constants/observation.constants.js';

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  orderId: {
    type: Number,
    required: true
  }
});

// Emits
const emit = defineEmits(['update:visible', 'created']);

// Estados locales
const loading = ref(false);
const submitted = ref(false);
const formData = ref({
  observationType: null,
  description: ''
});

// Computed
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const observationTypeOptions = computed(() => {
  return Object.entries(ObservationTypeTranslations).map(([value, label]) => ({
    value,
    label,
    icon: ObservationTypeIcons[value]
  }));
});

const isFormValid = computed(() => {
  return formData.value.observationType && 
         formData.value.description && 
         formData.value.description.trim().length >= 10;
});

const descriptionLength = computed(() => {
  return formData.value.description.trim().length;
});

const descriptionError = computed(() => {
  if (!submitted.value) return '';
  if (!formData.value.description || formData.value.description.trim().length === 0) {
    return 'La descripción es requerida';
  }
  if (formData.value.description.trim().length < 10) {
    return 'La descripción debe tener al menos 10 caracteres';
  }
  if (formData.value.description.trim().length > 500) {
    return 'La descripción no debe exceder 500 caracteres';
  }
  return '';
});

const typeError = computed(() => {
  if (!submitted.value) return '';
  if (!formData.value.observationType) {
    return 'Debe seleccionar un tipo de observación';
  }
  return '';
});

// Métodos
function resetForm() {
  formData.value = {
    observationType: null,
    description: ''
  };
  submitted.value = false;
}

function onCancel() {
  resetForm();
  dialogVisible.value = false;
}

async function onSave() {
  submitted.value = true;
  
  if (!isFormValid.value) {
    return;
  }

  loading.value = true;
  
  try {
    emit('created', {
      orderId: props.orderId,
      observationType: formData.value.observationType,
      description: formData.value.description.trim()
    });

    resetForm();
    dialogVisible.value = false;
  } finally {
    loading.value = false;
  }
}

// Watchers
watch(() => props.visible, (newValue) => {
  if (!newValue) {
    resetForm();
  }
});
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    header="Nueva Observación"
    :modal="true"
    :closable="true"
    :draggable="false"
    :style="{ width: '600px' }"
    class="create-observation-dialog"
  >
    <div class="dialog-content">
      <!-- Información -->
      <div class="info-message p-mb-4">
        <Message severity="info" :closable="false">
          Complete los datos de la observación. Asegúrese de ser específico en la descripción para facilitar su resolución.
        </Message>
      </div>

      <!-- Formulario -->
      <div class="form-content">
        <!-- Tipo de observación -->
        <div class="field">
          <label for="observationType" class="font-semibold">
            Tipo de Observación <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="observationType"
            v-model="formData.observationType"
            :options="observationTypeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccione el tipo"
            :class="{'p-invalid': submitted && typeError}"
            class="w-full"
          >
            <template #option="{ option }">
              <div class="flex align-items-center gap-2">
                <i :class="option.icon"></i>
                <span>{{ option.label }}</span>
              </div>
            </template>
            <template #value="{ value }">
              <div v-if="value" class="flex align-items-center gap-2">
                <i :class="ObservationTypeIcons[value]"></i>
                <span>{{ ObservationTypeTranslations[value] }}</span>
              </div>
              <span v-else>Seleccione el tipo</span>
            </template>
          </Dropdown>
          <small v-if="submitted && typeError" class="p-error">
            {{ typeError }}
          </small>
        </div>

        <!-- Descripción -->
        <div class="field">
          <label for="description" class="font-semibold">
            Descripción <span class="text-red-500">*</span>
          </label>
          <Textarea
            id="description"
            v-model="formData.description"
            rows="6"
            placeholder="Describa detalladamente la observación encontrada..."
            :class="{'p-invalid': submitted && descriptionError}"
            class="w-full"
            :maxlength="500"
          />
          <div class="flex justify-content-between align-items-center mt-1">
            <small v-if="submitted && descriptionError" class="p-error">
              {{ descriptionError }}
            </small>
            <small v-else class="text-color-secondary">
              Mínimo 10 caracteres
            </small>
            <small 
              class="text-color-secondary"
              :class="{'text-red-500': descriptionLength > 500}"
            >
              {{ descriptionLength }} / 500
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer con botones -->
    <template #footer>
      <div class="flex justify-content-end gap-2">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          class="p-button-text p-button-secondary"
          :disabled="loading"
          @click="onCancel"
        />
        <Button
          label="Crear Observación"
          icon="pi pi-check"
          class="p-button-primary"
          :loading="loading"
          :disabled="!isFormValid && submitted"
          @click="onSave"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.create-observation-dialog .dialog-content {
  padding-top: 1rem;
}

.create-observation-dialog .field {
  margin-bottom: 1.5rem;
}

.create-observation-dialog .field label {
  display: block;
  margin-bottom: 0.5rem;
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .create-observation-dialog {
    width: 95vw !important;
  }
}
</style>
