<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: 'verifier-create-and-edit',
  components: {CreateAndEdit},

  props: {
    edit: Boolean,
    item: null,
    visible: Boolean
  },

  data() {
    return {
      submitted: false,
      verifierEntity: {
        email: '',
        password: '',
        name: '',
        lastName: '',
        phoneNumber: '',
        agenda: ''
      }
    };
  },


  methods: {

    cancelRequested() {
      this.submitted = false;
      this.resetForm();
      this.$emit('cancel-requested');
    },

    saveRequested() {
      this.submitted = true;
      
      // Validar campos requeridos
      if (this.isFormValid()) {
        this.$emit('save-requested', this.verifierEntity);
        this.resetForm();
      }
    },

    isFormValid() {
      const emailValid = this.verifierEntity.email && this.isValidEmail(this.verifierEntity.email);
      const passwordValid = !this.edit ? (this.verifierEntity.password && this.isValidPassword(this.verifierEntity.password)) : true;
      const nameValid = this.verifierEntity.name && this.isValidName(this.verifierEntity.name);
      const lastNameValid = this.verifierEntity.lastName && this.isValidName(this.verifierEntity.lastName);
      const phoneValid = this.verifierEntity.phoneNumber && this.isValidPhoneNumber(this.verifierEntity.phoneNumber);
      const agendaValid = this.verifierEntity.agenda && this.isValidAgenda(this.verifierEntity.agenda);
      
      return emailValid && passwordValid && nameValid && lastNameValid && phoneValid && agendaValid;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    isValidPassword(password) {
      // Al menos 8 caracteres, una mayúscula, una minúscula y un número
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      return passwordRegex.test(password);
    },

    isValidName(name) {
      // Al menos 2 caracteres, solo letras y espacios
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;
      return nameRegex.test(name.trim());
    },

    isValidPhoneNumber(phone) {
      const phoneRegex = /^[0-9]{9,15}$/;
      return phoneRegex.test(phone);
    },

    isValidAgenda(agenda) {
      // Al menos 10 caracteres para describir un horario básico
      return agenda && agenda.trim().length >= 10;
    },

    resetForm() {
      this.verifierEntity = {
        email: '',
        password: '',
        name: '',
        lastName: '',
        phoneNumber: '',
        agenda: ''
      };
      this.submitted = false;
    }

  },

  created() {
    console.log('Verifier Create and Edit Dialog component created');
  }

};

</script>

<template>


  <create-and-edit :entity="verifierEntity" :visible="visible" entity-name="verificador" :edit="edit" size="standard"
                   @canceled-shared="cancelRequested" @saved-shared="saveRequested">

    <template #content>
      <div class="grid p-2">

        <!-- ======== Fila 1: Nombre y Apellidos ======== -->
        <!-- Columna 1: Nombre -->
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
                :aria-invalid="submitted && (!verifierEntity.name || !isValidName(verifierEntity.name))"
                aria-describedby="name-error"
                :class="{ 'p-invalid': submitted && (!verifierEntity.name || !isValidName(verifierEntity.name)) }"
            />
            <small v-if="submitted && !verifierEntity.name" class="p-error">
              El nombre es requerido
            </small>
            <small v-else-if="submitted && verifierEntity.name && !isValidName(verifierEntity.name)" 
                   class="p-error">
              El nombre debe tener al menos 2 caracteres y solo contener letras
            </small>
          </div>
        </div>
        <!-- Columna 2: Apellidos -->
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
                :aria-invalid="submitted && (!verifierEntity.lastName || !isValidName(verifierEntity.lastName))"
                aria-describedby="lastName-error"
                :class="{ 'p-invalid': submitted && (!verifierEntity.lastName || !isValidName(verifierEntity.lastName)) }"
            />
            <small v-if="submitted && !verifierEntity.lastName" class="p-error">
              Los apellidos son requeridos
            </small>
            <small v-else-if="submitted && verifierEntity.lastName && !isValidName(verifierEntity.lastName)" 
                   class="p-error">
              Los apellidos deben tener al menos 2 caracteres y solo contener letras
            </small>
          </div>
        </div>
        <!-- =========================================== -->

        <!-- ======== Fila 2: Teléfono y Agenda ======== -->
        <!-- Columna 1: Teléfono -->
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
                :aria-invalid="submitted && (!verifierEntity.phoneNumber || !isValidPhoneNumber(verifierEntity.phoneNumber))"
                aria-describedby="phoneNumber-error"
                :class="{ 'p-invalid': submitted && (!verifierEntity.phoneNumber || !isValidPhoneNumber(verifierEntity.phoneNumber)) }"
            />
            <small v-if="submitted && !verifierEntity.phoneNumber" class="p-error">
              El teléfono es requerido
            </small>
            <small v-else-if="submitted && verifierEntity.phoneNumber && !isValidPhoneNumber(verifierEntity.phoneNumber)"
                   class="p-error">
              Ingrese un número de teléfono válido (9-15 dígitos, solo números)
            </small>
          </div>
        </div>
        <!-- Columna 2: Agenda -->
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
                :aria-invalid="submitted && (!verifierEntity.agenda || !isValidAgenda(verifierEntity.agenda))"
                aria-describedby="agenda-error"
                :class="{ 'p-invalid': submitted && (!verifierEntity.agenda || !isValidAgenda(verifierEntity.agenda)) }"
            />
            <small v-if="submitted && !verifierEntity.agenda" class="p-error">
              El horario de trabajo es requerido
            </small>
            <small v-else-if="submitted && verifierEntity.agenda && !isValidAgenda(verifierEntity.agenda)"
                   class="p-error">
              El horario debe tener al menos 10 caracteres (ej: Lunes 8:00-16:00)
            </small>
          </div>
        </div>
        <!-- =========================================== -->

        <!-- ======== Fila 3: Email y Contraseña ======== -->
        <!-- Columna 1: Email -->
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
                :aria-invalid="submitted && (!verifierEntity.email || !isValidEmail(verifierEntity.email))"
                aria-describedby="email-error"
                :class="{ 'p-invalid': submitted && (!verifierEntity.email || !isValidEmail(verifierEntity.email)) }"
            />
            <small v-if="submitted && !verifierEntity.email" class="p-error">
              El email es requerido
            </small>
            <small v-else-if="submitted && verifierEntity.email && !isValidEmail(verifierEntity.email)"
                   class="p-error">
              Ingrese un email válido (ejemplo@dominio.com)
            </small>
          </div>
        </div>
        <!-- Columna 2: Contraseña -->
        <div class="col-12 md:col-6 px-2 pb-1" v-if="!edit">
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
                :aria-invalid="submitted && (!verifierEntity.password || !isValidPassword(verifierEntity.password))"
                aria-describedby="password-error"
                :inputStyle="{ width: '100%' }"
                :class="{ 'p-invalid': submitted && (!verifierEntity.password || !isValidPassword(verifierEntity.password)) }"
            />
            <small v-if="submitted && !verifierEntity.password" class="p-error">
              La contraseña es requerida
            </small>
            <small v-else-if="submitted && verifierEntity.password && !isValidPassword(verifierEntity.password)"
                   class="p-error">
              La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y números
            </small>
          </div>
        </div>
        <!-- =========================================== -->


      </div>
    </template>

  </create-and-edit>

</template>

<style scoped>

</style>