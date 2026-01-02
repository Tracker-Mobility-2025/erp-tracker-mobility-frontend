<script setup>
import { ref } from 'vue';

const props = defineProps({
  verifier: {
    type: Object,
    required: true,
  },
  assignedOrdersCount: {
    type: Number,
    default: 0,
  },
  editable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['save', 'cancel']);

// State
const isEdit = ref(false);
const editableData = ref({
  name: '',
  lastName: '',
  email: '',
  password: '',
  phoneNumber: '',
  agenda: '',
  status: '',
});

const statusOptions = ['ACTIVO', 'INACTIVO'];

// Methods
function editVerifier() {
  isEdit.value = true;
  
  // Extraer valores correctamente de los value objects
  const emailValue = props.verifier.emailValue || 
                     (props.verifier.email?.value) || 
                     (typeof props.verifier.email === 'string' ? props.verifier.email : '') || 
                     '';
  
  const phoneValue = props.verifier.phoneValue || 
                     (props.verifier.phoneNumber?.value) || 
                     (typeof props.verifier.phoneNumber === 'string' ? props.verifier.phoneNumber : '') || 
                     '';
  
  const agendaValue = props.verifier.workScheduleValue || 
                      (props.verifier.workSchedule?.value) ||
                      (props.verifier.agenda?.value) ||
                      (typeof props.verifier.agenda === 'string' ? props.verifier.agenda : '') || 
                      '';
  
  console.log('🔍 [VERIFIER-DATA-CARD] Valores extraídos:');
  console.log('  - email:', emailValue);
  console.log('  - phone:', phoneValue);
  console.log('  - agenda:', agendaValue);
  console.log('  - verifier original:', props.verifier);
  
  // Clonar datos actuales para edición
  editableData.value = {
    name: props.verifier.name || '',
    lastName: props.verifier.lastName || '',
    email: emailValue,
    password: '', // Siempre vacío, solo se envía si el usuario escribe algo
    phoneNumber: phoneValue,
    agenda: agendaValue,
    status: props.verifier.status === 'ACTIVE' ? 'ACTIVO' : 'INACTIVO',
  };
}

function saveVerifier() {
  // Parsear status de Español a inglés
  const dataToSave = { ...editableData.value };
  if (dataToSave.status === 'ACTIVO') {
    dataToSave.status = 'ACTIVE';
  } else if (dataToSave.status === 'INACTIVO') {
    dataToSave.status = 'INACTIVE';
  }

  // Si la contraseña está vacía, no incluirla en el objeto a guardar
  if (!dataToSave.password || dataToSave.password.trim() === '') {
    delete dataToSave.password;
  }

  console.log('📤 [VERIFIER-DATA-CARD] Datos a guardar:', dataToSave);

  emit('save', dataToSave);
  isEdit.value = false;
}

function cancelEdit() {
  isEdit.value = false;
  emit('cancel');
}

// Computed para obtener valores display
function getAgendaDisplay() {
  return props.verifier?.workScheduleValue || 
         props.verifier?.workSchedule?.value ||
         props.verifier?.agenda?.value ||
         (typeof props.verifier?.agenda === 'string' ? props.verifier?.agenda : '') || 
         'N/A';
}
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <div class="bg-primary text-white p-3 flex align-items-center justify-content-between">
        <h3 class="text-lg font-bold flex align-items-center gap-2 m-0">
          <i class="pi pi-user-edit"></i>
          Datos del verificador
        </h3>
        <pv-button
          v-if="!isEdit && editable"
          label="Editar"
          icon="pi pi-pencil"
          class="p-button-warning"
          size="small"
          @click="editVerifier"
        />
      </div>
    </template>

    <template #content>
      <div class="grid">
        <!-- Fila 1: Nombre, Apellidos, Teléfono, Estado, Cantidad de órdenes -->
        <div class="field col-12 md:col-2">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-user text-blue-500"></i>
            Nombres
          </label>
          <div v-if="!isEdit">
            <p class="font-semibold text-dark m-0">{{ verifier?.name || 'N/A' }}</p>
          </div>
          <div v-else>
            <pv-input-text v-model="editableData.name" class="w-full" />
          </div>
        </div>

        <div class="field col-12 md:col-2">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-users text-blue-500"></i>
            Apellidos
          </label>
          <div v-if="!isEdit">
            <p class="font-semibold text-dark m-0">{{ verifier?.lastName || 'N/A' }}</p>
          </div>
          <div v-else>
            <pv-input-text v-model="editableData.lastName" class="w-full" />
          </div>
        </div>

        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-phone text-blue-500"></i>
            Contacto
          </label>
          <div v-if="!isEdit">
            <p class="font-semibold text-dark m-0">{{ verifier?.phoneValue || verifier?.phoneNumber || 'N/A' }}</p>
          </div>
          <div v-else>
            <pv-input-text v-model="editableData.phoneNumber" class="w-full" />
          </div>
        </div>

        <div class="field col-12 md:col-2">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-check-circle text-blue-500"></i>
            Estado
          </label>
          <div v-if="!isEdit">
            <p class="font-semibold text-dark m-0">{{ verifier?.status === 'ACTIVE' ? 'ACTIVO' : 'INACTIVO' }}</p>
          </div>
          <div v-else>
            <pv-dropdown
              v-model="editableData.status"
              :options="statusOptions"
              class="w-full"
            />
          </div>
        </div>

        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-list text-blue-500"></i>
            Cant. órdenes
          </label>
          <p class="font-semibold text-dark m-0">{{ assignedOrdersCount }}</p>
        </div>

        <!-- Fila 2: Email, Contraseña, Agenda -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-envelope text-blue-500"></i>
            Correo
          </label>
          <div v-if="!isEdit">
            <p class="font-semibold text-dark m-0">{{ verifier?.emailValue || verifier?.email || 'N/A' }}</p>
          </div>
          <div v-else>
            <pv-input-text v-model="editableData.email" type="email" class="w-full" />
          </div>
        </div>

        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-lock text-blue-500"></i>
            Contraseña
          </label>
          <div v-if="!isEdit">
            <p class="font-semibold text-dark m-0">*************</p>
          </div>
          <div v-else>
            <pv-password 
              v-model="editableData.password" 
              toggle-mask 
              :feedback="false"
              class="w-full"
              placeholder="Dejar vacío para no cambiar"
            />
          </div>
        </div>

        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-calendar text-blue-500"></i>
            Agenda
          </label>
          <div v-if="!isEdit">
            <p class="font-semibold text-dark m-0">{{ getAgendaDisplay() }}</p>
          </div>
          <div v-else>
            <pv-input-text v-model="editableData.agenda" class="w-full" />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div v-if="isEdit" class="flex justify-content-center gap-3">
        <pv-button
          label="Guardar"
          icon="pi pi-save"
          class="p-button-primary w-10rem"
          @click="saveVerifier"
        />
        <pv-button
          label="Cancelar"
          icon="pi pi-times"
          class="p-button-secondary w-10rem"
          @click="cancelEdit"
        />
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
:deep(.p-card-content) {
  padding: 0.5rem;
}

:deep(.p-inputtext) {
  width: 100%;
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
}

:deep(.p-card-header) {
  background-color: #4A60D0;
  border-radius: 0.375rem 0.375rem 0 0;
  overflow: hidden;
}

:deep(.p-card) {
  overflow: hidden;
  border-radius: 0.375rem;
}
</style>
