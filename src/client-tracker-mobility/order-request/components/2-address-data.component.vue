<script>
import FileUploader from "../../../shared/components/file-uploader.component.vue";
import { InputValidationMixin } from '../mixins/input-validation.mixin.js';

export default {
  name: 'address-data',

  components: {
    FileUploader
  },

  mixins: [InputValidationMixin],

  inject: ['client'],

  data() {
    return {
      addressContent: {
        title: 'Datos de domicilio',
        departamento: 'Departamento',
        provincia: 'Provincia',
        distrito: 'Distrito',
        direccionCompleta: 'Dirección completa',
        ubicacionGoogleMaps: 'Ubicación por Google Maps',
        fotoFachada: 'Foto de fachada de la vivienda',
        botonSiguiente: 'Siguiente',
        botonRegresar: 'Regresar'
      },

      // Control de validación
      touched: {
        department: false,
        province: false,
        district: false,
        homeAddress: false,
        mapLocation: false,
        facadePhoto: false
      },
      showValidation: false,
      addressToastTimeout: null
    };
  },

  computed: {
    fieldErrors() {
      const errors = {};

      // ----- Domicilio
      if (this.touched.department || this.showValidation) {
        if (!this.client.department || this.client.department.trim().length < 2) {
          errors.department = 'Ingresa un departamento';
        }
      }

      if (this.touched.province || this.showValidation) {
        if (!this.client.province || this.client.province.trim().length < 2) {
          errors.province = 'Ingresa una provincia';
        }
      }

      if (this.touched.district || this.showValidation) {
        if (!this.client.district || this.client.district.trim().length < 2) {
          errors.district = 'Ingresa un distrito';
        }
      }

      if (this.touched.homeAddress || this.showValidation) {
        if (!this.client.homeAddress || this.client.homeAddress.trim().length < 5) {
          errors.homeAddress = 'Ingresa una dirección válida';
        } else if (this.client.homeAddress.length > 300) {
          errors.homeAddress = `Dirección muy larga (${this.client.homeAddress.length}/300 caracteres)`;
        }
      }

      if (this.touched.mapLocation || this.showValidation) {
        if (!this.client.mapLocation || this.client.mapLocation.trim().length < 5) {
          errors.mapLocation = 'Pega la URL de Google Maps';
        } else {
          // validación de URL + dominios de Google Maps
          let urlObj = null;
          try { urlObj = new URL(this.client.mapLocation); } catch(e){ /* noop */ }
          const validHost = urlObj && (
              urlObj.hostname.endsWith('google.com') ||
              urlObj.hostname.endsWith('goo.gl') ||
              urlObj.hostname.endsWith('maps.app.goo.gl')
          );
          if (!urlObj || !/^https?:$/.test(urlObj.protocol) || !validHost) {
            errors.mapLocation = 'Ingresa una URL válida de Google Maps (http/https)';
          }
        }
      }

      // Validación para foto de fachada
      if (this.touched.facadePhoto || this.showValidation) {
        const facadePhoto = this.client.documents.find(doc => doc.type === 'FOTO_FACHADA_VIVIENDA');
        if (!facadePhoto) {
          errors.facadePhoto = 'La fotografía de la fachada es obligatoria';
        }
      }

      return errors;
    },

    isFormValid() {
      const facadePhoto = this.client.documents.find(doc => doc.type === 'FOTO_FACHADA_VIVIENDA');

      const basicOk =
          this.client.department &&
          this.client.province &&
          this.client.district &&
          this.client.homeAddress &&
          this.client.mapLocation &&
          facadePhoto;

      return Boolean(
          basicOk &&
          Object.keys(this.fieldErrors).length === 0
      );
    }
  },

  watch: {
    // Watcher para validar dirección en tiempo real
    'client.homeAddress': {
      handler(newValue) {
        if (newValue && newValue.length > 300) {
          clearTimeout(this.addressToastTimeout);
          this.addressToastTimeout = setTimeout(() => {
            this.showToast('warn', 'Dirección muy larga',
              `La dirección tiene ${newValue.length} caracteres. El máximo permitido es 300 caracteres.`);
          }, 1000);
        }
      },
      immediate: false
    }
  },

  mounted() {
    this.cleanOldDocumentTypes();
  },

  beforeUnmount() {
    if (this.addressToastTimeout) {
      clearTimeout(this.addressToastTimeout);
    }
  },

  methods: {
    // Método para limpiar tipos de documento antiguos
    cleanOldDocumentTypes() {
      const oldTypes = ['FACADE_PHOTO', 'SERVICE_RECEIPT', 'IDENTITY_DOCUMENT'];

      this.client.documents = this.client.documents.filter(doc => {
        return !oldTypes.includes(doc.type);
      });
    },

    onFieldBlur(fieldName) {
      this.touched[fieldName] = true;

      if (fieldName === 'homeAddress' && this.client.homeAddress && this.client.homeAddress.length > 300) {
        this.showToast('warn', 'Dirección muy larga',
          `La dirección tiene ${this.client.homeAddress.length} caracteres. El máximo permitido es 300 caracteres.`);
      }
    },

    showToast(severity, summary, detail, life = 5000) {
      if (this.$toast) {
        this.$toast.add({
          severity,
          summary,
          detail,
          life
        });
      } else {
        console.warn(`[TOAST ${severity.toUpperCase()}] ${summary}: ${detail}`);
      }
    },

    handleFileValidationError(errors) {
      errors.forEach(error => {
        this.$toast?.add({severity:'warn', summary:'Error de archivo', detail: error.message})
      })
    },

    onFileSelected(file) {
      const existingIndex = this.client.documents.findIndex(doc => doc.type === 'FOTO_FACHADA_VIVIENDA');
      const facadeDocument = {
        type: 'FOTO_FACHADA_VIVIENDA',
        file: file,
        url: null
      };

      if (existingIndex >= 0) {
        this.client.documents[existingIndex] = facadeDocument;
      } else {
        this.client.documents.push(facadeDocument);
      }

      this.touched.facadePhoto = true
    },

    onFileRemoved() {
      const existingIndex = this.client.documents.findIndex(doc => doc.type === 'FOTO_FACHADA_VIVIENDA');
      if (existingIndex >= 0) {
        this.client.documents.splice(existingIndex, 1);
      }

      this.touched.facadePhoto = true
    },

    focusFirstError() {
      const first = Object.keys(this.fieldErrors)[0];
      if (!first) return;
      const idMap = {
        department: 'departamento',
        province: 'provincia',
        district: 'distrito',
        homeAddress: 'direccion',
        mapLocation: 'maps',
        facadePhoto: 'image-uploader-fachada'
      };
      this.$nextTick(() => {
        const el = document.getElementById(idMap[first] || 'departamento');
        if (el) el.focus();
      });
    },

    onNext() {
      this.showValidation = true;
      if (!this.isFormValid) {
        this.focusFirstError();
        return;
      }

      // Emitir evento para que el componente padre maneje la navegación
      this.$emit('next');
    },

    onBack() {
      // Emitir evento para que el componente padre maneje la navegación
      this.$emit('back');
    }
  }
};
</script>

<template>
  <div class="flex justify-content-center w-full">
    <div class="form-wrapper p-3 w-full" style="max-width: 1200px;">
      <form class="formgrid grid p-fluid compact-form" @submit.prevent="onNext" @keydown.enter.prevent>
        <!-- ====== Título: Datos de domicilio ====== -->
        <div class="col-12">
          <div class="flex align-items-center gap-2 mb-2">
            <i class="pi pi-home text-lg text-primary-local"></i>
            <h2 class="m-0 text-lg font-semibold text-primary-local">{{ addressContent.title }}</h2>
          </div>
        </div>

        <!-- Departamento -->
        <div class="field col-12 md:col-6">
          <label for="departamento" class="block mb-1 font-medium text-color text-sm">
            {{ addressContent.departamento }} <span class="text-red-500">*</span>
          </label>
          <pv-input-text
              id="departamento"
              v-model="client.department"
              placeholder="Ingresa tu departamento"
              class="w-full input-compact"
              :aria-invalid="!!fieldErrors.department"
              :aria-describedby="fieldErrors.department ? 'err-departamento' : null"
              @blur="onFieldBlur('department')"
              @keydown="validateTextOnly"
              @paste="(e) => handlePaste(e, 'text')"
          />
          <div class="error-container">
            <small
                v-if="(touched.department || showValidation) && fieldErrors.department"
                id="err-departamento"
                class="error-message"
            >{{ fieldErrors.department }}</small>
          </div>
        </div>

        <!-- Provincia -->
        <div class="field col-12 md:col-6">
          <label for="provincia" class="block mb-1 font-medium text-color text-sm">
            {{ addressContent.provincia }} <span class="text-red-500">*</span>
          </label>
          <pv-input-text
              id="provincia"
              v-model="client.province"
              placeholder="Ingresa tu provincia"
              class="w-full input-compact"
              :aria-invalid="!!fieldErrors.province"
              :aria-describedby="fieldErrors.province ? 'err-provincia' : null"
              @blur="onFieldBlur('province')"
              @keydown="validateTextOnly"
              @paste="(e) => handlePaste(e, 'text')"
          />
          <div class="error-container">
            <small
                v-if="(touched.province || showValidation) && fieldErrors.province"
                id="err-provincia"
                class="error-message"
            >{{ fieldErrors.province }}</small>
          </div>
        </div>

        <!-- Distrito -->
        <div class="field col-12 md:col-6">
          <label for="distrito" class="block mb-1 font-medium text-color text-sm">
            {{ addressContent.distrito }} <span class="text-red-500">*</span>
          </label>
          <pv-input-text
              id="distrito"
              v-model="client.district"
              placeholder="Ingresa tu distrito"
              class="w-full input-compact"
              :aria-invalid="!!fieldErrors.district"
              :aria-describedby="fieldErrors.district ? 'err-distrito' : null"
              @blur="onFieldBlur('district')"
              @keydown="validateTextOnly"
              @paste="(e) => handlePaste(e, 'text')"
          />
          <div class="error-container">
            <small
                v-if="(touched.district || showValidation) && fieldErrors.district"
                id="err-distrito"
                class="error-message"
            >{{ fieldErrors.district }}</small>
          </div>
        </div>

        <!-- Dirección completa -->
        <div class="field col-12 md:col-6">
          <label for="direccion" class="block mb-1 font-medium text-color text-sm">
            {{ addressContent.direccionCompleta }} <span class="text-red-500">*</span>
            <span class="text-xs text-500 ml-2">
              ({{ client.homeAddress ? client.homeAddress.length : 0 }}/300)
            </span>
          </label>
          <pv-icon-field class="w-full">
            <pv-input-icon class="pi pi-map-marker" />
            <pv-input-text
                id="direccion"
                v-model="client.homeAddress"
                placeholder="Av. tu dirección 123"
                class="w-full input-compact"
                maxlength="300"
                :aria-invalid="!!fieldErrors.homeAddress"
                :aria-describedby="fieldErrors.homeAddress ? 'err-direccion' : null"
                @blur="onFieldBlur('homeAddress')"
            />
          </pv-icon-field>
          <div class="error-container">
            <small
                v-if="(touched.homeAddress || showValidation) && fieldErrors.homeAddress"
                id="err-direccion"
                class="error-message"
            >{{ fieldErrors.homeAddress }}</small>
          </div>
        </div>

        <!-- Ubicación por Google Maps (URL) -->
        <div class="field col-12">
          <label for="maps" class="block mb-1 font-medium text-color text-sm">
            {{ addressContent.ubicacionGoogleMaps }} <span class="text-red-500">*</span>
          </label>
          <pv-icon-field class="w-full">
            <pv-input-icon class="pi pi-link" />
            <pv-input-text
                id="maps"
                v-model="client.mapLocation"
                placeholder="https://maps.google.com/..."
                class="w-full input-compact"
                :aria-invalid="!!fieldErrors.mapLocation"
                :aria-describedby="fieldErrors.mapLocation ? 'err-maps' : null"
                @blur="onFieldBlur('mapLocation')"
            />
          </pv-icon-field>
          <div class="error-container">
            <small
                v-if="(touched.mapLocation || showValidation) && fieldErrors.mapLocation"
                id="err-maps"
                class="error-message"
            >{{ fieldErrors.mapLocation }}</small>
          </div>
        </div>

        <!-- Foto de fachada usando FileUploader -->
        <div class="field col-12">
          <file-uploader
              :model-value="client.documents.find(doc => doc.type === 'FOTO_FACHADA_VIVIENDA')?.file || null"
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
          <div class="error-container">
            <small
                v-if="(touched.facadePhoto || showValidation) && fieldErrors.facadePhoto"
                class="error-message"
            >{{ fieldErrors.facadePhoto }}</small>
          </div>
        </div>

        <!-- Acciones -->
        <div class="col-12 flex justify-content-end gap-2 mt-2">
          <pv-button
            class="px-4 py-2 button-back"
            :label="addressContent.botonRegresar"
            severity="secondary"
            type="button"
            @click="onBack"
          />
          <pv-button
            class="px-4 py-2 button-submit"
            :label="addressContent.botonSiguiente"
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

.button-back {
  background-color: var(--color-muted) !important;
  border-color: var(--color-muted) !important;
  color: var(--color-white) !important;
  font-weight: var(--font-weight-semibold) !important;
  transition: all 0.3s ease !important;
}

.button-back:hover:not(:disabled) {
  background-color: var(--color-border-cards) !important;
  border-color: var(--color-border-cards) !important;
  transform: translateY(-1px);
  box-shadow: var(--shadow) !important;
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