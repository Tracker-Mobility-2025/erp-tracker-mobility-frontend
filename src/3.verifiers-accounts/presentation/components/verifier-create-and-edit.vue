<script setup>
import { ref, watch, computed } from 'vue';
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

// Validation methods
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

const isValidName = (name) => {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;
  return nameRegex.test(name.trim());
};

const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{9,15}$/;
  return phoneRegex.test(phone);
};

const isValidAgenda = (agenda) => {
  return agenda && agenda.trim().length >= 10;
};

const isFormValid = computed(() => {
  const emailValid = verifierEntity.value.email && isValidEmail(verifierEntity.value.email);
  const passwordValid = !props.isEdit ? 
    (verifierEntity.value.password && isValidPassword(verifierEntity.value.password)) : true;
  const nameValid = verifierEntity.value.name && isValidName(verifierEntity.value.name);
  const lastNameValid = verifierEntity.value.lastName && isValidName(verifierEntity.value.lastName);
  const phoneValid = verifierEntity.value.phoneNumber && isValidPhoneNumber(verifierEntity.value.phoneNumber);
  const agendaValid = verifierEntity.value.agenda && isValidAgenda(verifierEntity.value.agenda);
  
  return emailValid && passwordValid && nameValid && lastNameValid && phoneValid && agendaValid;
});

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
              :class="{ 'p-invalid': submitted && (!verifierEntity.name || !isValidName(verifierEntity.name)) }"
            />
            <small v-if="submitted && !verifierEntity.name" class="p-error">
              El nombre es requerido
            </small>
            <small v-else-if="submitted && verifierEntity.name && !isValidName(verifierEntity.name)" class="p-error">
              El nombre debe tener al menos 2 caracteres y solo contener letras
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
              :class="{ 'p-invalid': submitted && (!verifierEntity.lastName || !isValidName(verifierEntity.lastName)) }"
            />
            <small v-if="submitted && !verifierEntity.lastName" class="p-error">
              Los apellidos son requeridos
            </small>
            <small v-else-if="submitted && verifierEntity.lastName && !isValidName(verifierEntity.lastName)" class="p-error">
              Los apellidos deben tener al menos 2 caracteres y solo contener letras
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
              :class="{ 'p-invalid': submitted && (!verifierEntity.phoneNumber || !isValidPhoneNumber(verifierEntity.phoneNumber)) }"
            />
            <small v-if="submitted && !verifierEntity.phoneNumber" class="p-error">
              El teléfono es requerido
            </small>
            <small v-else-if="submitted && verifierEntity.phoneNumber && !isValidPhoneNumber(verifierEntity.phoneNumber)" class="p-error">
              Ingrese un número de teléfono válido (9-15 dígitos, solo números)
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
              :class="{ 'p-invalid': submitted && (!verifierEntity.agenda || !isValidAgenda(verifierEntity.agenda)) }"
            />
            <small v-if="submitted && !verifierEntity.agenda" class="p-error">
              El horario de trabajo es requerido
            </small>
            <small v-else-if="submitted && verifierEntity.agenda && !isValidAgenda(verifierEntity.agenda)" class="p-error">
              El horario debe tener al menos 10 caracteres (ej: Lunes 8:00-16:00)
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
              :class="{ 'p-invalid': submitted && (!verifierEntity.email || !isValidEmail(verifierEntity.email)) }"
            />
            <small v-if="submitted && !verifierEntity.email" class="p-error">
              El email es requerido
            </small>
            <small v-else-if="submitted && verifierEntity.email && !isValidEmail(verifierEntity.email)" class="p-error">
              Ingrese un email válido (ejemplo@dominio.com)
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
              :class="{ 'p-invalid': submitted && (!verifierEntity.password || !isValidPassword(verifierEntity.password)) }"
            />
            <small v-if="submitted && !verifierEntity.password" class="p-error">
              La contraseña es requerida
            </small>
            <small v-else-if="submitted && verifierEntity.password && !isValidPassword(verifierEntity.password)" class="p-error">
              La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y números
            </small>
          </div>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>

<style scoped>
</style>