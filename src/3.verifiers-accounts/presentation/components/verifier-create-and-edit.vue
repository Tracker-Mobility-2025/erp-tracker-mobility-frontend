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
  agenda: ''
});

// Watch para sincronizar props con el formulario
watch(() => props.verifier, (newVerifier) => {
  if (newVerifier) {
    verifierEntity.value = {
      email: newVerifier.email || '',
      password: newVerifier.password || '',
      name: newVerifier.name || '',
      lastName: newVerifier.lastName || '',
      phoneNumber: newVerifier.phoneNumber || '',
      agenda: newVerifier.agenda || ''
    };
  }
}, { immediate: true, deep: true });

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
  
  if (isFormValid.value) {
    emit('save', { ...verifierEntity.value });
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
    agenda: ''
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

        <div v-if="!isEdit" class="col-12 md:col-6 px-2 pb-1">
          <div class="field">
            <label for="password" class="block text-900 font-medium mb-2">
              <i class="pi pi-key mr-2"></i>Contraseña *
            </label>
            <pv-password
              id="password"
              v-model="verifierEntity.password"
              inputClass="w-full"
              class="w-full"
              size="small"
              toggleMask
              :feedback="false"
              placeholder="Ingrese una contraseña segura"
              :inputStyle="{ width: '100%' }"
              :class="{ 'p-invalid': submitted && !passwordValidation.valid }"
            />
            <small v-if="submitted && !passwordValidation.valid" class="p-error">
              {{ passwordValidation.message }}
            </small>
          </div>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>