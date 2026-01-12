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
      <div class="flex align-items-center justify-content-between px-3 py-2">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-user"></i>
          <span class="text-lg font-bold">Información Personal</span>
        </div>
        <div v-if="!isEdit && editable">
          <pv-button
            label="Editar Información"
            icon="pi pi-pencil"
            class="p-button-warning"
            @click="editVerifier"
          />
        </div>
        <div v-else-if="isEdit" class="flex gap-2">
          <pv-button
            label="Guardar"
            icon="pi pi-save"
            class="p-button-primary"
            @click="saveVerifier"
          />
          <pv-button
            label="Cancelar"
            icon="pi pi-times"
            class="p-button-secondary"
            @click="cancelEdit"
          />
        </div>
      </div>
    </template>

    <template #content>
      <div class="grid">
        <!-- Fila 1: Nombres, Apellidos, Número de Contacto, Estado de Cuenta -->
        <div class="col-12 lg:col-3">
          <div class="p-3 border-round border-2 surface-border bg-blue-50 h-full">
            <label class="text-xs font-semibold text-blue-700 uppercase mb-2 flex align-items-center gap-2">
              <i class="pi pi-user text-blue-600"></i>
              Nombres
            </label>
            <div v-if="!isEdit">
              <p class="text-base font-bold text-900 m-0">{{ verifier?.name || 'N/A' }}</p>
            </div>
            <div v-else>
              <pv-input-text v-model="editableData.name" class="w-full" />
            </div>
          </div>
        </div>

        <div class="col-12 lg:col-3">
          <div class="p-3 border-round border-2 surface-border bg-blue-50 h-full">
            <label class="text-xs font-semibold text-blue-700 uppercase mb-2 flex align-items-center gap-2">
              <i class="pi pi-users text-blue-600"></i>
              Apellidos
            </label>
            <div v-if="!isEdit">
              <p class="text-base font-bold text-900 m-0">{{ verifier?.lastName || 'N/A' }}</p>
            </div>
            <div v-else>
              <pv-input-text v-model="editableData.lastName" class="w-full" />
            </div>
          </div>
        </div>

        <div class="col-12 lg:col-3">
          <div class="p-3 border-round border-1 surface-border bg-green-50 h-full">
            <label class="text-xs font-semibold text-green-700 uppercase mb-2 flex align-items-center gap-2">
              <i class="pi pi-phone text-green-600"></i>
              Número de Contacto
            </label>
            <div v-if="!isEdit">
              <p class="text-base font-bold text-900 m-0">{{ verifier?.phoneValue || verifier?.phoneNumber || 'N/A' }}</p>
            </div>
            <div v-else>
              <pv-input-text 
                v-model="editableData.phoneNumber" 
                class="w-full" 
                maxlength="9"
                @keypress="(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }"
              />
            </div>
          </div>
        </div>

        <div class="col-12 lg:col-3">
          <div class="p-3 border-round border-2 surface-border bg-cyan-50 h-full">
            <label class="text-xs font-semibold text-cyan-700 uppercase mb-2 flex align-items-center gap-2">
              <i class="pi pi-briefcase text-cyan-600"></i>
              Estado de Cuenta
            </label>
            <div v-if="!isEdit">
              <pv-tag 
                :value="verifier?.status === 'ACTIVE' ? 'Activo' : 'Inactivo'" 
                :severity="verifier?.status === 'ACTIVE' ? 'success' : 'danger'"
                class="text-base font-bold"
              />
            </div>
            <div v-else>
              <pv-dropdown
                v-model="editableData.status"
                :options="statusOptions"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Fila 2: Órdenes Asignadas, Email, Contraseña, Agenda -->
        <div class="col-12 lg:col-3">
          <div class="p-3 border-round border-2 surface-border bg-purple-50 h-full">
            <label class="text-xs font-semibold text-purple-700 uppercase mb-2 flex align-items-center gap-2">
              <i class="pi pi-circle text-purple-600"></i>
              Órdenes Asignadas
            </label>
            <p class="text-4xl font-bold text-purple-700 m-0">{{ assignedOrdersCount }}</p>
          </div>
        </div>

        <div class="col-12 lg:col-3">
          <div class="p-3 border-round border-2 surface-border bg-orange-50 h-full">
            <label class="text-xs font-semibold text-orange-700 uppercase mb-2 flex align-items-center gap-2">
              <i class="pi pi-envelope text-orange-600"></i>
              Correo Electrónico
            </label>
            <div v-if="!isEdit">
              <p class="text-base font-semibold text-900 m-0 word-break-all">{{ verifier?.emailValue || verifier?.email || 'N/A' }}</p>
            </div>
            <div v-else>
              <pv-input-text v-model="editableData.email" type="email" class="w-full" />
            </div>
          </div>
        </div>

        <div class="col-12 lg:col-3">
          <div class="p-3 border-round border-2 surface-border bg-pink-50 h-full">
            <label class="text-xs font-semibold text-pink-700 uppercase mb-2 flex align-items-center gap-2">
              <i class="pi pi-shield text-pink-600"></i>
              Contraseña
            </label>
            <div v-if="!isEdit">
              <p class="text-xl font-bold text-900 m-0" style="letter-spacing: 3px;">••••••••••••</p>
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
        </div>

        <div class="col-12 lg:col-3">
          <div class="p-3 border-round border-2 surface-border bg-cyan-50 h-full">
            <label class="text-xs font-semibold text-cyan-700 uppercase mb-2 flex align-items-center gap-2">
              <i class="pi pi-calendar text-cyan-600"></i>
              Agenda de Trabajo
            </label>
            <div v-if="!isEdit">
              <p class="text-base font-bold text-900 m-0">{{ getAgendaDisplay() }}</p>
            </div>
            <div v-else>
              <pv-input-text v-model="editableData.agenda" class="w-full" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </pv-card>
</template>
