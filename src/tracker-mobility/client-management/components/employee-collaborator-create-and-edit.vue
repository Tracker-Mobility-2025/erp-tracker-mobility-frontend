<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";
import {EmployeeClientTracker} from "../models/employees-client.entity.js";
import {CreateEmployeeClient} from "../models/create-employees-client.entity.js";

export default {
  name: 'employee-collaborator-create-and-edit',
  components: {CreateAndEdit},

  props: {
    edit: Boolean,
    item: null, // Empleado a editar
    visible: Boolean,
    clientId: {
      type: [String, Number],
      required: true,
    },
  },

  data() {
    return {
      submitted: false,
      employeeEntity: null,
    };
  },

  watch: {
    // Cuando se abra para editar, cargar los datos del empleado
    visible(newValue) {
      if (newValue && this.edit && this.item) {
        this.employeeEntity = {
          name: this.item.name || '',
          lastName: this.item.lastName || '',
          email: this.item.email || '',
          phone: this.item.phone || '',
          password: '', // No cargar password existente por seguridad
          status: this.item.status || 'ACTIVE'
        };
      } else if (newValue && !this.edit) {
        // Para crear nuevo empleado, resetear el formulario
        this.resetForm();
      }
    }
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
        let employeeData;
        
        if (this.edit) {
          // Para edición, preparar datos del empleado
          employeeData = { ...this.employeeEntity };
          
          // Incluir el ID del empleado
          if (this.item) {
            employeeData.id = this.item.id;
          }
          
          // Si no se proporciona password en modo edición, no incluirla en los datos
          if (!employeeData.password || employeeData.password.trim() === '') {
            delete employeeData.password;
          }
        } else {
          // Para creación, usar el modelo CreateEmployeeClient
          employeeData = new CreateEmployeeClient({
            email: this.employeeEntity.email,
            password: this.employeeEntity.password,
            name: this.employeeEntity.name,
            lastName: this.employeeEntity.lastName,
            applicantCompanyId: this.clientId,
          });
        }
        
        this.$emit('save-requested', employeeData);
        this.resetForm();
      }
    },

    isFormValid() {
      const nameValid = this.employeeEntity.name && this.isValidName(this.employeeEntity.name);
      const lastNameValid = this.employeeEntity.lastName && this.isValidName(this.employeeEntity.lastName);
      const emailValid = this.employeeEntity.email && this.isValidEmail(this.employeeEntity.email);
      const phoneValid = this.employeeEntity.phone && this.isValidPhone(this.employeeEntity.phone);
      
      // Password validation logic:
      // - Creating new employee: password is required
      // - Editing existing employee: password is optional (only validate if provided)
      let passwordValid = true;
      if (!this.edit) {
        // Creating: password required and must be valid
        passwordValid = this.employeeEntity.password && this.isValidPassword(this.employeeEntity.password);
      } else {
        // Editing: if password is provided, it must be valid; if empty, it's ok
        passwordValid = !this.employeeEntity.password || this.isValidPassword(this.employeeEntity.password);
      }
      
      return nameValid && lastNameValid && emailValid && phoneValid && passwordValid;
    },

    isValidName(name) {
      // Al menos 2 caracteres, permitir letras, espacios y acentos
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;
      return nameRegex.test(name.trim());
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    isValidPhone(phone) {
      // Permitir números, espacios, guiones y paréntesis, mínimo 9 dígitos
      const phoneRegex = /^[\d\s\-\(\)\+]{9,}$/;
      return phoneRegex.test(phone);
    },

    isValidPassword(password) {
      // Al menos 8 caracteres, al menos una letra y un número
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
      return passwordRegex.test(password);
    },

    resetForm() {
      this.employeeEntity = {
        name: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        status: 'ACTIVE'
      };
      this.submitted = false;
    }

  },

  created() {
    console.log('Employee Create and Edit Dialog component created');
  }

};
</script>

<template>

  <create-and-edit 
    :entity="employeeEntity" 
    :visible="visible" 
    entity-name="colaborador" 
    :edit="edit" 
    size="standard"
    @canceled-shared="cancelRequested" 
    @saved-shared="saveRequested"
  >

    <template #content>
      <div class="grid p-2">

        <!-- ======== Fila 1: Nombres ======== -->
        <div class="col-12 md:col-6 px-2 pb-1">
          <div class="field">
            <label for="name" class="block text-900 font-medium mb-2">
              <i class="pi pi-user mr-2"></i>Nombres *
            </label>
            <pv-input-text
                id="name"
                v-model="employeeEntity.name"
                class="w-full"
                size="small"
                placeholder="Ingrese los nombres"
                :aria-invalid="submitted && (!employeeEntity.name || !isValidName(employeeEntity.name))"
                aria-describedby="name-error"
                :class="{ 'p-invalid': submitted && (!employeeEntity.name || !isValidName(employeeEntity.name)) }"
            />
            <small v-if="submitted && !employeeEntity.name" class="p-error">
              Los nombres son requeridos
            </small>
            <small v-else-if="submitted && employeeEntity.name && !isValidName(employeeEntity.name)"
                   class="p-error">
              Los nombres deben tener al menos 2 caracteres y contener solo letras
            </small>
          </div>
        </div>

        <!-- ======== Fila 1: Apellidos ======== -->
        <div class="col-12 md:col-6 px-2 pb-1">
          <div class="field">
            <label for="lastName" class="block text-900 font-medium mb-2">
              <i class="pi pi-user mr-2"></i>Apellidos *
            </label>
            <pv-input-text
                id="lastName"
                v-model="employeeEntity.lastName"
                class="w-full"
                size="small"
                placeholder="Ingrese los apellidos"
                :aria-invalid="submitted && (!employeeEntity.lastName || !isValidName(employeeEntity.lastName))"
                aria-describedby="lastName-error"
                :class="{ 'p-invalid': submitted && (!employeeEntity.lastName || !isValidName(employeeEntity.lastName)) }"
            />
            <small v-if="submitted && !employeeEntity.lastName" class="p-error">
              Los apellidos son requeridos
            </small>
            <small v-else-if="submitted && employeeEntity.lastName && !isValidName(employeeEntity.lastName)"
                   class="p-error">
              Los apellidos deben tener al menos 2 caracteres y contener solo letras
            </small>
          </div>
        </div>

        <!-- ======== Fila 2: Email ======== -->
        <div class="col-12 md:col-6 px-2 pb-1">
          <div class="field">
            <label for="email" class="block text-900 font-medium mb-2">
              <i class="pi pi-envelope mr-2"></i>Email *
            </label>
            <pv-input-text
                id="email"
                v-model="employeeEntity.email"
                class="w-full"
                size="small"
                placeholder="Ingrese el email"
                type="email"
                :aria-invalid="submitted && (!employeeEntity.email || !isValidEmail(employeeEntity.email))"
                aria-describedby="email-error"
                :class="{ 'p-invalid': submitted && (!employeeEntity.email || !isValidEmail(employeeEntity.email)) }"
            />
            <small v-if="submitted && !employeeEntity.email" class="p-error">
              El email es requerido
            </small>
            <small v-else-if="submitted && employeeEntity.email && !isValidEmail(employeeEntity.email)"
                   class="p-error">
              El email no tiene un formato válido
            </small>
          </div>
        </div>

        <!-- ======== Fila 2: Teléfono ======== -->
        <div class="col-12 md:col-6 px-2 pb-1">
          <div class="field">
            <label for="phone" class="block text-900 font-medium mb-2">
              <i class="pi pi-phone mr-2"></i>Teléfono *
            </label>
            <pv-input-text
                id="phone"
                v-model="employeeEntity.phone"
                class="w-full"
                size="small"
                placeholder="Ingrese el teléfono"
                :aria-invalid="submitted && (!employeeEntity.phone || !isValidPhone(employeeEntity.phone))"
                aria-describedby="phone-error"
                :class="{ 'p-invalid': submitted && (!employeeEntity.phone || !isValidPhone(employeeEntity.phone)) }"
            />
            <small v-if="submitted && !employeeEntity.phone" class="p-error">
              El teléfono es requerido
            </small>
            <small v-else-if="submitted && employeeEntity.phone && !isValidPhone(employeeEntity.phone)"
                   class="p-error">
              El teléfono debe tener al menos 9 dígitos
            </small>
          </div>
        </div>

        <!-- ======== Fila 3: Password ======== -->
        <div class="col-12 px-2 pb-1">
          <div class="field">
            <label for="password" class="block text-900 font-medium mb-2">
              <i class="pi pi-lock mr-2"></i>Contraseña {{ !edit ? '*' : '(cambiar)' }}
            </label>
            <pv-password
                id="password"
                v-model="employeeEntity.password"
                class="w-full"
                input-class="w-full"
                :placeholder="edit ? 'Dejar vacío para mantener contraseña actual' : 'Ingrese la contraseña'"
                :feedback="false"
                toggle-mask
                :aria-invalid="submitted && ((!edit && !employeeEntity.password) || (employeeEntity.password && !isValidPassword(employeeEntity.password)))"
                aria-describedby="password-error"
                :class="{ 'p-invalid': submitted && ((!edit && !employeeEntity.password) || (employeeEntity.password && !isValidPassword(employeeEntity.password))) }"
            />
            <small v-if="submitted && !edit && !employeeEntity.password" class="p-error">
              La contraseña es requerida para crear un nuevo colaborador
            </small>
            <small v-else-if="submitted && employeeEntity.password && !isValidPassword(employeeEntity.password)"
                   class="p-error">
              La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra y un número
            </small>
          </div>
        </div>

        <!-- ======== Fila 4: Estado (solo en edición) ======== -->
        <div v-if="edit" class="col-12 px-2 pb-1">
          <div class="field">
            <label for="status" class="block text-900 font-medium mb-2">
              <i class="pi pi-info-circle mr-2"></i>Estado
            </label>
            <pv-dropdown
                id="status"
                v-model="employeeEntity.status"
                :options="[
                  { label: 'Activo', value: 'ACTIVE' },
                  { label: 'Inactivo', value: 'INACTIVE' }
                ]"
                option-label="label"
                option-value="value"
                placeholder="Seleccione el estado"
                class="w-full"
            />
          </div>
        </div>

      </div>
    </template>

  </create-and-edit>

</template>

<style scoped>

</style>