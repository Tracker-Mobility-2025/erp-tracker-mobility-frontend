<script>
import FileUploader from "../../../shared/components/file-uploader.component.vue";

export default {
  name: 'address-data',

  components: {
    FileUploader
  },

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
        console.warn('Error de archivo:', error.message)
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
  <div class="page-container">
    <div class="form-wrapper p-4">
      <form class="grid formgrid p-fluid" @submit.prevent="onNext" @keydown.enter.prevent>
        <!-- ====== Título: Datos de domicilio ====== -->
        <div class="col-12">
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
              v-model="client.department"
              placeholder="Ingresa tu departamento"
              class="w-full"
              :aria-invalid="!!fieldErrors.department"
              :aria-describedby="fieldErrors.department ? 'err-departamento' : null"
              @blur="onFieldBlur('department')"
          />
          <small
              v-if="(touched.department || showValidation) && fieldErrors.department"
              id="err-departamento"
              class="text-red-500"
          >{{ fieldErrors.department }}</small>
        </div>

        <!-- Provincia -->
        <div class="field col-12 md:col-6">
          <label for="provincia" class="font-medium">
            {{ addressContent.provincia }} <span class="text-red-500">*</span>
          </label>
          <pv-input-text
              id="provincia"
              v-model="client.province"
              placeholder="Ingresa tu provincia"
              class="w-full"
              :aria-invalid="!!fieldErrors.province"
              :aria-describedby="fieldErrors.province ? 'err-provincia' : null"
              @blur="onFieldBlur('province')"
          />
          <small
              v-if="(touched.province || showValidation) && fieldErrors.province"
              id="err-provincia"
              class="text-red-500"
          >{{ fieldErrors.province }}</small>
        </div>

        <!-- Distrito -->
        <div class="field col-12 md:col-6">
          <label for="distrito" class="font-medium">
            {{ addressContent.distrito }} <span class="text-red-500">*</span>
          </label>
          <pv-input-text
              id="distrito"
              v-model="client.district"
              placeholder="Ingresa tu distrito"
              class="w-full"
              :aria-invalid="!!fieldErrors.district"
              :aria-describedby="fieldErrors.district ? 'err-distrito' : null"
              @blur="onFieldBlur('district')"
          />
          <small
              v-if="(touched.district || showValidation) && fieldErrors.district"
              id="err-distrito"
              class="text-red-500"
          >{{ fieldErrors.district }}</small>
        </div>

        <!-- Dirección completa -->
        <div class="field col-12 md:col-6">
          <label for="direccion" class="font-medium">
            {{ addressContent.direccionCompleta }} <span class="text-red-500">*</span>
            <span class="text-xs text-gray-500 ml-2">
              ({{ client.homeAddress ? client.homeAddress.length : 0 }}/300)
            </span>
          </label>
          <pv-icon-field iconPosition="left" class="w-full">
            <pv-input-icon class="pi pi-map-marker" />
            <pv-input-text
                id="direccion"
                v-model="client.homeAddress"
                placeholder="Av. tu dirección 123"
                class="w-full"
                maxlength="300"
                :aria-invalid="!!fieldErrors.homeAddress"
                :aria-describedby="fieldErrors.homeAddress ? 'err-direccion' : null"
                @blur="onFieldBlur('homeAddress')"
            />
          </pv-icon-field>
          <small
              v-if="(touched.homeAddress || showValidation) && fieldErrors.homeAddress"
              id="err-direccion"
              class="text-red-500"
          >{{ fieldErrors.homeAddress }}</small>
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
                v-model="client.mapLocation"
                placeholder="https://maps.google.com/..."
                class="w-full"
                :aria-invalid="!!fieldErrors.mapLocation"
                :aria-describedby="fieldErrors.mapLocation ? 'err-maps' : null"
                @blur="onFieldBlur('mapLocation')"
            />
          </pv-icon-field>
          <small
              v-if="(touched.mapLocation || showValidation) && fieldErrors.mapLocation"
              id="err-maps"
              class="text-red-500"
          >{{ fieldErrors.mapLocation }}</small>
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
          <small
              v-if="(touched.facadePhoto || showValidation) && fieldErrors.facadePhoto"
              class="text-red-500"
          >{{ fieldErrors.facadePhoto }}</small>
        </div>

        <!-- Acciones -->
        <div class="col-12 flex justify-content-end gap-2 mt-2">
          <pv-button
            class="pl-4 pr-4 button-back"
            :label="addressContent.botonRegresar"
            severity="secondary"
            type="button"
            @click="onBack"
          />
          <pv-button
            class="pl-4 pr-4 button-submit"
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
.page-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  width: 80%;
  max-width: 80%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
}

.formgrid {
  row-gap: 1rem;
}

.field {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: .5rem;
  margin: .25rem 0 1rem 0;
}

.section-title i {
  font-size: 1.25rem;
  color: #2E3DB4;
}

.section-title h2 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
}

.button-back {
  background-color: var(--color-border-cards, #6B7280);
  border: 1.5px solid var(--color-border-cards, #6B7280);
  color: #fff;
  font-weight: 600;
  transition: background-color 0.3s, color 0.3s;
}

.button-back:hover {
  background-color: #4b5563 !important;
  border-color: #4b5563 !important;
  color: #fff !important;
}

.button-submit {
  background-color: #2E3DB4 !important;
  color: #fff !important;
  border: none !important;
  font-weight: 600;
}

.button-submit:disabled {
  background-color: #9ca3af !important;
  cursor: not-allowed;
}
</style>