<script>
export default {
  name: 'request-service-business',
  components: {},

  inject: ['serviceRequest'],

  data () {
    return {
      touched: {},
      showValidation: false,

      petitionerContent: {
        title: 'Datos del solicitante',
        ruc: 'RUC',
        razonSocial: 'Razón social',
        nombreEjecutivo: 'Nombre del ejecutivo',
        correoCorporativo: 'Correo corporativo',
        numeroContacto: 'Número de contacto',
        botonSiguiente: 'Siguiente',
        botonCancelar: 'Cancelar',
      }
    };
  },

  computed: {
    isEmailValid(){
      const email = this.serviceRequest.petitionerData?.correoCorporativo;
      if (!email) return false;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    },

    isPhoneValid() {
      const phone = (this.serviceRequest.petitionerData?.numeroContacto || '').toString().replace(/\s/g, '');
      // Perú: 9 dígitos iniciando en 9
      return /^9\d{8}$/.test(phone);
    },

    isRucValid() {
      const ruc = (this.serviceRequest.petitionerData?.ruc || '').toString();
      if (!/^\d{11}$/.test(ruc)) return false;
      // Dígito verificador SUNAT (módulo 11) para los 10 primeros dígitos
      const factors = [5,4,3,2,7,6,5,4,3,2];
      const sum = ruc.substr(0,10).split('').reduce((acc, d, i) => acc + Number(d) * factors[i], 0);
      const mod = 11 - (sum % 11);
      const dv = (mod === 10) ? 0 : (mod === 11) ? 1 : mod;
      return dv === Number(ruc[10]);
    },

    fieldErrors(){
      const errors = {};
      const data = this.serviceRequest.petitionerData || {};

      // RUC
      if (this.touched.ruc || this.showValidation) {
        const ruc = (data.ruc || '').toString();
        if (!ruc) {
          errors.ruc = 'El RUC es obligatorio';
        } else if (!/^\d{11}$/.test(ruc)) {
          errors.ruc = 'El RUC debe tener 11 dígitos';
        } else if (!this.isRucValid) {
          errors.ruc = 'El RUC no supera la validación (dígito verificador)';
        }
      }

      // Razón Social
      if (this.touched.razonSocial || this.showValidation) {
        const rs = (data.razonSocial || '').trim();
        if (!rs) {
          errors.razonSocial = 'La razón social es obligatoria';
        } else if (rs.length < 3) {
          errors.razonSocial = 'La razón social debe tener al menos 3 caracteres';
        }
      }

      // Nombre Ejecutivo
      if (this.touched.nombreEjecutivo || this.showValidation) {
        const nj = (data.nombreEjecutivo || '').trim();
        if (!nj) {
          errors.nombreEjecutivo = 'El nombre del ejecutivo es obligatorio';
        } else if (nj.length < 2) {
          errors.nombreEjecutivo = 'El nombre debe tener al menos 2 caracteres';
        }
      }

      // Correo
      if (this.touched.correoCorporativo || this.showValidation) {
        const mail = (data.correoCorporativo || '').trim();
        if (!mail) {
          errors.correoCorporativo = 'El correo corporativo es obligatorio';
        } else if (!this.isEmailValid) {
          errors.correoCorporativo = 'Ingrese un correo electrónico válido';
        }
      }

      // Teléfono
      if (this.touched.numeroContacto || this.showValidation) {
        const phone = (data.numeroContacto || '').toString().replace(/\s/g, '');
        if (!phone) {
          errors.numeroContacto = 'El número de contacto es obligatorio';
        } else if (!this.isPhoneValid) {
          errors.numeroContacto = 'El número debe iniciar con 9 y tener 9 dígitos';
        }
      }

      return errors;
    },

    isFormValid(){
      // Fuente única de verdad: no hay errores
      return Object.keys(this.fieldErrors).length === 0;
    }
  },

  methods: {
    onFieldBlur(fieldName) {
      this.touched[fieldName] = true;
    },

    focusFirstError() {
      const order = ['ruc','razonSocial','nombreEjecutivo','correoCorporativo','numeroContacto'];
      for (const field of order) {
        if (this.fieldErrors[field]) {
          const refMap = {
            ruc: 'rucRef',
            razonSocial: 'razonRef',
            nombreEjecutivo: 'ejecutivoRef',
            correoCorporativo: 'correoRef',
            numeroContacto: 'telefonoRef',
          };
          this.$nextTick(() => this.$refs[refMap[field]]?.focus && this.$refs[refMap[field]].focus());
          break;
        }
      }
    },

    onNext() {
      this.showValidation = true;
      if (Object.keys(this.fieldErrors).length) {
        this.focusFirstError();
        return;
      }
      this.$router.push({ name: 'customer-data' });
    }
  },

  created() {
    // Inicializar y normalizar
    if (!this.serviceRequest.petitionerData) {
      this.serviceRequest.petitionerData = {};
    } else {
      if (this.serviceRequest.petitionerData.ruc != null) {
        this.serviceRequest.petitionerData.ruc = String(this.serviceRequest.petitionerData.ruc).replace(/\D/g,'').slice(0,11);
      }
      if (this.serviceRequest.petitionerData.numeroContacto != null) {
        this.serviceRequest.petitionerData.numeroContacto = String(this.serviceRequest.petitionerData.numeroContacto);
      }
    }
  }
};
</script>

<template>
  <div class="page-container">
    <div class="petitioner-form p-4">
      <!-- Título -->
      <div class="flex align-items-center gap-2 mb-4">
        <i class="pi pi-building text-primary text-2xl"></i>
        <h2 class="m-0 text-2xl font-semibold">{{petitionerContent.title}}</h2>
      </div>

      <form
          class="grid"
          @submit.prevent="onNext"
          @keydown.enter.prevent
          novalidate
      >
        <!-- RUC -->
        <div class="field col-12 md:col-6">
          <label for="ruc" class="font-medium">
            RUC <span class="text-red-500">*</span>
          </label>
          <pv-input-text
              id="ruc"
              ref="rucRef"
              v-model.trim="serviceRequest.petitionerData.ruc"
              inputmode="numeric"
              pattern="\d*"
              maxlength="11"
              placeholder="12345678901"
              class="w-full"
              @input="serviceRequest.petitionerData.ruc = (serviceRequest.petitionerData.ruc || '').replace(/\D/g,'').slice(0,11)"
              @blur="onFieldBlur('ruc')"
              :aria-invalid="!!((touched.ruc || showValidation) && fieldErrors.ruc)"
              :aria-describedby="(touched.ruc || showValidation) && fieldErrors.ruc ? 'err-ruc' : undefined"
          />
          <small
              v-if="(touched.ruc || showValidation) && fieldErrors.ruc"
              id="err-ruc"
              class="text-red-500"
              role="alert"
              aria-live="polite"
          >{{ fieldErrors.ruc }}</small>
        </div>

        <!-- Razón social -->
        <div class="field col-12 md:col-6">
          <label for="razon" class="font-medium">
            {{petitionerContent.razonSocial}} <span class="text-red-500">*</span>
          </label>
          <pv-input-text
              id="razon"
              ref="razonRef"
              v-model.trim="serviceRequest.petitionerData.razonSocial"
              placeholder="Tracker Mobility S.A.C"
              class="w-full"
              @blur="onFieldBlur('razonSocial')"
              :aria-invalid="!!((touched.razonSocial || showValidation) && fieldErrors.razonSocial)"
              :aria-describedby="(touched.razonSocial || showValidation) && fieldErrors.razonSocial ? 'err-razon' : undefined"
          />
          <small
              v-if="(touched.razonSocial || showValidation) && fieldErrors.razonSocial"
              id="err-razon"
              class="text-red-500"
              role="alert"
              aria-live="polite"
          >{{ fieldErrors.razonSocial }}</small>
        </div>

        <!-- Nombre ejecutivo -->
        <div class="field col-12 md:col-6">
          <label for="ejecutivo" class="font-medium">
            {{petitionerContent.nombreEjecutivo}} <span class="text-red-500">*</span>
          </label>
          <pv-input-text
              id="ejecutivo"
              ref="ejecutivoRef"
              v-model.trim="serviceRequest.petitionerData.nombreEjecutivo"
              placeholder="Juan Pérez"
              class="w-full"
              @blur="onFieldBlur('nombreEjecutivo')"
              :aria-invalid="!!((touched.nombreEjecutivo || showValidation) && fieldErrors.nombreEjecutivo)"
              :aria-describedby="(touched.nombreEjecutivo || showValidation) && fieldErrors.nombreEjecutivo ? 'err-ejecutivo' : undefined"
          />
          <small
              v-if="(touched.nombreEjecutivo || showValidation) && fieldErrors.nombreEjecutivo"
              id="err-ejecutivo"
              class="text-red-500"
              role="alert"
              aria-live="polite"
          >{{ fieldErrors.nombreEjecutivo }}</small>
        </div>

        <!-- Correo corporativo -->
        <div class="field col-12 md:col-6">
          <label for="correo" class="font-medium">
            {{petitionerContent.correoCorporativo}} <span class="text-red-500">*</span>
          </label>
          <pv-icon-field iconPosition="left" class="w-full">
            <pv-input-icon class="pi pi-envelope" />
            <pv-input-text
                id="correo"
                ref="correoRef"
                v-model.trim="serviceRequest.petitionerData.correoCorporativo"
                placeholder="juan.perez@trackermobility.com"
                class="w-full"
                @blur="onFieldBlur('correoCorporativo')"
                :aria-invalid="!!((touched.correoCorporativo || showValidation) && fieldErrors.correoCorporativo)"
                :aria-describedby="(touched.correoCorporativo || showValidation) && fieldErrors.correoCorporativo ? 'err-correo' : undefined"
            />
          </pv-icon-field>
          <small
              v-if="(touched.correoCorporativo || showValidation) && fieldErrors.correoCorporativo"
              id="err-correo"
              class="text-red-500"
              role="alert"
              aria-live="polite"
          >{{ fieldErrors.correoCorporativo }}</small>
        </div>

        <!-- Número de contacto -->
        <div class="field col-12 md:col-6">
          <label for="telefono" class="font-medium">
            {{petitionerContent.numeroContacto}} <span class="text-red-500">*</span>
          </label>
          <pv-icon-field iconPosition="left" class="w-full">
            <pv-input-icon class="pi pi-phone" />
            <pv-input-mask
                id="telefono"
                ref="telefonoRef"
                v-model="serviceRequest.petitionerData.numeroContacto"
                mask="999 999 999"
                placeholder="999 888 777"
                class="w-full"
                @blur="onFieldBlur('numeroContacto')"
                :aria-invalid="!!((touched.numeroContacto || showValidation) && fieldErrors.numeroContacto)"
                :aria-describedby="(touched.numeroContacto || showValidation) && fieldErrors.numeroContacto ? 'err-telefono' : undefined"
            />
          </pv-icon-field>
          <small
              v-if="(touched.numeroContacto || showValidation) && fieldErrors.numeroContacto"
              id="err-telefono"
              class="text-red-500"
              role="alert"
              aria-live="polite"
          >{{ fieldErrors.numeroContacto }}</small>
        </div>

        <!-- Acciones -->
        <div class="col-12 flex justify-content-end gap-2 mt-2">
          <pv-button class="pl-4 pr-4 button-submit" type="submit" label="Siguiente" :disabled="!isFormValid"
                     :aria-disabled="!isFormValid" />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  width: 100%;
  justify-content: center;   /* centra horizontal */
  align-items: center;       /* centra vertical */
}

.petitioner-form {
  display: flex;
  flex-direction: column;
  width: 80%;
  max-width: 80%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Quitar fondo del input */
.p-inputtext {
  background-color: transparent !important;
  color: black !important;
  border: 1.5px solid var(--color-text-gray) !important;
}

/* Personalización del botón Siguiente */
.p-button {
  background-color: #2E3DB4 !important;
  border-color: #2E3DB4 !important;
  color: white !important;
}

.p-button:hover {
  background-color: #252f96 !important;
  border-color: #252f96 !important;
}

.p-button:focus {
  box-shadow: 0 0 0 0.2rem rgba(46, 61, 180, 0.25) !important;
}

.p-button:disabled {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
  opacity: 0.6;
  cursor: not-allowed;
}



/* Estilo de los botones */

.button-back:hover {
  background-color: var(--color-border-cards) !important; /* Un tono más oscuro para el hover */
  border-color: #4b5563 !important;
  color: #fff !important;
}

.button-submit {
  background-color: var(--color-primary, #2E3DB4);
  border: 1.5px solid var(--color-primary, #2E3DB4);
  color: #fff;
  font-weight: 600;
  transition: background-color 0.3s, color 0.3s;
}

.button-submit:hover {
  background-color: #1a237e !important; /* Un tono más oscuro para el hover */
  border-color: #1a237e !important;
  color: #fff !important;
}


</style>
