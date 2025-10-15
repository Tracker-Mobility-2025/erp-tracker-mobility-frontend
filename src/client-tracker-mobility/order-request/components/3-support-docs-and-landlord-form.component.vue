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
        const doc = this.client.documents.find(doc => doc.type === 'RECIBO_AGUA' || doc.type === 'RECIBO_LUZ');
        return doc?.file || null;
      },
      set(file) {
        const existingIndex = this.client.documents.findIndex(doc => doc.type === 'RECIBO_AGUA' || doc.type === 'RECIBO_LUZ');
        if (file) {
          const document = { type: 'RECIBO_AGUA', file: file, url: null }; // Usar RECIBO_AGUA por defecto
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
        const doc = this.client.documents.find(doc => doc.type === 'DNI' || doc.type === 'CARNET_EXTRANJERIA' || doc.type === 'PTP');
        return doc?.file || null;
      },
      set(file) {
        const existingIndex = this.client.documents.findIndex(doc => doc.type === 'DNI' || doc.type === 'CARNET_EXTRANJERIA' || doc.type === 'PTP');
        if (file) {
          const document = { type: 'DNI', file: file, url: null }; // Usar DNI por defecto
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
      return this.client.documents.find(doc => doc.type === 'RECIBO_AGUA' || doc.type === 'RECIBO_LUZ');
    },

    identityDoc(){
      return this.client.documents.find(doc => doc.type === 'DNI' || doc.type === 'CARNET_EXTRANJERIA' || doc.type === 'PTP');
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
      // Limpiar datos del localStorage
      localStorage.removeItem('client');
      localStorage.removeItem('applicantCompany');
      localStorage.removeItem('orderCreated');
      localStorage.removeItem('orderNumber');
      localStorage.removeItem('orderData');
      
      // Resetear los providers inyectados solo si no se ha creado una solicitud exitosa
      if (!this.isRequestCreated) {
        this.resetProvidersForNewRequest();
      }
      
      this.showCancelDialog = false;
      // Redirigir a la primera vista del formulario
      this.$router.push({ name: 'customer-data' });
    },

    cancelCancel() {
      this.showCancelDialog = false;
    },

    onBack(){ this.$router.back(); },

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

      if (success) {
        // Navegar al resumen con los datos de la orden creada usando provide/inject
        this.$router.push({ name: 'confirmation' });
      }
    },

    cancelSubmit() {
      this.showSubmitDialog = false;
    },


    // Método para limpiar tipos de documento antiguos
    cleanOldDocumentTypes() {
      // Eliminar documentos con tipos antiguos
      const oldTypes = ['FACADE_PHOTO', 'SERVICE_RECEIPT', 'IDENTITY_DOCUMENT'];
      
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

        const validDocuments = this.client.documents.filter(doc => doc.file && doc.file.name);
        
        if (validDocuments.length === 0) {
          throw new Error('No hay archivos válidos para enviar');
        }

        // Verificar que no haya tipos de documento antiguos
        const oldTypes = ['FACADE_PHOTO', 'SERVICE_RECEIPT', 'IDENTITY_DOCUMENT'];
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
        this.orderResponse = response.data; // Ya es una instancia de OrderResponse
        
        // Actualizar la orderResponse en el componente padre
        // Buscar el componente padre que tiene la propiedad orderResponse
        let parent = this.$parent;
        let maxDepth = 5; // Limitar la búsqueda para evitar bucles infinitos
        let currentDepth = 0;
        
        while (parent && !('orderResponse' in parent) && currentDepth < maxDepth) {
          parent = parent.$parent;
          currentDepth++;
        }
        
        if (parent && ('orderResponse' in parent)) {
          parent.orderResponse = this.orderResponse;
        }
        
        // Guardar datos en localStorage como fallback
        localStorage.setItem('orderCreated', 'true');
        localStorage.setItem('orderNumber', this.orderResponse.orderCode);
        localStorage.setItem('orderData', JSON.stringify(this.orderResponse));
        
        // Mostrar toast de éxito
        this.showToast('success', 'Solicitud Creada', 
          `Solicitud creada exitosamente. Código: ${this.orderResponse.orderCode}`);

        // NO resetear providers aquí - se hará en el componente de resumen al finalizar
        // this.resetProvidersForNewRequest();

        return true;

      } catch (error) {
        console.error('Error al crear la solicitud:', error);

        this.showToast('error', 'Error', 
          error.response?.data?.message || 'Ocurrió un error al crear la solicitud. Intenta nuevamente.');

        return false;
      } finally {
        // Desactivar estado de carga
        this.isCreatingRequest = false;
      }
    },

    // Método para resetear los providers después de enviar la solicitud
    resetProvidersForNewRequest() {
      // Buscar el componente padre que provee los datos
      let parent = this.$parent;
      let maxDepth = 10;
      let currentDepth = 0;
      
      while (parent && currentDepth < maxDepth) {
        // Buscar el componente que tiene las instancias de client y applicantCompany
        if (parent.client && parent.applicantCompany && 
            typeof parent.client === 'object' && 
            typeof parent.applicantCompany === 'object') {
          
          // Crear nuevas instancias para la próxima solicitud
          setTimeout(() => {
            // Importar las clases para reinicializar
            import('../models/client.entity.js').then(({ Client }) => {
              parent.client = new Client();
            });
            
            import('../models/applicant-company.entity.js').then(({ ApplicantCompany }) => {
              parent.applicantCompany = new ApplicantCompany({});
            });
            
            // Limpiar también orderResponse si existe (excepto la actual que se mostrará en el resumen)
            // No limpiamos parent.orderResponse aquí porque se necesita para el resumen
            
          }, 100); // Pequeño delay pour asegurar que la navegación se complete primero
          
          break;
        }
        parent = parent.$parent;
        currentDepth++;
      }
    },



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
          <small v-if="(touched.reciboServicio || showValidation) && fieldErrors.reciboServicio"
                 class="text-red-500">{{ fieldErrors.reciboServicio }}</small>
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
          <small v-if="(touched.documentoIdentidad || showValidation) && fieldErrors.documentoIdentidad"
                 class="text-red-500">{{ fieldErrors.documentoIdentidad }}</small>
        </div>

        <!-- ¿Es inquilino? -->
        <div class="field col-12">
          <div class="flex align-items-center gap-3">
            <pv-input-switch
                inputId="es-inquilino"
                v-model="client.isTenant"
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
                v-model="client.landlordName"
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
                  v-model="client.landlordPhoneNumber"
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
            <pv-button 
              class="pl-4 pr-4 button-back" 
              :label="actionsContent.regresar" 
              severity="secondary" 
              :disabled="isCreatingRequest"
              @click="onBack"
            />
            <pv-button 
              class="pl-4 pr-4 button-submit" 
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
