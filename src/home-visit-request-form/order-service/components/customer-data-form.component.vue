<script>

import FileUploader from "../../../shared/components/file-uploader.component.vue";

export default {
  name: 'customer-data-form',
  
  components: {
    FileUploader

  },

  inject: ['serviceRequest'],

  data () {
    return {
      touched: {},
      showValidation: false,

      customerContent: {
        title: 'Datos del cliente',
        nombresCompletos: 'Nombres completos',
        apellidosCompletos: 'Apellidos completos',
        tipoDocumento: 'Tipo de documento de identidad',
        numeroDocumento: 'N° de documento de identidad',
        numeroContacto: 'Número de contacto',
        botonSiguiente: 'Siguiente',
        botonRegresar: 'Regresar',
      },

      addressContent: {
        title: 'Datos de domicilio',
        departamento: 'Departamento',
        provincia: 'Provincia',
        distrito: 'Distrito',
        direccionCompleta: 'Dirección de domicilio completo',
        ubicacionGoogleMaps: 'Ubicación por google maps',
        fotoFachada: 'Fotografía de la fachada del domicilio',
        botonSiguiente: 'Siguiente',
        botonRegresar: 'Regresar',
      },

      // listas
      tiposDocumento: [
        { label: 'DNI', value: 'DNI' },
        { label: 'PTP', value: 'PTP' },
        { label: 'Carnet de extranjería', value: 'CE' }
      ]
    };
  },

  computed: {
    // ---- Validaciones básicas
    isPhoneValid(){
      const phone = this.serviceRequest.clientData.numeroContacto;
      if (!phone) return false;
      const phoneStr = String(phone).replace(/\s/g, '');
      // Perú: 9 + 8 dígitos
      return /^9\d{8}$/.test(phoneStr);
    },

    isDocValid(){
      const { tipoDocumento, numeroDocumento } = this.serviceRequest.clientData;
      if (!tipoDocumento || !numeroDocumento) return false;
      const num = String(numeroDocumento).replace(/\s/g, '');
      if (tipoDocumento === 'DNI') return /^\d{8}$/.test(num);
      if (tipoDocumento === 'CE')  return /^\d{9,12}$/.test(num);
      if (tipoDocumento === 'PTP') return /^\d{9,12}$/.test(num);
      return false;
    },

    fieldErrors(){
      const errors = {};
      const client = this.serviceRequest.clientData;
      const address = this.serviceRequest.addressData;

      // ----- Cliente
      if (this.touched.nombresCompletos || this.showValidation) {
        if (!client.nombresCompletos || client.nombresCompletos.trim().length < 2) {
          errors.nombresCompletos = 'Ingresa nombres válidos';
        }
      }

      if (this.touched.apellidosCompletos || this.showValidation) {
        if (!client.apellidosCompletos || client.apellidosCompletos.trim().length < 2) {
          errors.apellidosCompletos = 'Ingresa apellidos válidos';
        }
      }

      if (this.touched.tipoDocumento || this.showValidation) {
        if (!client.tipoDocumento) errors.tipoDocumento = 'Selecciona un tipo de documento';
      }

      if (this.touched.numeroDocumento || this.showValidation) {
        if (!client.numeroDocumento) {
          errors.numeroDocumento = 'El número de documento es obligatorio';
        } else if (!this.isDocValid) {
          errors.numeroDocumento = 'Número de documento inválido para el tipo seleccionado';
        }
      }

      if (this.touched.numeroContacto || this.showValidation) {
        if (!client.numeroContacto) {
          errors.numeroContacto = 'El número de contacto es obligatorio';
        } else if (!this.isPhoneValid) {
          errors.numeroContacto = 'El número debe iniciar con 9 y tener 9 dígitos';
        }
      }

      // ----- Domicilio
      if (this.touched.departamento || this.showValidation) {
        if (!address.departamento || address.departamento.trim().length < 2) {
          errors.departamento = 'Ingresa un departamento';
        }
      }
      if (this.touched.provincia || this.showValidation) {
        if (!address.provincia || address.provincia.trim().length < 2) {
          errors.provincia = 'Ingresa una provincia';
        }
      }
      if (this.touched.distrito || this.showValidation) {
        if (!address.distrito || address.distrito.trim().length < 2) {
          errors.distrito = 'Ingresa un distrito';
        }
      }
      if (this.touched.direccionCompleta || this.showValidation) {
        if (!address.direccionCompleta || address.direccionCompleta.trim().length < 5) {
          errors.direccionCompleta = 'Ingresa una dirección válida';
        }
      }
      if (this.touched.ubicacionGoogleMaps || this.showValidation) {
        if (!address.ubicacionGoogleMaps || address.ubicacionGoogleMaps.trim().length < 5) {
          errors.ubicacionGoogleMaps = 'Pega la URL de Google Maps';
        } else {
          // validación de URL + dominios de Google Maps
          let urlObj = null;
          try { urlObj = new URL(address.ubicacionGoogleMaps); } catch(e){ /* noop */ }
          const validHost = urlObj && (
              urlObj.hostname.endsWith('google.com') ||
              urlObj.hostname.endsWith('goo.gl') ||
              urlObj.hostname.endsWith('maps.app.goo.gl')
          );
          if (!urlObj || !/^https?:$/.test(urlObj.protocol) || !validHost) {
            errors.ubicacionGoogleMaps = 'Ingresa una URL válida de Google Maps (http/https)';
          }
        }
      }

      // Validación para foto de fachada
      if (this.touched.fotografiaDomicilio || this.showValidation) {
        if (!address.fotografiaDomicilio) {
          errors.fotografiaDomicilio = 'La fotografía de la fachada es obligatoria';
        }
      }

      return errors;
    },

    isFormValid(){
      const client = this.serviceRequest.clientData;
      const address = this.serviceRequest.addressData;

      const basicOk =
          client.nombresCompletos &&
          client.apellidosCompletos &&
          client.tipoDocumento &&
          client.numeroDocumento &&
          client.numeroContacto &&
          address.departamento &&
          address.provincia &&
          address.distrito &&
          address.direccionCompleta &&
          address.ubicacionGoogleMaps &&
          address.fotografiaDomicilio;

      return Boolean(
          basicOk &&
          this.isDocValid &&
          this.isPhoneValid &&
          Object.keys(this.fieldErrors).length === 0
      );
    }
  },

  watch: {
    // El componente ImageUploader maneja automáticamente la gestión de memoria
  },

  methods: {
    onFieldBlur(fieldName){ this.touched[fieldName] = true; },

    // Métodos para el FileUploader
    handleFileValidationError(errors) {
      errors.forEach(error => {
        console.warn('Error de archivo:', error.message)
        // Si tienes toast configurado:
        this.$toast?.add({severity:'warn', summary:'Error de archivo', detail: error.message})
      })
    },

    onFileSelected(file) {
      console.log('Archivo seleccionado:', file.name)
      this.touched.fotografiaDomicilio = true
    },

    onFileRemoved() {
      console.log('Archivo eliminado')
      this.touched.fotografiaDomicilio = true
    },

    // ---- Foco en el primer error
    focusFirstError() {
      const first = Object.keys(this.fieldErrors)[0];
      if (!first) return;
      const idMap = {
        nombresCompletos: 'nombres',
        apellidosCompletos: 'apellidos',
        tipoDocumento: 'tipo-doc',
        numeroDocumento: 'num-doc',
        numeroContacto: 'telefono',
        departamento: 'departamento',
        provincia: 'provincia',
        distrito: 'distrito',
        direccionCompleta: 'direccion',
        ubicacionGoogleMaps: 'maps',
        fotografiaDomicilio: 'image-uploader-fachada'
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
      this.$router.push({ name: 'documentation-upload' } );
    },
  },

  created(){
    // Inicializar estructuras
    if (!this.serviceRequest.clientData) {
      this.serviceRequest.clientData = {
        nombresCompletos: '',
        apellidosCompletos: '',
        tipoDocumento: null,
        numeroDocumento: '',
        numeroContacto: ''
      };
    }
    if (!this.serviceRequest.addressData) {
      this.serviceRequest.addressData = {
        departamento: '',
        provincia: '',
        distrito: '',
        direccionCompleta: '',
        ubicacionGoogleMaps: '',
        fotografiaDomicilio: null
      };
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
              v-model="serviceRequest.clientData.nombresCompletos"
              placeholder="Ana María"
              class="w-full"
              :aria-invalid="!!fieldErrors.nombresCompletos"
              :aria-describedby="fieldErrors.nombresCompletos ? 'err-nombres' : null"
              @blur="onFieldBlur('nombresCompletos')"
          />
          <small
              v-if="(touched.nombresCompletos || showValidation) && fieldErrors.nombresCompletos"
              id="err-nombres"
              class="text-red-500"
          >{{ fieldErrors.nombresCompletos }}</small>
        </div>

        <!-- Apellidos -->
        <div class="field col-12 md:col-6">
          <label for="apellidos" class="font-medium">
            {{ customerContent.apellidosCompletos }} <span class="text-red-500">*</span>
          </label>
          <pv-input-text
              id="apellidos"
              v-model="serviceRequest.clientData.apellidosCompletos"
              placeholder="López Fernández"
              class="w-full"
              :aria-invalid="!!fieldErrors.apellidosCompletos"
              :aria-describedby="fieldErrors.apellidosCompletos ? 'err-apellidos' : null"
              @blur="onFieldBlur('apellidosCompletos')"
          />
          <small
              v-if="(touched.apellidosCompletos || showValidation) && fieldErrors.apellidosCompletos"
              id="err-apellidos"
              class="text-red-500"
          >{{ fieldErrors.apellidosCompletos }}</small>
        </div>

        <!-- Tipo doc -->
        <div class="field col-12 md:col-6">
          <label for="tipo-doc" class="font-medium">
            {{ customerContent.tipoDocumento }} <span class="text-red-500">*</span>
          </label>
          <pv-dropdown
              id="tipo-doc"
              v-model="serviceRequest.clientData.tipoDocumento"
              :options="tiposDocumento"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona"
              class="w-full text-black-alpha-10"
              @blur="onFieldBlur('tipoDocumento')"
          />
          <small v-if="(touched.tipoDocumento || showValidation) && fieldErrors.tipoDocumento" class="text-red-500">{{ fieldErrors.tipoDocumento }}</small>
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
                v-model="serviceRequest.clientData.numeroDocumento"
                placeholder="12345678"
                class="w-full"
                :aria-invalid="!!fieldErrors.numeroDocumento"
                :aria-describedby="fieldErrors.numeroDocumento ? 'err-numdoc' : null"
                @blur="onFieldBlur('numeroDocumento')"
            />
          </pv-icon-field>
          <small
              v-if="(touched.numeroDocumento || showValidation) && fieldErrors.numeroDocumento"
              id="err-numdoc"
              class="text-red-500"
          >{{ fieldErrors.numeroDocumento }}</small>
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
                v-model="serviceRequest.clientData.numeroContacto"
                mask="999 999 999"
                placeholder="999 888 777"
                class="w-full"
                :aria-invalid="!!fieldErrors.numeroContacto"
                :aria-describedby="fieldErrors.numeroContacto ? 'err-telefono' : null"
                @blur="onFieldBlur('numeroContacto')"
            />
          </pv-icon-field>
          <small
              v-if="(touched.numeroContacto || showValidation) && fieldErrors.numeroContacto"
              id="err-telefono"
              class="text-red-500"
          >{{ fieldErrors.numeroContacto }}</small>
        </div>

        <!-- ====== Título: Datos de domicilio ====== -->
        <div class="col-12 mt-3">
          <div class="section-title">
            <i class="pi pi-home"></i>
            <h2>{{ addressContent.title }}</h2>
          </div>
        </div>

        <!-- Departamento -->
        <div class="field col-12 md:col-6">
          <label for="departamento" class="font-medium">
            {{ addressContent.departamento }} <span class="text-red-500">*</span>
          </label>
          <pv-input-text
              id="departamento"
              v-model="serviceRequest.addressData.departamento"
              placeholder="Ingresa tu departamento"
              class="w-full"
              :aria-invalid="!!fieldErrors.departamento"
              :aria-describedby="fieldErrors.departamento ? 'err-departamento' : null"
              @blur="onFieldBlur('departamento')"
          />
          <small
              v-if="(touched.departamento || showValidation) && fieldErrors.departamento"
              id="err-departamento"
              class="text-red-500"
          >{{ fieldErrors.departamento }}</small>
        </div>

        <!-- Provincia -->
        <div class="field col-12 md:col-6">
          <label for="provincia" class="font-medium">
            {{ addressContent.provincia }} <span class="text-red-500">*</span>
          </label>
          <pv-input-text
              id="provincia"
              v-model="serviceRequest.addressData.provincia"
              placeholder="Ingresa tu provincia"
              class="w-full"
              :aria-invalid="!!fieldErrors.provincia"
              :aria-describedby="fieldErrors.provincia ? 'err-provincia' : null"
              @blur="onFieldBlur('provincia')"
          />
          <small
              v-if="(touched.provincia || showValidation) && fieldErrors.provincia"
              id="err-provincia"
              class="text-red-500"
          >{{ fieldErrors.provincia }}</small>
        </div>

        <!-- Distrito -->
        <div class="field col-12 md:col-6">
          <label for="distrito" class="font-medium">
            {{ addressContent.distrito }} <span class="text-red-500">*</span>
          </label>
          <pv-input-text
              id="distrito"
              v-model="serviceRequest.addressData.distrito"
              placeholder="Ingresa tu distrito"
              class="w-full"
              :aria-invalid="!!fieldErrors.distrito"
              :aria-describedby="fieldErrors.distrito ? 'err-distrito' : null"
              @blur="onFieldBlur('distrito')"
          />
          <small
              v-if="(touched.distrito || showValidation) && fieldErrors.distrito"
              id="err-distrito"
              class="text-red-500"
          >{{ fieldErrors.distrito }}</small>
        </div>

        <!-- Dirección completa -->
        <div class="field col-12 md:col-6">
          <label for="direccion" class="font-medium">
            {{ addressContent.direccionCompleta }} <span class="text-red-500">*</span>
          </label>
          <pv-icon-field iconPosition="left" class="w-full">
            <pv-input-icon class="pi pi-map-marker" />
            <pv-input-text
                id="direccion"
                v-model="serviceRequest.addressData.direccionCompleta"
                placeholder="Av. tu dirección 123"
                class="w-full"
                :aria-invalid="!!fieldErrors.direccionCompleta"
                :aria-describedby="fieldErrors.direccionCompleta ? 'err-direccion' : null"
                @blur="onFieldBlur('direccionCompleta')"
            />
          </pv-icon-field>
          <small
              v-if="(touched.direccionCompleta || showValidation) && fieldErrors.direccionCompleta"
              id="err-direccion"
              class="text-red-500"
          >{{ fieldErrors.direccionCompleta }}</small>
        </div>

        <!-- Ubicación por Google Maps (URL) -->
        <div class="field col-12">
          <label for="maps" class="font-medium">
            {{ addressContent.ubicacionGoogleMaps }} <span class="text-red-500">*</span>
          </label>
          <pv-icon-field iconPosition="left" class="w-full">
            <pv-input-icon class="pi pi-link" />
            <pv-input-text
                id="maps"
                v-model="serviceRequest.addressData.ubicacionGoogleMaps"
                placeholder="https://maps.google.com/..."
                class="w-full"
                :aria-invalid="!!fieldErrors.ubicacionGoogleMaps"
                :aria-describedby="fieldErrors.ubicacionGoogleMaps ? 'err-maps' : null"
                @blur="onFieldBlur('ubicacionGoogleMaps')"
            />
          </pv-icon-field>
          <small
              v-if="(touched.ubicacionGoogleMaps || showValidation) && fieldErrors.ubicacionGoogleMaps"
              id="err-maps"
              class="text-red-500"
          >{{ fieldErrors.ubicacionGoogleMaps }}</small>
        </div>

        <!-- Foto de fachada usando ImageUploader -->
        <div class="field col-12">
          <file-uploader
              v-model="serviceRequest.addressData.fotografiaDomicilio"
              input-id="file-uploader-fachada"
              file-type="any"
              :label="addressContent.fotoFachada"
              placeholder="Haz clic para subir la fotografía"
              hint="Imagen clara de la fachada (JPG, PNG o WebP, máx 10MB)"
              drag-text=" o arrastra la imagen aquí"
              change-text="Cambiar foto"
              remove-text="Quitar foto"
              :max-file-size="10 * 1024 * 1024"
              :error-messages="{
                fileTooBig: 'La imagen es muy pesada. Máximo {maxSize}',
                invalidFormat: 'Solo se permiten imágenes: {formats}'
              }"
              required
              @file-selected="onFileSelected"
              @file-removed="onFileRemoved"
              @validation-error="handleFileValidationError"
          />
          <small 
            v-if="(touched.fotografiaDomicilio || showValidation) && fieldErrors.fotografiaDomicilio"
            class="text-red-500"
          >{{ fieldErrors.fotografiaDomicilio }}</small>
        </div>


        <!-- Acciones -->
        <div class="col-12 flex justify-content-end gap-2 mt-2">
          <pv-button class="pl-4 pr-4 button-back" :label="customerContent.botonRegresar" severity="secondary" @click="$router.back()" />
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
  align-items: flex-start;  /* Evita centrado vertical que causa scroll */
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

.button-back {
  background-color: #e0e0e0 !important;
  color: #000 !important;
  border: none !important;
}

.button-next {
  background-color: #2E3DB4 !important;
  color: #fff !important;
  border: none !important;
}



/* Inputs */
.p-inputtext {
  background-color:transparent !important;
  color:#000 !important;
  border:1.5px solid var(--color-text-gray, #d1d5db) !important;
}

/* Estilos de botones */

/* Estilo de los botones */



.button-back {
  background-color: var(--color-border-cards, #6B7280);
  border: 1.5px solid var(--color-border-cards, #6B7280);
  color: #fff;
  font-weight: 600;
  transition: background-color 0.3s, color 0.3s;
}


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
