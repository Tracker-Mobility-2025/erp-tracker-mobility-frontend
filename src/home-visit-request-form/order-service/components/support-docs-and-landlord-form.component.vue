<script>

import FileUploader from "../../../shared/components/file-uploader.component.vue";

export default {
  name: 'support-docs-and-landlord-form',
  
  components: {
    FileUploader

  },
  
  inject: ['serviceRequest'],

  data () {
    return {
      touched: {},
      showValidation: false,

      supportDocsContent: {
        title: 'Documentación de respaldo',
        reciboServicio: 'Copia de recibo de servicio (Luz o Agua)',
        documentoIdentidad: 'Copia de documento de identidad',
        uploadCta: 'Haz clic para subir',
        uploadHint: 'Foto, DOC o PDF (máx 10MB)',
        esInquilino: '¿Es inquilino?',
      },

      landlordContent: {
        title: 'Datos del arrendador',
        nombres: 'Nombres',
        numeroContacto: 'Número de contacto',
        nombresPlaceholder: 'Nombre completo del arrendador',
        telefonoPlaceholder: '999 888 777',
      },

      actionsContent: {
        cancelar: 'Cancelar',
        regresar: 'Regresar',
        enviarSolicitud: 'Enviar solicitud de visita',
      }
    };
  },

  computed: {
    // --- Flag cómodo
    isTenant(){
      return !!this.serviceRequest?.supportDocs?.esInquilino;
    },

    // ======= VALIDACIONES
    isLandlordPhoneValid(){
      const phone = this.serviceRequest.landlordData.numeroContacto;
      if (!phone) return false;
      const compact = String(phone).replace(/\s/g, '');
      return /^9\d{8}$/.test(compact); // Perú
    },

    fieldErrors(){
      const e = {};
      const docs = this.serviceRequest.supportDocs;
      const landlord = this.serviceRequest.landlordData;

      // --- Documentación de respaldo (siempre obligatoria)
      if (this.touched.reciboServicio || this.showValidation) {
        if (!docs.reciboServicio) e.reciboServicio = 'El archivo es obligatorio';
      }
      if (this.touched.documentoIdentidad || this.showValidation) {
        if (!docs.documentoIdentidad) e.documentoIdentidad = 'El archivo es obligatorio';
      }

      // --- Datos del arrendador (SOLO si es inquilino)
      if (this.isTenant) {
        if (this.touched.nombres || this.showValidation) {
          if (!landlord.nombres || landlord.nombres.trim().length < 2) {
            e.nombres = 'Ingresa nombres válidos';
          }
        }
        if (this.touched.numeroContacto || this.showValidation) {
          if (!landlord.numeroContacto) {
            e.numeroContacto = 'El número de contacto es obligatorio';
          } else if (!this.isLandlordPhoneValid) {
            e.numeroContacto = 'Debe iniciar con 9 y tener 9 dígitos';
          }
        }
      }

      return e;
    },

    isFormValid(){
      const docs = this.serviceRequest.supportDocs;
      const landlord = this.serviceRequest.landlordData;

      const docsOk = docs.reciboServicio && docs.documentoIdentidad;

      // Si NO es inquilino, no exigimos arrendador
      const landlordOk = !this.isTenant
          || (landlord.nombres && landlord.numeroContacto && this.isLandlordPhoneValid);

      return Boolean(
          docsOk &&
          landlordOk &&
          Object.keys(this.fieldErrors).length === 0
      );
    }
  },

  watch: {
    // Al desactivar "Es inquilino" limpiamos y desmarcamos touched de arrendador
    'serviceRequest.supportDocs.esInquilino'(val){
      if (!val) {
        this.serviceRequest.landlordData = { nombres: '', numeroContacto: '' };
        this.touched.nombres = false;
        this.touched.numeroContacto = false;
      }
    }
  },

  methods: {
    onFieldBlur(field){ this.touched[field] = true; },

    // Métodos para FileUploader
    onFileSelected(file, fieldKey) {
      console.log(`Archivo seleccionado para ${fieldKey}:`, file.name)
      this.touched[fieldKey] = true
    },

    onFileRemoved(fieldKey) {
      console.log(`Archivo eliminado de ${fieldKey}`)
      this.touched[fieldKey] = true
    },

    handleFileValidationError(errors, fieldKey) {
      errors.forEach(error => {
        console.warn(`Error en ${fieldKey}:`, error.message)
        this.$toast?.add({
          severity: 'warn', 
          summary: 'Error de archivo', 
          detail: error.message
        })
      })
    },

    // Métodos específicos para cada campo
    onReciboSelected(file) { this.onFileSelected(file, 'reciboServicio') },
    onReciboRemoved() { this.onFileRemoved('reciboServicio') },
    onReciboValidationError(errors) { this.handleFileValidationError(errors, 'reciboServicio') },

    onIdentidadSelected(file) { this.onFileSelected(file, 'documentoIdentidad') },
    onIdentidadRemoved() { this.onFileRemoved('documentoIdentidad') },
    onIdentidadValidationError(errors) { this.handleFileValidationError(errors, 'documentoIdentidad') },

    focusFirstError(){
      const first = Object.keys(this.fieldErrors)[0];
      if (!first) return;
      const ids = {
        reciboServicio: 'file-uploader-recibo',
        documentoIdentidad: 'file-uploader-identidad',
        nombres: 'land-nombres',
        numeroContacto: 'land-telefono'
      };
      this.$nextTick(() => {
        const el = document.getElementById(ids[first] || 'file-uploader-recibo');
        if (el) el.focus();
      });
    },

    onCancel(){ this.$router.push('/'); },
    onBack(){ this.$router.back(); },

    onSubmit(){
      this.showValidation = true;
      if (!this.isFormValid) { this.focusFirstError(); return; }
      this.$router.push({ name: 'confirmation' } );
    }
  },

  created(){
    if (!this.serviceRequest.supportDocs) {
      this.serviceRequest.supportDocs = { reciboServicio: null, documentoIdentidad: null, esInquilino: false };
    }

    if (!this.serviceRequest.landlordData) {
      this.serviceRequest.landlordData = { nombres: '', numeroContacto: '' };
    }
  }
};
</script>

<template>
  <div class="page-container">
    <div class="form-wrapper p-4">
      <form class="grid formgrid p-fluid" @submit.prevent="onSubmit" @keydown.enter.prevent>

        <!-- ===== Documentación de respaldo ===== -->
        <div class="col-12">
          <div class="section-title">
            <i class="pi pi-folder"></i>
            <h2>{{ supportDocsContent.title }}</h2>
          </div>
        </div>

        <!-- Recibo de servicio -->
        <div class="field col-12 md:col-6">
          <FileUploader
            v-model="serviceRequest.supportDocs.reciboServicio"
            input-id="file-uploader-recibo"
            file-type="any"
            :label="supportDocsContent.reciboServicio"
            placeholder="Haz clic para subir recibo"
            hint="Imagen, PDF, DOC o DOCX (máximo 10MB)"
            drag-text=" o arrastra aquí"
            :max-file-size="10 * 1024 * 1024"
            :accepted-formats="[
              'image/jpeg', 'image/png', 'image/webp', 'image/gif',
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]"
            :error-messages="{
              fileTooBig: 'El archivo es muy grande. Máximo {maxSize}',
              invalidFormat: 'Solo se permiten: {formats}'
            }"
            required
            @file-selected="onReciboSelected"
            @file-removed="onReciboRemoved"
            @validation-error="onReciboValidationError"
          />
          <small v-if="(touched.reciboServicio || showValidation) && fieldErrors.reciboServicio"
                 class="text-red-500">{{ fieldErrors.reciboServicio }}</small>
        </div>


        <!-- Documento de identidad -->
        <div class="field col-12 md:col-6">
          <file-uploader
            v-model="serviceRequest.supportDocs.documentoIdentidad"
            input-id="file-uploader-identidad"
            file-type="any"
            :label="supportDocsContent.documentoIdentidad"
            placeholder="Haz clic para subir documento"
            hint="Imagen, PDF, DOC o DOCX (máximo 10MB)"
            drag-text=" o arrastra aquí"
            :max-file-size="10 * 1024 * 1024"
            :accepted-formats="[
              'image/jpeg', 'image/png', 'image/webp', 'image/gif',
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]"
            :error-messages="{
              fileTooBig: 'El archivo es muy grande. Máximo {maxSize}',
              invalidFormat: 'Solo se permiten: {formats}'
            }"
            required
            @file-selected="onIdentidadSelected"
            @file-removed="onIdentidadRemoved"
            @validation-error="onIdentidadValidationError"
          />
          <small v-if="(touched.documentoIdentidad || showValidation) && fieldErrors.documentoIdentidad"
                 class="text-red-500">{{ fieldErrors.documentoIdentidad }}</small>
        </div>

        <!-- ¿Es inquilino? -->
        <div class="field col-12">
          <div class="flex align-items-center gap-3">
            <pv-input-switch
                inputId="es-inquilino"
                v-model="serviceRequest.supportDocs.esInquilino"
            />
            <label for="es-inquilino" class="font-medium">{{ supportDocsContent.esInquilino }}</label>
          </div>
        </div>

        <div class="col-12"><hr class="divider" /></div>

        <!-- ===== Datos del arrendador ===== -->
        <template v-if="isTenant">
          <div class="col-12">
            <div class="section-title">
              <i class="pi pi-building"></i>
              <h2>{{ landlordContent.title }}</h2>
            </div>
          </div>

          <!-- Nombres -->
          <div class="field col-12 md:col-6">
            <label for="land-nombres" class="font-medium">
              {{ landlordContent.nombres }} <span class="text-red-500">*</span>
            </label>
            <pv-input-text
                id="land-nombres"
                v-model="serviceRequest.landlordData.nombres"
                :placeholder="landlordContent.nombresPlaceholder"
                class="w-full"
                :aria-required="true"
                :aria-invalid="!!fieldErrors.nombres"
                :aria-describedby="fieldErrors.nombres ? 'err-land-nombres' : null"
                @blur="onFieldBlur('nombres')"
            />
            <small v-if="(touched.nombres || showValidation) && fieldErrors.nombres" id="err-land-nombres" class="text-red-500">
              {{ fieldErrors.nombres }}
            </small>
          </div>

          <!-- Teléfono -->
          <div class="field col-12 md:col-6">
            <label for="land-telefono" class="font-medium">
              {{ landlordContent.numeroContacto }} <span class="text-red-500">*</span>
            </label>
            <pv-icon-field iconPosition="left" class="w-full">
              <pv-input-icon class="pi pi-phone" />
              <pv-input-mask
                  id="land-telefono"
                  v-model="serviceRequest.landlordData.numeroContacto"
                  mask="999 999 999"
                  :placeholder="landlordContent.telefonoPlaceholder"
                  class="w-full"
                  :aria-required="true"
                  :aria-invalid="!!fieldErrors.numeroContacto"
                  :aria-describedby="fieldErrors.numeroContacto ? 'err-land-telefono' : null"
                  @blur="onFieldBlur('numeroContacto')"
              />
            </pv-icon-field>
            <small v-if="(touched.numeroContacto || showValidation) && fieldErrors.numeroContacto" id="err-land-telefono" class="text-red-500">
              {{ fieldErrors.numeroContacto }}
            </small>
          </div>
        </template>

        <!-- ===== Botones ===== -->
        <div class="col-12 flex justify-content-between gap-2 mt-2">
          <!-- Botón Cancelar (lado izquierdo) -->
          <div>
            <pv-button class="pl-4 pr-4 button-cancel" :label="actionsContent.cancelar" severity="secondary" outlined @click="onCancel"/>
          </div>

          <!-- Botones lado derecho -->
          <div class="flex gap-2">
            <pv-button class="pl-4 pr-4 button-back" :label="actionsContent.regresar" severity="secondary" @click="onBack"/>
            <pv-button class="pl-4 pr-4 button-submit" :label="actionsContent.enviarSolicitud" type="submit" :disabled="!isFormValid"/>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

.page-container{
  display:flex;
  width:100%;
  justify-content:center;
  align-items:flex-start;
}

.form-wrapper{
  display:flex;
  flex-direction:column;
  width:100%;
  max-width:1100px;
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

.divider{
  border:0; border-top:1px solid #E5E7EB; margin: .5rem 0 1rem 0;
}

/* Inputs */
.p-inputtext, .p-inputmask, .p-dropdown, .p-multiselect, .p-inputtextarea {
  background-color:transparent !important;
  color:#000 !important;
  border:1.5px solid var(--color-text-gray, #d1d5db) !important;
}

/* Estilo de los botones */

.button-cancel {
  background-color: transparent !important;
  border: 1.5px solid var(--color-text-gray, #d1d5db) !important;
  color: var(--color-text-gray, #6b7280) !important;
  font-weight: 600 !important;
  transition: background-color 0.3s, color 0.3s !important;
}

.button-cancel:hover {
  background-color: var(--color-coral) !important;
  border-color: var(--color-text-gray, #d1d5db) !important;
  color: #000 !important;
}


.button-back {
  background-color: #6B7280;
  border: 1.5px solid #6B7280;
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
