<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: 'client-create-and-edit',
  components: {CreateAndEdit},

  props: {
    edit: Boolean,
    item: null,
    visible: Boolean
  },

  data() {
    return {
      submitted: false,
      clientEntity: {
        RUC: '',
        companyName: '',
        role: 'CLIENTE',
        status: 'ACTIVE'
      }
    };
  },

  watch: {
    // Cuando se abra para editar, cargar los datos del cliente
    visible(newValue) {
      if (newValue && this.edit && this.item) {
        this.clientEntity = {
          RUC: this.item.RUC || '',
          companyName: this.item.companyName || '',
          role: this.item.role || 'CLIENTE',
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
        // Si es edición, incluir el ID
        const clientData = { ...this.clientEntity };
        if (this.edit && this.item) {
          clientData.id = this.item.id;
        }
        
        this.$emit('save-requested', clientData);
        this.resetForm();
      }
    },

    isFormValid() {
      const rucValid = this.clientEntity.RUC && this.isValidRUC(this.clientEntity.RUC);
      const companyNameValid = this.clientEntity.companyName && this.isValidCompanyName(this.clientEntity.companyName);
      
      return rucValid && companyNameValid;
    },

    isValidRUC(ruc) {
      // RUC peruano: 11 dígitos numéricos
      const rucRegex = /^[0-9]{11}$/;
      return rucRegex.test(ruc);
    },

    isValidCompanyName(name) {
      // Al menos 2 caracteres, permitir letras, números, espacios y algunos caracteres especiales
      const nameRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\.\-&]{2,}$/;
      return nameRegex.test(name.trim());
    },

    resetForm() {
      this.clientEntity = {
        RUC: '',
        companyName: '',
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

        <!-- ======== Fila 1: RUC ======== -->
        <div class="col-12 px-2 pb-1">
          <div class="field">
            <label for="ruc" class="block text-900 font-medium mb-2">
              <i class="pi pi-id-card mr-2"></i>RUC *
            </label>
            <pv-input-text
                id="ruc"
                v-model="clientEntity.RUC"
                class="w-full"
                size="small"
                placeholder="Ingrese el RUC (11 dígitos)"
                maxlength="11"
                :aria-invalid="submitted && (!clientEntity.RUC || !isValidRUC(clientEntity.RUC))"
                aria-describedby="ruc-error"
                :class="{ 'p-invalid': submitted && (!clientEntity.RUC || !isValidRUC(clientEntity.RUC)) }"
            />
            <small v-if="submitted && !clientEntity.RUC" class="p-error">
              El RUC es requerido
            </small>
            <small v-else-if="submitted && clientEntity.RUC && !isValidRUC(clientEntity.RUC)" 
                   class="p-error">
              El RUC debe tener exactamente 11 dígitos numéricos
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
                :aria-invalid="submitted && (!clientEntity.companyName || !isValidCompanyName(clientEntity.companyName))"
                aria-describedby="companyName-error"
                :class="{ 'p-invalid': submitted && (!clientEntity.companyName || !isValidCompanyName(clientEntity.companyName)) }"
            />
            <small v-if="submitted && !clientEntity.companyName" class="p-error">
              El nombre de la empresa es requerido
            </small>
            <small v-else-if="submitted && clientEntity.companyName && !isValidCompanyName(clientEntity.companyName)" 
                   class="p-error">
              El nombre debe tener al menos 2 caracteres y contener solo letras, números y caracteres básicos
            </small>
          </div>
        </div>

        <!-- ======== Fila 3: Estado (solo en edición) ======== -->
        <div v-if="edit" class="col-12 px-2 pb-1">
          <div class="field">
            <label for="status" class="block text-900 font-medium mb-2">
              <i class="pi pi-info-circle mr-2"></i>Estado
            </label>
            <pv-dropdown
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