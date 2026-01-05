<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import useVerifierStore from '../../../3.verifiers-accounts/application/verifier.store.js';

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  order: {
    type: Object,
    default: null
  }
});

// Emits
const emit = defineEmits(['update:visible', 'assigned']);

// Stores
const verifierStore = useVerifierStore();

// Estados locales
const loading = ref(false);
const loadingVerifiers = ref(false);
const submitted = ref(false);
const formData = ref({
  verifierId: null,
  visitDate: null,
  visitTime: ''
});

// Computed
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const verifiers = computed(() => verifierStore.verifiers || []);

const verifierOptions = computed(() => {
  return verifiers.value.map(v => ({
    label: `${v.fullName} - ${v.email}`,
    value: v.id
  }));
});

const selectedVerifier = computed(() => {
  if (!formData.value.verifierId) return null;
  return verifiers.value.find(v => v.id === formData.value.verifierId);
});

const isFormValid = computed(() => {
  return formData.value.verifierId && 
         formData.value.visitDate && 
         formData.value.visitTime;
});

const minDate = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
});

// Validaciones
const errors = ref({
  verifierId: '',
  visitDate: '',
  visitTime: ''
});

function validateForm() {
  errors.value = {
    verifierId: '',
    visitDate: '',
    visitTime: ''
  };

  let isValid = true;

  if (!formData.value.verifierId) {
    errors.value.verifierId = 'Debe seleccionar un verificador';
    isValid = false;
  }

  if (!formData.value.visitDate) {
    errors.value.visitDate = 'Debe seleccionar una fecha';
    isValid = false;
  } else {
    const selectedDate = new Date(formData.value.visitDate);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.value.visitDate = 'La fecha debe ser futura';
      isValid = false;
    }
  }

  if (!formData.value.visitTime || formData.value.visitTime.trim() === '') {
    errors.value.visitTime = 'Debe ingresar una hora';
    isValid = false;
  } else {
    // Validar formato HH:MM
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(formData.value.visitTime)) {
      errors.value.visitTime = 'Formato de hora inválido (HH:MM)';
      isValid = false;
    }
  }

  return isValid;
}

// Métodos
async function loadVerifiers() {
  loadingVerifiers.value = true;
  try {
    await verifierStore.fetchAll();
  } finally {
    loadingVerifiers.value = false;
  }
}

function resetForm() {
  formData.value = {
    verifierId: null,
    visitDate: null,
    visitTime: ''
  };
  errors.value = {
    verifierId: '',
    visitDate: '',
    visitTime: ''
  };
  submitted.value = false;
}

function onCancel() {
  resetForm();
  dialogVisible.value = false;
}

async function onSave() {
  submitted.value = true;
  
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  
  try {
    // Emitir evento con los datos
    emit('assigned', {
      orderId: props.order.id,
      verifierId: formData.value.verifierId,
      visitDate: formData.value.visitDate,
      visitTime: formData.value.visitTime
    });

    resetForm();
    dialogVisible.value = false;
  } finally {
    loading.value = false;
  }
}

// Watchers
watch(() => props.visible, (newValue) => {
  if (newValue) {
    loadVerifiers();
  }
});

// Lifecycle
onMounted(() => {
  if (props.visible) {
    loadVerifiers();
  }
});
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    :header="`Asignar Verificador - ${order?.orderCodeValue || ''}`"
    :modal="true"
    :closable="true"
    :draggable="false"
    :style="{ width: '600px' }"
    class="assign-verifier-dialog"
  >
    <div class="dialog-content">
      <!-- Información de la orden -->
      <div class="order-info p-mb-4">
        <Message severity="info" :closable="false">
          <div class="flex flex-column gap-1">
            <div><strong>Cliente:</strong> {{ order?.clientFullName || 'N/A' }}</div>
            <div><strong>Empresa:</strong> {{ order?.companyName || 'N/A' }}</div>
          </div>
        </Message>
      </div>

      <!-- Formulario -->
      <div class="form-content">
        <!-- Selector de verificador -->
        <div class="field">
          <label for="verifier" class="font-semibold">
            Verificador <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="verifier"
            v-model="formData.verifierId"
            :options="verifierOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccione un verificador"
            :filter="true"
            filterPlaceholder="Buscar verificador..."
            :loading="loadingVerifiers"
            :class="{'p-invalid': submitted && errors.verifierId}"
            class="w-full"
          />
          <small v-if="submitted && errors.verifierId" class="p-error">
            {{ errors.verifierId }}
          </small>
        </div>

        <!-- Información del verificador seleccionado -->
        <div v-if="selectedVerifier" class="verifier-info p-mb-3">
          <Message severity="success" :closable="false">
            <div class="flex flex-column gap-1">
              <div><strong>Email:</strong> {{ selectedVerifier.email }}</div>
              <div v-if="selectedVerifier.phoneNumber">
                <strong>Teléfono:</strong> {{ selectedVerifier.phoneNumber }}
              </div>
              <div v-if="selectedVerifier.workSchedule">
                <strong>Horario:</strong> {{ selectedVerifier.workSchedule }}
              </div>
            </div>
          </Message>
        </div>

        <!-- Fecha de visita -->
        <div class="field">
          <label for="visitDate" class="font-semibold">
            Fecha de Visita <span class="text-red-500">*</span>
          </label>
          <Calendar
            id="visitDate"
            v-model="formData.visitDate"
            :minDate="minDate"
            dateFormat="dd/mm/yy"
            :showIcon="true"
            placeholder="Seleccione fecha"
            :class="{'p-invalid': submitted && errors.visitDate}"
            class="w-full"
          />
          <small v-if="submitted && errors.visitDate" class="p-error">
            {{ errors.visitDate }}
          </small>
        </div>

        <!-- Hora de visita -->
        <div class="field">
          <label for="visitTime" class="font-semibold">
            Hora de Visita <span class="text-red-500">*</span>
          </label>
          <InputText
            id="visitTime"
            v-model="formData.visitTime"
            placeholder="HH:MM (ej: 14:30)"
            :class="{'p-invalid': submitted && errors.visitTime}"
            class="w-full"
          />
          <small class="text-color-secondary">Formato 24 horas (HH:MM)</small>
          <small v-if="submitted && errors.visitTime" class="p-error block">
            {{ errors.visitTime }}
          </small>
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
          label="Asignar Verificador"
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
.assign-verifier-dialog .dialog-content {
  padding-top: 1rem;
}

.assign-verifier-dialog .field {
  margin-bottom: 1.5rem;
}

.assign-verifier-dialog .field label {
  display: block;
  margin-bottom: 0.5rem;
}

.assign-verifier-dialog .order-info,
.assign-verifier-dialog .verifier-info {
  margin-bottom: 1.5rem;
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .assign-verifier-dialog {
    width: 95vw !important;
  }
}
</style>
