<script>

import FileUploader from "../../../shared/components/file-uploader.component.vue";
import {OrderServiceRequest} from "../services/service-request-api.service.js";
import {OrderResponse} from "../models/order-response.entity.js";

export default {
  name: 'support-docs-and-landlord-form',
  
  components: {
    FileUploader
  },
  
  inject: ['client', 'applicantCompany'],

  data () {
    return {
      touched: {},
      showValidation: false,
      
      // Estado para la creación de solicitud
      isCreatingRequest: false,
      hasValidationErrors: false,
      validationErrors: [],

      // Servicio para crear la solicitud
      orderServiceRequest: null,

      // Estado de la solicitud (antes estaba en serviceRequest)
      isRequestCreated: false,
      orderResponse: null,

      // Diálogos de confirmación
      showCancelDialog: false,
      showSubmitDialog: false,

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
    // --- Flag cómodo - ahora usa el modelo Client
    isTenant(){
      return !!this.client?.isTenant;
    },

    // Computed properties con getter/setter para manejar archivos
    serviceReceiptFile: {
      get() {
        const doc = this.client.documents.find(doc => doc.type === 'RECIBO_SERVICIO');
        return doc?.file || null;
      },
      set(file) {
        const existingIndex = this.client.documents.findIndex(doc => doc.type === 'RECIBO_SERVICIO');
        if (file) {
          const document = { type: 'RECIBO_SERVICIO', file: file, url: null };
          if (existingIndex >= 0) {
            this.client.documents[existingIndex] = document;
          } else {
            this.client.documents.push(document);
          }
        } else if (existingIndex >= 0) {
          this.client.documents.splice(existingIndex, 1);
        }
      }
    },

    identityDocFile: {
      get() {
        const doc = this.client.documents.find(doc => doc.type === 'DOCUMENTO_IDENTIDAD');
        return doc?.file || null;
      },
      set(file) {
        const existingIndex = this.client.documents.findIndex(doc => doc.type === 'DOCUMENTO_IDENTIDAD');
        if (file) {
          const document = { type: 'DOCUMENTO_IDENTIDAD', file: file, url: null };
          if (existingIndex >= 0) {
            this.client.documents[existingIndex] = document;
          } else {
            this.client.documents.push(document);
          }
        } else if (existingIndex >= 0) {
          this.client.documents.splice(existingIndex, 1);
        }
      }
    },

    // Computed properties para acceder a los documentos completos
    serviceReceiptDoc(){
      return this.client.documents.find(doc => doc.type === 'RECIBO_SERVICIO');
    },

    identityDoc(){
      return this.client.documents.find(doc => doc.type === 'DOCUMENTO_IDENTIDAD');
    },

    // ======= VALIDACIONES
    isLandlordPhoneValid(){
      const phone = this.client.landlordPhoneNumber;
      if (!phone) return false;
      const compact = String(phone).replace(/[\s-]/g, ''); // Quitar espacios y guiones
      return /^9\d{8}$/.test(compact); // Perú: 9 + 8 dígitos = 9 total
    },

    fieldErrors(){
      const e = {};

      // --- Documentación de respaldo (siempre obligatoria)
      if (this.touched.reciboServicio || this.showValidation) {
        if (!this.serviceReceiptDoc) e.reciboServicio = 'El archivo es obligatorio';
      }
      if (this.touched.documentoIdentidad || this.showValidation) {
        if (!this.identityDoc) e.documentoIdentidad = 'El archivo es obligatorio';
      }

      // --- Datos del arrendador (SOLO si es inquilino)
      if (this.isTenant) {
        if (this.touched.nombres || this.showValidation) {
          if (!this.client.landlordName || this.client.landlordName.trim().length < 2) {
            e.nombres = 'Ingresa nombres válidos';
          }
        }
        if (this.touched.numeroContacto || this.showValidation) {
          if (!this.client.landlordPhoneNumber) {
            e.numeroContacto = 'El número de contacto es obligatorio';
          } else if (!this.isLandlordPhoneValid) {
            e.numeroContacto = 'Debe iniciar con 9 y tener 9 dígitos';
          }
        }
      }

      return e;
    },

    isFormValid(){
      const docsOk = this.serviceReceiptDoc && this.identityDoc;

      // Si NO es inquilino, no exigimos arrendador
      const landlordOk = !this.isTenant
          || (this.client.landlordName && this.client.landlordPhoneNumber && this.isLandlordPhoneValid);

      return Boolean(
          docsOk &&
          landlordOk &&
          Object.keys(this.fieldErrors).length === 0
      );
    }
  },

  watch: {
    // Al desactivar "Es inquilino" limpiamos y desmarcamos touched de arrendador
    'client.isTenant'(val){
      if (!val) {
        this.client.landlordName = '';
        this.client.landlordPhoneNumber = '';
        this.touched.nombres = false;
        this.touched.numeroContacto = false;
      }
    }
  },

  methods: {
    onFieldBlur(field){ this.touched[field] = true; },

    /**
     * Método modular para mostrar toasts
     * @param {string} severity - Tipo: 'success', 'info', 'warn', 'error'
     * @param {string} summary - Título del toast
     * @param {string} detail - Mensaje detallado
     * @param {number} life - Duración en milisegundos (opcional, default: 5000)
     */
    showToast(severity, summary, detail, life = 5000) {
      if (this.$toast) {
        this.$toast.add({
          severity,
          summary,
          detail,
          life
        });
      } else {
        // Fallback para desarrollo/debugging
        console.warn(`[TOAST ${severity.toUpperCase()}] ${summary}: ${detail}`);
      }
    },

    // Métodos para FileUploader - simplificados ya que los computed properties manejan la lógica
    onFileSelected(file, fieldKey) {
      this.touched[fieldKey] = true
    },

    onFileRemoved(fieldKey) {
      this.touched[fieldKey] = true
    },

    handleFileValidationError(errors, fieldKey) {
      errors.forEach(error => {
        this.showToast('warn', 'Error de archivo', error.message);
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

    onCancel() { 
      this.showCancelDialog = true;
    },

    confirmCancel() {
      // Cerrar el diálogo
      this.showCancelDialog = false;
      
      // Emitir evento al componente padre para que maneje la cancelación
      // El padre se encargará de limpiar los datos y volver al paso inicial
      this.$emit('cancel');
    },

    cancelCancel() {
      this.showCancelDialog = false;
    },

    onBack() {
      // Emitir evento para que el componente padre maneje la navegación
      this.$emit('back');
    },

    async onSubmit(){
      this.showValidation = true;
      
      // Primero validar el formulario actual (documentación)
      if (!this.isFormValid) {
        this.focusFirstError(); 
        return; 
      }
      
      // Mostrar diálogo de confirmación
      this.showSubmitDialog = true;
    },

    async confirmSubmit() {
      this.showSubmitDialog = false;
      
      // Crear la solicitud directamente con los datos del cliente
      const success = await this.createRequest();

      if (success && this.orderResponse) {
        // Emitir evento al componente padre con los datos de la orden creada
        this.$emit('complete', this.orderResponse);
      }
    },

    cancelSubmit() {
      this.showSubmitDialog = false;
    },


    // Método para limpiar tipos de documento antiguos
    cleanOldDocumentTypes() {
      // Eliminar documentos con tipos antiguos
      const oldTypes = ['FACADE_PHOTO', 'SERVICE_RECEIPT', 'IDENTITY_DOCUMENT', 'DNI', 'CARNET_EXTRANJERIA', 'PTP', 'RECIBO_AGUA', 'RECIBO_LUZ'];
      
      this.client.documents = this.client.documents.filter(doc => {
        return !oldTypes.includes(doc.type);
      });
    },

    async createRequest() {
      try {
        // Validar que tenemos los datos necesarios
        if (!this.applicantCompany || !this.applicantCompany.applicantCompanyId) {
          throw new Error('Datos de empresa solicitante no disponibles');
        }

        if (!this.client || !this.client.name) {
          throw new Error('Datos del cliente no disponibles');
        }
        
        // Validar campos críticos del cliente
        const requiredClientFields = {
          name: this.client.name,
          lastName: this.client.lastName,
          documentType: this.client.documentType,
          documentNumber: this.client.documentNumber,
          phoneNumber: this.client.phoneNumber,
          department: this.client.department,
          province: this.client.province,
          district: this.client.district,
          homeAddress: this.client.homeAddress
        };
        
        const missingFields = Object.entries(requiredClientFields)
          .filter(([key, value]) => !value || value === '')
          .map(([key]) => key);
        
        if (missingFields.length > 0) {
          throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`);
        }

        const validDocuments = this.client.documents.filter(doc => doc.file && doc.file.name);
        
        if (validDocuments.length === 0) {
          throw new Error('No hay archivos válidos para enviar');
        }

        // Verificar que no haya tipos de documento antiguos
        const oldTypes = ['FACADE_PHOTO', 'SERVICE_RECEIPT', 'IDENTITY_DOCUMENT', 'DNI', 'CARNET_EXTRANJERIA', 'PTP', 'RECIBO_AGUA', 'RECIBO_LUZ'];
        const hasOldTypes = this.client.documents.some(doc => oldTypes.includes(doc.type));
        
        if (hasOldTypes) {
          throw new Error('Error interno: tipos de documento obsoletos detectados');
        }

        // Activar estado de carga
        this.isCreatingRequest = true;

        // Realizar la petición HTTP
        const response = await this.orderServiceRequest.create(this.applicantCompany, this.client);

        // Actualizar el estado de éxito con el modelo completo
        this.isRequestCreated = true;
        this.orderResponse = response.data;
        
        // Mostrar toast de éxito
        this.showToast('success', 'Solicitud Creada', 
          `Solicitud creada exitosamente. Código: ${this.orderResponse.orderCode}`);

        return true;

      } catch (error) {
        console.error('Error al crear solicitud:', error);

        this.showToast('error', 'Error', 
          error.response?.data?.message || 'Ocurrió un error al crear la solicitud. Intenta nuevamente.');

        return false;
      } finally {
        // Desactivar estado de carga
        this.isCreatingRequest = false;
      }
    },

    // Método para resetear los providers después de enviar la solicitud
  },

  created() {
    // Inicializar el servicio de solicitudes
    this.orderServiceRequest = new OrderServiceRequest('/orders');
    
    // 🧹 Limpiar documentos con tipos antiguos que puedan estar en memoria
    this.cleanOldDocumentTypes();
  }
};
</script>

<template>
  <pv-dialog></pv-dialog>
  <div class="flex justify-content-center w-full">
    <div class="form-wrapper p-3 w-full" style="max-width: 1200px;">
      <form class="formgrid grid p-fluid compact-form" @submit.prevent="onSubmit" @keydown.enter.prevent>

        <!-- ===== Documentación de respaldo ===== -->
        <div class="col-12">
          <div class="flex align-items-center gap-2 mb-2">
            <i class="pi pi-folder text-lg text-primary-local"></i>
            <h2 class="m-0 text-lg font-semibold text-primary-local">{{ supportDocsContent.title }}</h2>
          </div>
        </div>

        <!-- Recibo de servicio -->
        <div class="field col-12 md:col-6">
          <FileUploader
            v-model="serviceReceiptFile"
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
          <div class="error-container">
            <small v-if="(touched.reciboServicio || showValidation) && fieldErrors.reciboServicio"
                   class="error-message">{{ fieldErrors.reciboServicio }}</small>
          </div>
        </div>


        <!-- Documento de identidad -->
        <div class="field col-12 md:col-6">
          <file-uploader
            v-model="identityDocFile"
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
          <div class="error-container">
            <small v-if="(touched.documentoIdentidad || showValidation) && fieldErrors.documentoIdentidad"
                   class="error-message">{{ fieldErrors.documentoIdentidad }}</small>
          </div>
        </div>

        <!-- ¿Es inquilino? -->
        <div class="field col-12">
          <div class="flex align-items-center gap-3">
            <pv-input-switch
                inputId="es-inquilino"
                v-model="client.isTenant"
            />
            <label for="es-inquilino" class="font-medium text-color cursor-pointer text-sm">{{ supportDocsContent.esInquilino }}</label>
          </div>
        </div>

        <div class="col-12"><hr class="m-0 surface-border" /></div>

        <!-- ===== Datos del arrendador ===== -->
        <template v-if="isTenant">
          <div class="col-12">
            <div class="flex align-items-center gap-2 mb-2 mt-1">
              <i class="pi pi-building text-lg text-primary-local"></i>
              <h2 class="m-0 text-lg font-semibold text-primary-local">{{ landlordContent.title }}</h2>
            </div>
          </div>

          <!-- Nombres -->
          <div class="field col-12 md:col-6">
            <label for="land-nombres" class="block mb-1 font-medium text-color text-sm">
              {{ landlordContent.nombres }} <span class="text-red-500">*</span>
            </label>
            <pv-input-text
                id="land-nombres"
                v-model="client.landlordName"
                :placeholder="landlordContent.nombresPlaceholder"
                class="w-full input-compact"
                :aria-required="true"
                :aria-invalid="!!fieldErrors.nombres"
                :aria-describedby="fieldErrors.nombres ? 'err-land-nombres' : null"
                @blur="onFieldBlur('nombres')"
            />
            <div class="error-container">
              <small v-if="(touched.nombres || showValidation) && fieldErrors.nombres" id="err-land-nombres" class="error-message">
                {{ fieldErrors.nombres }}
              </small>
            </div>
          </div>

          <!-- Teléfono -->
          <div class="field col-12 md:col-6">
            <label for="land-telefono" class="block mb-1 font-medium text-color text-sm">
              {{ landlordContent.numeroContacto }} <span class="text-red-500">*</span>
            </label>
            <pv-icon-field class="w-full">
              <pv-input-icon class="pi pi-phone" />
              <pv-input-mask
                  id="land-telefono"
                  v-model="client.landlordPhoneNumber"
                  mask="999 999 999"
                  :placeholder="landlordContent.telefonoPlaceholder"
                  class="w-full input-compact"
                  :aria-required="true"
                  :aria-invalid="!!fieldErrors.numeroContacto"
                  :aria-describedby="fieldErrors.numeroContacto ? 'err-land-telefono' : null"
                  @blur="onFieldBlur('numeroContacto')"
              />
            </pv-icon-field>
            <div class="error-container">
              <small v-if="(touched.numeroContacto || showValidation) && fieldErrors.numeroContacto" id="err-land-telefono" class="error-message">
                {{ fieldErrors.numeroContacto }}
              </small>
            </div>
          </div>
        </template>

        <!-- ===== Botones ===== -->
        <div class="col-12 flex justify-content-between align-items-center gap-2 mt-2">
          <!-- Botón Cancelar (lado izquierdo) -->
          <pv-button 
              class="px-4 py-2 button-cancel" 
              :label="actionsContent.cancelar" 
              severity="secondary" 
              outlined 
              @click="onCancel"
          />

          <!-- Botones lado derecho -->
          <div class="flex gap-2">
            <pv-button 
              class="px-4 py-2 button-back" 
              :label="actionsContent.regresar" 
              severity="secondary" 
              :disabled="isCreatingRequest"
              @click="onBack"
            />
            <pv-button 
              class="px-4 py-2 button-submit" 
              :label="isCreatingRequest ? 'Enviando...' : actionsContent.enviarSolicitud" 
              :icon="isCreatingRequest ? 'pi pi-spin pi-spinner' : 'pi pi-send'"
              type="submit" 
              :disabled="!isFormValid || isCreatingRequest"
              :loading="isCreatingRequest"
            />
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- Dialog de confirmación para cancelar -->
  <pv-dialog 
    v-model:visible="showCancelDialog" 
    modal 
    :closable="false"
    :style="{ width: '400px' }"
    header="Confirmar cancelación"
  >
    <div class="flex flex-column gap-3">
      <div class="flex align-items-center gap-2">
        <i class="pi pi-exclamation-triangle text-orange-500 text-2xl"></i>
        <span>¿Está seguro que desea cancelar la solicitud?</span>
      </div>
      <p class="text-gray-600 text-sm m-0">
        Se perderán todos los datos ingresados y regresará al inicio del formulario.
      </p>
    </div>
    
    <template #footer>
      <div class="flex justify-content-end gap-2">
        <pv-button 
          label="No, continuar" 
          severity="secondary" 
          outlined 
          @click="cancelCancel"
        />
        <pv-button 
          label="Sí, cancelar" 
          severity="danger" 
          @click="confirmCancel"
        />
      </div>
    </template>
  </pv-dialog>

  <!-- Dialog de confirmación para enviar -->
  <pv-dialog 
    v-model:visible="showSubmitDialog" 
    modal 
    :closable="false"
    :style="{ width: '400px' }"
    header="Confirmar envío"
  >
    <div class="flex flex-column gap-3">
      <div class="flex align-items-center gap-2">
        <i class="pi pi-check-circle text-green-500 text-2xl"></i>
        <span>¿Está seguro que desea enviar la solicitud?</span>
      </div>
      <p class="text-gray-600 text-sm m-0">
        Una vez enviada, se creará la orden de servicio y se procesará la solicitud.
      </p>
    </div>
    
    <template #footer>
      <div class="flex justify-content-end gap-2">
        <pv-button 
          label="Cancelar" 
          severity="secondary" 
          outlined 
          @click="cancelSubmit"
        />
        <pv-button 
          label="Enviar solicitud" 
          severity="success" 
          @click="confirmSubmit"
        />
      </div>
    </template>
  </pv-dialog>
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

/* Botón Cancelar */
.button-cancel {
  background-color: transparent !important;
  border-color: var(--color-muted) !important;
  color: var(--color-text-gray) !important;
  font-weight: var(--font-weight-semibold) !important;
  transition: all 0.3s ease !important;
}

.button-cancel:hover:not(:disabled) {
  background-color: var(--color-coral) !important;
  border-color: var(--color-coral) !important;
  color: var(--color-white) !important;
  transform: translateY(-1px);
  box-shadow: var(--shadow) !important;
}

/* Botón Regresar */
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

/* Botón Submit */
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
