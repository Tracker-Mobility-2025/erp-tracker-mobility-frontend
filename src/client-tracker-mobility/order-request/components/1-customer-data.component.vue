<script>
export default {
  name: 'customer-data',
  
  components: {},
  
  inject: ['client', 'applicantCompany'],
  
  data() {
    return {
      customerContent: {
        title: 'Datos del cliente',
        nombresCompletos: 'Nombres completos',
        apellidosCompletos: 'Apellidos completos',
        tipoDocumento: 'Tipo de documento de identidad',
        numeroDocumento: 'N° de documento de identidad',
        numeroContacto: 'Número de contacto',
        botonSiguiente: 'Siguiente'
      },

      // listas
      tiposDocumento: [
        { label: 'DNI', value: 'DNI' },
        { label: 'PTP', value: 'PTP' },
        { label: 'Carnet de extranjería', value: 'CARNET_EXTRANJERIA' }
      ],

      // Control de validación
      touched: {
        name: false,
        lastName: false,
        documentType: false,
        documentNumber: false,
        phoneNumber: false
      },
      showValidation: false
    };
  },

  computed: {
    // ---- Validaciones básicas
    isPhoneValid(){
      const phone = this.client.phoneNumber;
      if (!phone) return false;
      const phoneStr = String(phone).replace(/[\s-]/g, ''); // Quitar espacios y guiones
      // Perú: 9 + 8 dígitos = 9 total
      return /^9\d{8}$/.test(phoneStr);
    },

    isDocValid(){
      const { documentType, documentNumber } = this.client;
      if (!documentType || !documentNumber) return false;
      const num = String(documentNumber).replace(/\s/g, '');
      if (documentType === 'DNI') return /^\d{8}$/.test(num);
      if (documentType === 'CARNET_EXTRANJERIA')  return /^\d{9,12}$/.test(num);
      if (documentType === 'PTP') return /^\d{9,12}$/.test(num);
      return false;
    },

    fieldErrors(){
      const errors = {};

      // ----- Datos del cliente
      if (this.touched.name || this.showValidation) {
        if (!this.client.name || this.client.name.trim().length < 2) {
          errors.name = 'Ingresa nombres válidos';
        }
      }

      if (this.touched.lastName || this.showValidation) {
        if (!this.client.lastName || this.client.lastName.trim().length < 2) {
          errors.lastName = 'Ingresa apellidos válidos';
        }
      }

      if (this.touched.documentType || this.showValidation) {
        if (!this.client.documentType) errors.documentType = 'Selecciona un tipo de documento';
      }

      if (this.touched.documentNumber || this.showValidation) {
        if (!this.client.documentNumber) {
          errors.documentNumber = 'El número de documento es obligatorio';
        } else if (!this.isDocValid) {
          errors.documentNumber = 'Número de documento inválido para el tipo seleccionado';
        }
      }

      if (this.touched.phoneNumber || this.showValidation) {
        if (!this.client.phoneNumber) {
          errors.phoneNumber = 'El número de contacto es obligatorio';
        } else if (!this.isPhoneValid) {
          errors.phoneNumber = 'El número debe iniciar con 9 y tener 9 dígitos';
        }
      }


      return errors;
    },

    isFormValid(){
      const basicOk =
          this.client.name &&
          this.client.lastName &&
          this.client.documentType &&
          this.client.documentNumber &&
          this.client.phoneNumber;

      return Boolean(
          basicOk &&
          this.isDocValid &&
          this.isPhoneValid &&
          Object.keys(this.fieldErrors).length === 0
      );
    }
  },



  methods: {
    onFieldBlur(fieldName){
      this.touched[fieldName] = true;
    },



    // ---- Foco en el primer error
    focusFirstError() {
      const first = Object.keys(this.fieldErrors)[0];
      if (!first) return;
      const idMap = {
        name: 'nombres',
        lastName: 'apellidos',
        documentType: 'tipo-doc',
        documentNumber: 'num-doc',
        phoneNumber: 'telefono'
      };
      this.$nextTick(() => {
        const el = document.getElementById(idMap[first] || 'nombres');
        if (el) el.focus();
      });
    },

    onNext(){
      this.showValidation = true;
      if (!this.isFormValid) {
        this.focusFirstError();
        return;
      }

      // Emitir evento para que el componente padre maneje la navegación
      this.$emit('next');
    }
  }

};

</script>

<template>
  <div class="flex justify-content-center w-full">
    <div class="form-wrapper p-3 w-full" style="max-width: 1200px;">
      <form class="formgrid grid p-fluid compact-form" @submit.prevent="onNext" @keydown.enter.prevent>
        <!-- ====== Título: Datos del cliente ====== -->
        <div class="col-12">
          <div class="flex align-items-center gap-2 mb-2">
            <i class="pi pi-user text-lg text-primary-local"></i>
            <h2 class="m-0 text-lg font-semibold text-primary-local">{{ customerContent.title }}</h2>
          </div>
        </div>

        <!-- Nombres -->
        <div class="field col-12 md:col-6">
          <label for="nombres" class="block mb-1 font-medium text-color text-sm">
            {{ customerContent.nombresCompletos }} <span class="text-red-500">*</span>
          </label>
          <pv-input-text
              id="nombres"
              v-model="client.name"
              placeholder="Ana María"
              class="w-full"
              :aria-invalid="!!fieldErrors.name"
              :aria-describedby="fieldErrors.name ? 'err-nombres' : null"
              @blur="onFieldBlur('name')"
          />
          <div class="error-container">
            <small
                v-if="(touched.name || showValidation) && fieldErrors.name"
                id="err-nombres"
                class="error-message"
            >{{ fieldErrors.name }}</small>
          </div>
        </div>

        <!-- Apellidos -->
        <div class="field col-12 md:col-6">
          <label for="apellidos" class="block mb-1 font-medium text-color text-sm">
            {{ customerContent.apellidosCompletos }} <span class="text-red-500">*</span>
          </label>
          <pv-input-text
              id="apellidos"
              v-model="client.lastName"
              placeholder="López Fernández"
              class="w-full input-compact"
              :aria-invalid="!!fieldErrors.lastName"
              :aria-describedby="fieldErrors.lastName ? 'err-apellidos' : null"
              @blur="onFieldBlur('lastName')"
          />
          <div class="error-container">
            <small
                v-if="(touched.lastName || showValidation) && fieldErrors.lastName"
                id="err-apellidos"
                class="error-message"
            >{{ fieldErrors.lastName }}</small>
          </div>
        </div>

        <!-- Tipo doc -->
        <div class="field col-12 md:col-6">
          <label for="tipo-doc" class="block mb-1 font-medium text-color text-sm">
            {{ customerContent.tipoDocumento }} <span class="text-red-500">*</span>
          </label>
          <pv-select
              id="tipo-doc"
              v-model="client.documentType"
              :options="tiposDocumento"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona"
              class="w-full"
              @blur="onFieldBlur('documentType')"
          />
          <div class="error-container">
            <small 
                v-if="(touched.documentType || showValidation) && fieldErrors.documentType" 
                class="error-message"
            >{{ fieldErrors.documentType }}</small>
          </div>
        </div>

        <!-- N° doc -->
        <div class="field col-12 md:col-6">
          <label for="num-doc" class="block mb-1 font-medium text-color text-sm">
            {{ customerContent.numeroDocumento }} <span class="text-red-500">*</span>
          </label>
          <pv-icon-field class="w-full">
            <pv-input-icon class="pi pi-id-card" />
            <pv-input-text
                id="num-doc"
                v-model="client.documentNumber"
                placeholder="12345678"
                class="w-full input-compact"
                :aria-invalid="!!fieldErrors.documentNumber"
                :aria-describedby="fieldErrors.documentNumber ? 'err-numdoc' : null"
                @blur="onFieldBlur('documentNumber')"
            />
          </pv-icon-field>
          <div class="error-container">
            <small
                v-if="(touched.documentNumber || showValidation) && fieldErrors.documentNumber"
                id="err-numdoc"
                class="error-message"
            >{{ fieldErrors.documentNumber }}</small>
          </div>
        </div>

        <!-- Teléfono -->
        <div class="field col-12 md:col-6">
          <label for="telefono" class="block mb-1 font-medium text-color text-sm">
            {{ customerContent.numeroContacto }} <span class="text-red-500">*</span>
          </label>
          <pv-icon-field class="w-full">
            <pv-input-icon class="pi pi-phone" />
            <pv-input-mask
                id="telefono"
                v-model="client.phoneNumber"
                mask="999 999 999"
                placeholder="999 888 777"
                class="w-full input-compact"
                :aria-invalid="!!fieldErrors.phoneNumber"
                :aria-describedby="fieldErrors.phoneNumber ? 'err-telefono' : null"
                @blur="onFieldBlur('phoneNumber')"
            />
          </pv-icon-field>
          <div class="error-container">
            <small
                v-if="(touched.phoneNumber || showValidation) && fieldErrors.phoneNumber"
                id="err-telefono"
                class="error-message"
            >{{ fieldErrors.phoneNumber }}</small>
          </div>
        </div>

        <!-- Acciones -->
        <div class="col-12 flex justify-content-end gap-2 mt-2">
          <pv-button 
              class="px-4 py-2 button-submit" 
              :label="customerContent.botonSiguiente" 
              type="submit" 
              :disabled="!isFormValid" 
          />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-wrapper {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.compact-form {
  row-gap: 0.5rem;
}

.formgrid {
  row-gap: 0.5rem;
}

.field {
  margin-bottom: 0;
}

/* Inputs más compactos */
.input-compact {
  font-size: 0.9rem;
}

.button-submit {
  background-color: var(--color-primary) !important;
  border-color: var(--color-primary) !important;
  color: var(--color-white) !important;
  font-weight: var(--font-weight-semibold) !important;
  transition: all 0.3s ease !important;
}

.button-submit:hover:not(:disabled) {
  background-color: var(--color-hover) !important;
  border-color: var(--color-hover) !important;
  transform: translateY(-1px);
  box-shadow: var(--shadow) !important;
}

.button-submit:disabled {
  background-color: var(--color-disabled) !important;
  border-color: var(--color-disabled) !important;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Asegurar que los iconos estén alineados correctamente */
:deep(.p-icon-field .p-input-icon) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.p-icon-field .p-inputtext),
:deep(.p-icon-field .p-inputmask) {
  padding-left: 2.5rem;
}

/* Colores corporativos para texto */
.text-primary-local {
  color: var(--color-primary) !important;
}

/* Contenedor de errores con altura fija para evitar saltos */
.error-container {
  min-height: 1.1rem;
  margin-top: 0.15rem;
}

.error-message {
  display: block;
  color: #DC2626 !important;
  font-size: 0.8rem;
  line-height: 1.1rem;
  font-weight: 500;
}
</style>
