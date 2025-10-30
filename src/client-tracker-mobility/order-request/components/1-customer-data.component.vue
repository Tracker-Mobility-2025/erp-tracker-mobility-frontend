<script>
import {CompanyEmployeesService} from "../services/company-employees-api.service.js";
import {Client} from "../models/client.entity.js";
import {ApplicantCompany} from "../models/applicant-company.entity.js";

export default {
  name: 'customer-data',
  components: {},
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
        { label: 'Carnet de extranjería', value: 'CE' }
      ],

      // Servicio para obtener la información de la empresa solicitante.
      companyEmployeesService: new CompanyEmployeesService('/company-employees'),

      // Instancia del modelo Client para manejar todos los datos del cliente
      client: new Client(),
      // Instancia del modelo ApplicantCompany para manejar todos los datos de la empresa solicitante
      applicantCompany: new ApplicantCompany({}),
      // Respuesta de la orden creada (se actualiza después de crear la solicitud)
      orderResponse: null,

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
      if (documentType === 'CE')  return /^\d{9,12}$/.test(num);
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

  <div class="page-container">

    <div class="form-wrapper p-4">

      <form class="grid formgrid p-fluid" @submit.prevent="onNext" @keydown.enter.prevent>
        <!-- ====== Título: Datos del cliente ====== -->
        <div class="col-12">
          <div class="section-title">
            <i class="pi pi-user"></i>
            <h2>{{ customerContent.title }}</h2>
          </div>
        </div>

        <!-- Nombres -->
        <div class="field col-12 md:col-6">
          <label for="nombres" class="font-medium">
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
          <small
              v-if="(touched.name || showValidation) && fieldErrors.name"
              id="err-nombres"
              class="text-red-500"
          >{{ fieldErrors.name }}</small>
        </div>

        <!-- Apellidos -->
        <div class="field col-12 md:col-6">
          <label for="apellidos" class="font-medium">
            {{ customerContent.apellidosCompletos }} <span class="text-red-500">*</span>
          </label>
          <pv-input-text
              id="apellidos"
              v-model="client.lastName"
              placeholder="López Fernández"
              class="w-full"
              :aria-invalid="!!fieldErrors.lastName"
              :aria-describedby="fieldErrors.lastName ? 'err-apellidos' : null"
              @blur="onFieldBlur('lastName')"
          />
          <small
              v-if="(touched.lastName || showValidation) && fieldErrors.lastName"
              id="err-apellidos"
              class="text-red-500"
          >{{ fieldErrors.lastName }}</small>
        </div>

        <!-- Tipo doc -->
        <div class="field col-12 md:col-6">
          <label for="tipo-doc" class="font-medium">
            {{ customerContent.tipoDocumento }} <span class="text-red-500">*</span>
          </label>
          <pv-select
              id="tipo-doc"
              v-model="client.documentType"
              :options="tiposDocumento"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona"
              class="w-full text-black-alpha-10"
              @blur="onFieldBlur('documentType')"
          />
          <small v-if="(touched.documentType || showValidation) && fieldErrors.documentType" class="text-red-500">{{ fieldErrors.documentType }}</small>
        </div>

        <!-- N° doc -->
        <div class="field col-12 md:col-6">
          <label for="num-doc" class="font-medium">
            {{ customerContent.numeroDocumento }} <span class="text-red-500">*</span>
          </label>
          <pv-icon-field iconPosition="left" class="w-full">
            <pv-input-icon class="pi pi-id-card" />
            <pv-input-text
                id="num-doc"
                v-model="client.documentNumber"
                placeholder="12345678"
                class="w-full"
                :aria-invalid="!!fieldErrors.documentNumber"
                :aria-describedby="fieldErrors.documentNumber ? 'err-numdoc' : null"
                @blur="onFieldBlur('documentNumber')"
            />
          </pv-icon-field>
          <small
              v-if="(touched.documentNumber || showValidation) && fieldErrors.documentNumber"
              id="err-numdoc"
              class="text-red-500"
          >{{ fieldErrors.documentNumber }}</small>
        </div>

        <!-- Teléfono (InputMask en lugar de InputNumber) -->
        <div class="field col-12 md:col-6">
          <label for="telefono" class="font-medium">
            {{ customerContent.numeroContacto }} <span class="text-red-500">*</span>
          </label>
          <pv-icon-field iconPosition="left" class="w-full">
            <pv-input-icon class="pi pi-phone" />
            <pv-input-mask
                id="telefono"
                v-model="client.phoneNumber"
                mask="999 999 999"
                placeholder="999 888 777"
                class="w-full"
                :aria-invalid="!!fieldErrors.phoneNumber"
                :aria-describedby="fieldErrors.phoneNumber ? 'err-telefono' : null"
                @blur="onFieldBlur('phoneNumber')"
            />
          </pv-icon-field>
          <small
              v-if="(touched.phoneNumber || showValidation) && fieldErrors.phoneNumber"
              id="err-telefono"
              class="text-red-500"
          >{{ fieldErrors.phoneNumber }}</small>
        </div>


        <!-- Acciones -->
        <div class="col-12 flex justify-content-end gap-2 mt-2">
          <pv-button class="pl-4 pr-4 button-submit" :label="customerContent.botonSiguiente" type="submit" :disabled="!isFormValid" />
        </div>
      </form>

    </div>
  </div>

</template>

<style scoped>

.page-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;  /* Centrado vertical */
  min-height: 100%;
}

.form-wrapper{
  display:flex;
  flex-direction:column;
  width: 80%;
  max-width:80%;
  background:#fff;
  border-radius:12px;
  box-shadow:0 2px 8px rgba(0,0,0,.1);
}

.formgrid{ row-gap:1rem; }
.field{ margin-bottom:0; }

.section-title{
  display:flex; align-items:center; gap:.5rem;
  margin:.25rem 0 1rem 0;
}
.section-title i{ font-size:1.25rem; color:#2E3DB4; }

.section-title h2{ margin:0; font-size:1.35rem; font-weight:600; }


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
