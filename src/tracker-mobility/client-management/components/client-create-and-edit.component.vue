<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: 'client-create-and-edit',
  components: {CreateAndEdit},

  props: {
    edit: Boolean,
    item: null, // Cliente a editar
    visible: Boolean
  },

  data() {
    return {
      submitted: false,
      clientEntity: null,
    };
  },

  watch: {
    // Cuando se abra para editar, cargar los datos del cliente
    visible(newValue) {
      if (newValue && this.edit && this.item) {
        this.clientEntity = {
          ruc: this.item.ruc || '',
          companyName: this.item.companyName || '',
          password: '', // No cargar password existente por seguridad
          status: this.item.status || 'ACTIVE'
        };
      } else if (newValue && !this.edit) {
        // Para crear nuevo cliente, resetear el formulario
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
        // Preparar datos del cliente
        const clientData = { ...this.clientEntity };
        
        // Si es edición, incluir el ID
        if (this.edit && this.item) {
          clientData.id = this.item.id;
          
          // Si no se proporciona password en modo edición, no incluirla en los datos
          if (!clientData.password || clientData.password.trim() === '') {
            delete clientData.password;
          }
        }
        
        this.$emit('save-requested', clientData);
        this.resetForm();
      }
    },

    isFormValid() {
      const rucValid = this.clientEntity.ruc && this.isValidruc(this.clientEntity.ruc);
      const executiveNameValid = this.clientEntity.companyName && this.isValidcompanyName(this.clientEntity.companyName);
      
      // Password validation logic:
      // - Creating new client: password is required
      // - Editing existing client: password is optional (only validate if provided)
      let passwordValid = true;
      if (!this.edit) {
        // Creating: password required and must be valid
        passwordValid = this.clientEntity.password && this.isValidPassword(this.clientEntity.password);
      } else {
        // Editing: if password is provided, it must be valid; if empty, it's ok
        passwordValid = !this.clientEntity.password || this.isValidPassword(this.clientEntity.password);
      }
      
      return rucValid && companyNameValid && passwordValid;
    },

    isValidruc(ruc) {
      // ruc peruano: 11 dígitos numéricos
      const rucRegex = /^[0-9]{11}$/;
      return rucRegex.test(ruc);
    },

    isValidcompanyName(name) {
      // Al menos 2 caracteres, permitir letras, números, espacios y algunos caracteres especiales
      const nameRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\.\-&]{2,}$/;
      return nameRegex.test(name.trim());
    },

    isValidPassword(password) {
      // Al menos 8 caracteres, al menos una letra y un número
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
      return passwordRegex.test(password);
    },

    resetForm() {
      this.clientEntity = {
        ruc: '',
        companyName: '',
        password: '',
        role: 'CLIENTE',
        status: 'ACTIVE'
      };
      this.submitted = false;
    }

  },

  created() {
    console.log('Client Create and Edit Dialog component created');
  }

};

</script>

<template>

  <create-and-edit 
    :entity="clientEntity" 
    :visible="visible" 
    entity-name="cliente" 
    :edit="edit" 
    size="standard"
    @canceled-shared="cancelRequested" 
    @saved-shared="saveRequested"
  >

    <template #content>
      <div class="grid p-2">

        <!-- ======== Fila 1: ruc ======== -->
        <div class="col-12 px-2 pb-1">
          <div class="field">
            <label for="ruc" class="block text-900 font-medium mb-2">
              <i class="pi pi-id-card mr-2"></i>ruc *
            </label>
            <pv-input-text
                id="ruc"
                v-model="clientEntity.ruc"
                class="w-full"
                size="small"
                placeholder="Ingrese el ruc (11 dígitos)"
                maxlength="11"
                :aria-invalid="submitted && (!clientEntity.ruc || !isValidruc(clientEntity.ruc))"
                aria-describedby="ruc-error"
                :class="{ 'p-invalid': submitted && (!clientEntity.ruc || !isValidruc(clientEntity.ruc)) }"
            />
            <small v-if="submitted && !clientEntity.ruc" class="p-error">
              El ruc es requerido
            </small>
            <small v-else-if="submitted && clientEntity.ruc && !isValidruc(clientEntity.ruc)"
                   class="p-error">
              El ruc debe tener exactamente 11 dígitos numéricos
            </small>
          </div>
        </div>

        <!-- ======== Fila 2: Nombre de la empresa ======== -->
        <div class="col-12 px-2 pb-1">
          <div class="field">
            <label for="companyName" class="block text-900 font-medium mb-2">
              <i class="pi pi-building mr-2"></i>Nombre de la empresa *
            </label>
            <pv-input-text
                id="companyName"
                v-model="clientEntity.companyName"
                class="w-full"
                size="small"
                placeholder="Ingrese el nombre de la empresa"
                :aria-invalid="submitted && (!clientEntity.companyName || !isValidcompanyName(clientEntity.companyName))"
                aria-describedby="companyName-error"
                :class="{ 'p-invalid': submitted && (!clientEntity.companyName || !isValidcompanyName(clientEntity.companyName)) }"
            />
            <small v-if="submitted && !clientEntity.companyName" class="p-error">
              El nombre de la empresa es requerido
            </small>
            <small v-else-if="submitted && clientEntity.companyName && !isValidcompanyName(clientEntity.companyName)"
                   class="p-error">
              El nombre debe tener al menos 2 caracteres y contener solo letras, números y caracteres básicos
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
                v-model="clientEntity.password"
                class="w-full"
                input-class="w-full"
                :placeholder="edit ? 'Dejar vacío para mantener contraseña actual' : 'Ingrese la contraseña'"
                :feedback="false"
                toggle-mask
                :aria-invalid="submitted && ((!edit && !clientEntity.password) || (clientEntity.password && !isValidPassword(clientEntity.password)))"
                aria-describedby="password-error"
                :class="{ 'p-invalid': submitted && ((!edit && !clientEntity.password) || (clientEntity.password && !isValidPassword(clientEntity.password))) }"
            />
            <small v-if="submitted && !edit && !clientEntity.password" class="p-error">
              La contraseña es requerida para crear un nuevo cliente
            </small>
            <small v-else-if="submitted && clientEntity.password && !isValidPassword(clientEntity.password)"
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
            <pv-select
                id="status"
                v-model="clientEntity.status"
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