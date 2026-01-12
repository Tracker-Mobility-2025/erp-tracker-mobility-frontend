<script setup>
import { ref, watch, computed } from 'vue';
import { useNotification } from '../../../shared-v2/composables/use-notification.js';

const props = defineProps({
  clientNameAccordingToLandlord: {
    type: String,
    default: ''
  },
  ownHome: {
    type: String,
    default: ''
  },
  servicesPaidByClient: {
    type: String,
    default: ''
  },
  isTheClientPunctualWithPayments: {
    type: String,
    default: ''
  },
  timeLivingAccordingToLandlord: {
    type: String,
    default: ''
  },
  floorOccupiedByClient: {
    type: String,
    default: ''
  },
  interviewObservation: {
    type: String,
    default: ''
  },
  canEdit: {
    type: Boolean,
    default: false
  },
  blockedByFinalResult: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update-interview-details-requested']);

// Composables
const { showWarning } = useNotification();

// State
const isEditing = ref(false);
const editForm = ref({
  tenantName: '',
  ownHouse: '',
  serviceClientPays: '',
  clientPaysPunctual: '',
  clientRentalTime: '',
  clientFloorNumber: '',
  interviewObservation: ''
});

const booleanOptions = [
  { label: 'No especifica', value: 'No especifica' },
  { label: 'Sí', value: 'Sí' },
  { label: 'No', value: 'No' }
];

// Computed
const headerClass = computed(() => {
  return props.canEdit ? 'bg-orange-500' : 'bg-primary';
});

// Watch for props changes
watch(() => [props.clientNameAccordingToLandlord, props.ownHome, props.servicesPaidByClient, 
             props.isTheClientPunctualWithPayments, props.timeLivingAccordingToLandlord, 
             props.floorOccupiedByClient, props.interviewObservation], () => {
  editForm.value = {
    tenantName: props.clientNameAccordingToLandlord || '',
    ownHouse: props.ownHome || '',
    serviceClientPays: props.servicesPaidByClient || '',
    clientPaysPunctual: props.isTheClientPunctualWithPayments || '',
    clientRentalTime: props.timeLivingAccordingToLandlord || '',
    clientFloorNumber: props.floorOccupiedByClient || '',
    interviewObservation: props.interviewObservation || ''
  };
}, { immediate: true });

watch(() => props.canEdit, (newVal) => {
  if (!newVal && isEditing.value) {
    isEditing.value = false;
  }
});

// Methods
const formatValue = (value) => {
  if (!value || value === '' || value === '-' || value === 'null' || value === 'undefined') {
    return 'No especificado';
  }
  return value;
};

const formatBooleanValue = (value) => {
  if (!value || value === '' || value === '-' || value === 'null' || value === 'undefined') {
    return 'No especifica';
  }
  return value;
};

const onEditToggle = () => {
  if (!props.canEdit) return;
  
  isEditing.value = !isEditing.value;
  
  if (!isEditing.value) {
    // Reset form when cancelling edit mode
    editForm.value = {
      tenantName: props.clientNameAccordingToLandlord || '',
      ownHouse: props.ownHome || '',
      serviceClientPays: props.servicesPaidByClient || '',
      clientPaysPunctual: props.isTheClientPunctualWithPayments || '',
      clientRentalTime: props.timeLivingAccordingToLandlord || '',
      clientFloorNumber: props.floorOccupiedByClient || '',
      interviewObservation: props.interviewObservation || ''
    };
  }
};

const validateForm = () => {
  const errors = [];

  // Validar nombre del inquilino
  if (!editForm.value.tenantName || editForm.value.tenantName.trim() === '') {
    errors.push('Nombre del inquilino');
  }

  // Casa propia
  if (!editForm.value.ownHouse || editForm.value.ownHouse === '') {
    errors.push('Casa propia');
  }

  // Servicio que paga el cliente
  if (!editForm.value.serviceClientPays || editForm.value.serviceClientPays.trim() === '') {
    errors.push('Servicio que paga el cliente');
  }

  // ¿Paga puntual?
  if (!editForm.value.clientPaysPunctual || editForm.value.clientPaysPunctual === '') {
    errors.push('¿El cliente paga puntual?');
  }

  // Tiempo de arrendamiento
  if (!editForm.value.clientRentalTime || editForm.value.clientRentalTime.trim() === '') {
    errors.push('Tiempo de arrendamiento del cliente');
  }

  // Número de piso
  if (!editForm.value.clientFloorNumber || editForm.value.clientFloorNumber.trim() === '') {
    errors.push('Número de piso en el que habita el cliente');
  }

  return errors;
};

const onSaveEdit = () => {
  const errors = validateForm();

  if (errors.length > 0) {
    showWarning(
      `Debe completar los siguientes campos: ${errors.join(', ')}.`,
      'Campos incompletos',
      5000
    );
    return;
  }

  // Emitir evento al padre para gestionar la actualización
  emit('update-interview-details-requested', { ...editForm.value });
  // Mantener el componente en modo lectura tras guardar
  isEditing.value = false;
};
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <div class="flex justify-content-between align-items-center" :class="headerClass">
        <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
          <i class="pi pi-comments text-white"></i>
          Detalles de la Entrevista con el Arrendador
          <span v-if="canEdit" class="text-sm font-normal">(Pendiente de completar)</span>
        </h3>
        <div v-if="canEdit" class="flex align-items-center gap-2 pr-3">
          <pv-button
            v-if="!isEditing"
            size="small"
            icon="pi pi-pencil"
            label="Editar"
            class="p-button-warning p-button-sm"
            @click="onEditToggle"
          />
          <template v-else>
            <pv-button
              size="small"
              icon="pi pi-times"
              label="Cancelar"
              class="p-button-secondary p-button-sm"
              @click="onEditToggle"
            />
            <pv-button
              size="small"
              icon="pi pi-save"
              label="Guardar"
              class="p-button-success p-button-sm"
              @click="onSaveEdit"
            />
          </template>
        </div>
        <div v-else-if="blockedByFinalResult" class="flex align-items-center gap-2 pr-3">
          <span class="text-sm text-white flex align-items-center gap-2">
            <i class="pi pi-lock"></i>
            Edición bloqueada porque el reporte ya tiene resultado final
          </span>
        </div>
      </div>
    </template>
    <template #content>
      <div class="formgrid grid">
        <!-- Primera fila -->
        <div class="field col-12 md:col-4">
          <template v-if="!isEditing">
            <div class="p-3 border-round border-2 surface-border bg-blue-50 h-full">
              <label class="text-xs font-semibold text-blue-700 uppercase mb-2 flex align-items-center gap-2">
                <i class="pi pi-user text-blue-600"></i>
                Nombre del inquilino
              </label>
              <p class="text-base font-bold text-900 m-0">
                {{ formatValue(clientNameAccordingToLandlord) }}
              </p>
            </div>
          </template>
          <template v-else>
            <label class="font-semibold text-color-secondary flex align-items-center gap-2 mb-2">
              <i class="pi pi-user text-primary"></i>
              Nombre del inquilino:
            </label>
            <pv-input-text v-model="editForm.tenantName" class="w-full" placeholder="Nombre del inquilino" />
          </template>
        </div>
        
        <div class="field col-12 md:col-4">
          <template v-if="!isEditing">
            <div class="p-3 border-round border-2 surface-border bg-indigo-50 h-full">
              <label class="text-xs font-semibold text-indigo-700 uppercase mb-2 flex align-items-center gap-2">
                <i class="pi pi-home text-indigo-600"></i>
                Casa propia
              </label>
              <p class="text-base font-bold text-900 m-0">
                {{ formatBooleanValue(ownHome) }}
              </p>
            </div>
          </template>
          <template v-else>
            <label class="font-semibold text-color-secondary flex align-items-center gap-2 mb-2">
              <i class="pi pi-home text-primary"></i>
              Casa propia
            </label>
            <pv-select v-model="editForm.ownHouse" :options="booleanOptions" option-label="label" option-value="value" class="w-full" placeholder="Seleccione"/>
          </template>
        </div>
        
        <div class="field col-12 md:col-4">
          <template v-if="!isEditing">
            <div class="p-3 border-round border-2 surface-border bg-purple-50 h-full">
              <label class="text-xs font-semibold text-purple-700 uppercase mb-2 flex align-items-center gap-2">
                <i class="pi pi-dollar text-purple-600"></i>
                Servicio que paga el cliente
              </label>
              <p class="text-base font-bold text-900 m-0">
                {{ formatValue(servicesPaidByClient) }}
              </p>
            </div>
          </template>
          <template v-else>
            <label class="font-semibold text-color-secondary flex align-items-center gap-2 mb-2">
              <i class="pi pi-dollar text-primary"></i>
              Servicio que paga el cliente
            </label>
            <pv-input-text v-model="editForm.serviceClientPays" class="w-full" placeholder="Servicios (separados por coma)"/>
          </template>
        </div>
        
        <!-- Segunda fila -->
        <div class="field col-12 md:col-4">
          <template v-if="!isEditing">
            <div class="p-3 border-round border-2 surface-border bg-green-50 h-full">
              <label class="text-xs font-semibold text-green-700 uppercase mb-2 flex align-items-center gap-2">
                <i class="pi pi-check-circle text-green-600"></i>
                ¿El cliente paga puntual?
              </label>
              <p class="text-base font-bold text-900 m-0">
                {{ formatBooleanValue(isTheClientPunctualWithPayments) }}
              </p>
            </div>
          </template>
          <template v-else>
            <label class="font-semibold text-color-secondary flex align-items-center gap-2 mb-2">
              <i class="pi pi-check-circle text-primary"></i>
              ¿El cliente paga puntual?
            </label>
            <pv-select v-model="editForm.clientPaysPunctual" :options="booleanOptions" option-label="label" option-value="value" class="w-full" placeholder="Seleccione"/>
          </template>
        </div>
        
        <div class="field col-12 md:col-4">
          <template v-if="!isEditing">
            <div class="p-3 border-round border-2 surface-border bg-orange-50 h-full">
              <label class="text-xs font-semibold text-orange-700 uppercase mb-2 flex align-items-center gap-2">
                <i class="pi pi-clock text-orange-600"></i>
                Tiempo de arrendamiento
              </label>
              <p class="text-base font-bold text-900 m-0">
                {{ formatValue(timeLivingAccordingToLandlord) }}
              </p>
            </div>
          </template>
          <template v-else>
            <label class="font-semibold text-color-secondary flex align-items-center gap-2 mb-2">
              <i class="pi pi-clock text-primary"></i>
              Tiempo de arrendamiento del cliente:
            </label>
            <pv-input-text v-model="editForm.clientRentalTime" class="w-full" placeholder="Ej: 2 años"/>
          </template>
        </div>
        
        <div class="field col-12 md:col-4">
          <template v-if="!isEditing">
            <div class="p-3 border-round border-2 surface-border bg-pink-50 h-full">
              <label class="text-xs font-semibold text-pink-700 uppercase mb-2 flex align-items-center gap-2">
                <i class="pi pi-building text-pink-600"></i>
                Piso que habita
              </label>
              <p class="text-base font-bold text-900 m-0">
                {{ formatValue(floorOccupiedByClient) }}
              </p>
            </div>
          </template>
          <template v-else>
            <label class="font-semibold text-color-secondary flex align-items-center gap-2 mb-2">
              <i class="pi pi-building text-primary"></i>
              Nro de piso en el que habita el cliente:
            </label>
            <pv-input-text v-model="editForm.clientFloorNumber" class="w-full" placeholder="Ej: 3"/>
          </template>
        </div>

        <!-- Tercera fila - Observaciones -->
        <div class="field col-12">
          <template v-if="!isEditing">
            <div v-if="interviewObservation" class="p-3 border-round border-2 surface-border bg-cyan-50 h-full">
              <label class="text-xs font-semibold text-cyan-700 uppercase mb-2 flex align-items-center gap-2">
                <i class="pi pi-file-edit text-cyan-600"></i>
                Observaciones de la entrevista
              </label>
              <p class="text-base font-bold text-900 m-0 white-space-pre-wrap">
                {{ interviewObservation }}
              </p>
            </div>
          </template>
          <template v-else>
            <label class="font-semibold text-color-secondary flex align-items-center gap-2 mb-2">
              <i class="pi pi-file-edit text-primary"></i>
              Observaciones de la entrevista:
            </label>
            <pv-textarea
              v-model="editForm.interviewObservation"
              class="w-full"
              rows="4"
              placeholder="Ingrese observaciones adicionales sobre la entrevista (opcional)"
            />
          </template>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
:deep(.p-card-content) {
  padding: 0.5rem;
}

:deep(.p-card-header) {
  border-radius: 0.375rem 0.375rem 0 0;
  overflow: hidden;
}

:deep(.p-card) {
  overflow: hidden;
  border-radius: 0.375rem;
}

.bg-primary {
  background-color: #4A60D0;
}

.bg-orange-500 {
  background-color: #FB8C00;
}
</style>
