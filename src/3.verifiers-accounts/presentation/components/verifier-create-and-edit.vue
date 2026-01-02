<script setup>
import { ref, watch, computed } from 'vue';
import { VerifierValidators } from '../../domain/validators/verifier.validators.js';
import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

const props = defineProps({
  verifier: {
    type: Object,
    required: true
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['save', 'cancel', 'update:visible']);

const submitted = ref(false);
const verifierEntity = ref({
  email: '',
  password: '',
  name: '',
  lastName: '',
  phoneNumber: '',
  agenda: '',
  status: 'INACTIVE'
});

const statusOptions = ['ACTIVO', 'INACTIVO'];

// Watch para sincronizar props con el formulario
watch(() => props.verifier, (newVerifier) => {
  if (newVerifier) {
    // Resetear submitted cuando se cargan nuevos datos
    submitted.value = false;
    
    // Mapear status de inglés a español para el formulario
    let statusValue = 'INACTIVO';
    if (newVerifier.status === 'ACTIVE') {
      statusValue = 'ACTIVO';
    } else if (newVerifier.status === 'INACTIVE') {
      statusValue = 'INACTIVO';
    }
    
    // Extraer valores string de los value objects
    const emailValue = newVerifier.emailValue || 
                       (newVerifier.email?.value) || 
                       (typeof newVerifier.email === 'string' ? newVerifier.email : '') || 
                       '';
    
    const phoneValue = newVerifier.phoneValue || 
                       (newVerifier.phoneNumber?.value) || 
                       (typeof newVerifier.phoneNumber === 'string' ? newVerifier.phoneNumber : '') || 
                       '';
    
    const agendaValue = newVerifier.workScheduleValue || 
                        (newVerifier.workSchedule?.value) ||
                        (newVerifier.agenda?.value) ||
                        (typeof newVerifier.agenda === 'string' ? newVerifier.agenda : '') || 
                        '';
    
    verifierEntity.value = {
      email: emailValue,
      password: '', // Siempre vacío en edición
      name: newVerifier.name || '',
      lastName: newVerifier.lastName || '',
      phoneNumber: phoneValue,
      agenda: agendaValue,
      status: statusValue
    };
  }
}, { immediate: true, deep: true });

// Watch para resetear submitted cuando se abre/cierra el diálogo
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    submitted.value = false;
  }
});

// Validaciones reactivas usando validadores del dominio
const emailValidation = computed(() => 
  VerifierValidators.validateEmail(verifierEntity.value.email)
);

const passwordValidation = computed(() => 
  !props.isEdit 
    ? VerifierValidators.validatePassword(verifierEntity.value.password)
    : { valid: true }
);

const nameValidation = computed(() => 
  VerifierValidators.validateName(verifierEntity.value.name, 'Nombre')
);

const lastNameValidation = computed(() => 
  VerifierValidators.validateName(verifierEntity.value.lastName, 'Apellido')
);

const phoneValidation = computed(() => 
  VerifierValidators.validatePhoneNumber(verifierEntity.value.phoneNumber)
);

const agendaValidation = computed(() => 
  VerifierValidators.validateAgenda(verifierEntity.value.agenda)
);

const isFormValid = computed(() => 
  emailValidation.value.valid &&
  passwordValidation.value.valid &&
  nameValidation.value.valid &&
  lastNameValidation.value.valid &&
  phoneValidation.value.valid &&
  agendaValidation.value.valid
);

// Methods
const cancelRequested = () => {
  submitted.value = false;
  resetForm();
  emit('cancel');
  emit('update:visible', false);
};

const saveRequested = () => {
  submitted.value = true;
  
  console.log('🔍 Verificando formulario antes de guardar:');
  console.log('verifierEntity:', verifierEntity.value);
  console.log('isEdit:', props.isEdit);
  console.log('Validaciones:');
  console.log('  - email:', emailValidation.value);
  console.log('  - password:', passwordValidation.value);
  console.log('  - name:', nameValidation.value);
  console.log('  - lastName:', lastNameValidation.value);
  console.log('  - phone:', phoneValidation.value);
  console.log('  - agenda:', agendaValidation.value);
  console.log('isFormValid:', isFormValid.value);
  
  if (isFormValid.value) {
    const dataToSave = { ...verifierEntity.value };
    
    // Convertir estado de español a inglés
    if (dataToSave.status === 'ACTIVO') {
      dataToSave.status = 'ACTIVE';
    } else if (dataToSave.status === 'INACTIVO') {
      dataToSave.status = 'INACTIVE';
    }
    
    // Si estamos en modo edición y la contraseña está vacía, no incluirla
    if (props.isEdit && (!dataToSave.password || dataToSave.password.trim() === '')) {
      delete dataToSave.password;
    }
    
    emit('save', dataToSave);
    resetForm();
    emit('update:visible', false);
  }
};

const resetForm = () => {
  verifierEntity.value = {
    email: '',
    password: '',
    name: '',
    lastName: '',
    phoneNumber: '',
    agenda: '',
    status: 'INACTIVE'
  };
  submitted.value = false;
};
</script>

<template>
  <create-and-edit 
    :entity="verifierEntity" 
    :visible="visible" 
    entity-name="verificador" 
    :edit="isEdit" 
    size="standard"
    @canceled-shared="cancelRequested" 
    @saved-shared="saveRequested"
  >
    <template #content>
      <div class="grid p-2">
        <!-- Fila 1: Nombre y Apellidos -->
        <div class="col-12 md:col-6 px-2 pb-1">
          <div class="field">
            <label for="name" class="block text-900 font-medium mb-2">
              <i class="pi pi-user mr-2"></i>Nombre *
            </label>
            <pv-input-text
              id="name"
              v-model="verifierEntity.name"
              class="w-full"
              size="small"
              placeholder="Ingrese el nombre"
              :class="{ 'p-invalid': submitted && !nameValidation.valid }"
            />
            <small v-if="submitted && !nameValidation.valid" class="p-error">
              {{ nameValidation.message }}
            </small>
          </div>
        </div>

        <div class="col-12 md:col-6 px-2 pb-1">
          <div class="field">
            <label for="lastName" class="block text-900 font-medium mb-2">
              <i class="pi pi-users mr-2"></i>Apellidos *
            </label>
            <pv-input-text
              id="lastName"
              v-model="verifierEntity.lastName"
              class="w-full"
              size="small"
              placeholder="Ingrese los apellidos"
              :class="{ 'p-invalid': submitted && !lastNameValidation.valid }"
            />
            <small v-if="submitted && !lastNameValidation.valid" class="p-error">
              {{ lastNameValidation.message }}
            </small>
          </div>
        </div>

        <!-- Fila 2: Teléfono y Agenda -->
        <div class="col-12 md:col-6 px-2 pb-1">
          <div class="field">
            <label for="phoneNumber" class="block text-900 font-medium mb-2">
              <i class="pi pi-phone mr-2"></i>Teléfono *
            </label>
            <pv-input-text
              id="phoneNumber"
              v-model="verifierEntity.phoneNumber"
              class="w-full"
              size="small"
              placeholder="912345678"
              :class="{ 'p-invalid': submitted && !phoneValidation.valid }"
            />
            <small v-if="submitted && !phoneValidation.valid" class="p-error">
              {{ phoneValidation.message }}
            </small>
          </div>
        </div>

        <div class="col-12 md:col-6 px-2 pb-1">
          <div class="field">
            <label for="agenda" class="block text-900 font-medium mb-2">
              <i class="pi pi-calendar mr-2"></i>Horario de trabajo *
            </label>
            <pv-input-text
              id="agenda"
              v-model="verifierEntity.agenda"
              class="w-full"
              size="small"
              placeholder="Lunes a viernes, 8:00-16:00"
              :class="{ 'p-invalid': submitted && !agendaValidation.valid }"
            />
            <small v-if="submitted && !agendaValidation.valid" class="p-error">
              {{ agendaValidation.message }}
            </small>
          </div>
        </div>

        <!-- Fila 3: Email y Contraseña -->
        <div class="col-12 md:col-6 px-2 pb-1">
          <div class="field">
            <label for="email" class="block text-900 font-medium mb-2">
              <i class="pi pi-envelope mr-2"></i>Email *
            </label>
            <pv-input-text
              id="email"
              v-model="verifierEntity.email"
              type="email"
              class="w-full"
              size="small"
              placeholder="Ingrese su email corporativo"
              :class="{ 'p-invalid': submitted && !emailValidation.valid }"
            />
            <small v-if="submitted && !emailValidation.valid" class="p-error">
              {{ emailValidation.message }}
            </small>
          </div>
        </div>

        <div class="col-12 md:col-6 px-2 pb-1">
          <div class="field">
            <label for="password" class="block text-900 font-medium mb-2">
              <i class="pi pi-key mr-2"></i>Contraseña {{ isEdit ? '' : '*' }}
            </label>
            <pv-password
              id="password"
              v-model="verifierEntity.password"
              inputClass="w-full"
              class="w-full"
              size="small"
              toggleMask
              :feedback="false"
              :placeholder="isEdit ? 'Dejar vacío para no cambiar' : 'Ingrese una contraseña segura'"
              :inputStyle="{ width: '100%' }"
              :class="{ 'p-invalid': submitted && !passwordValidation.valid }"
            />
            <small v-if="submitted && !passwordValidation.valid" class="p-error">
              {{ passwordValidation.message }}
            </small>
            <small v-if="isEdit" class="text-500 block mt-1">
              Dejar vacío para mantener la contraseña actual
            </small>
          </div>
        </div>

        <!-- Fila 4: Estado (solo en edición) -->
        <div v-if="isEdit" class="col-12 md:col-6 px-2 pb-1">
          <div class="field">
            <label for="status" class="block text-900 font-medium mb-2">
              <i class="pi pi-check-circle mr-2"></i>Estado
            </label>
            <pv-dropdown
              id="status"
              v-model="verifierEntity.status"
              :options="statusOptions"
              class="w-full"
              size="small"
            />
          </div>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>