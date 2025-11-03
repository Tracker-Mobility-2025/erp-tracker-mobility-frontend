<script>
import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: 'email-send',
  components: {CreateAndEdit},

  props: {
    item: null,
    visible: Boolean,
    recipientEmail: {
      type: String,
      default: ''
    },
    subject: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    reportCode: {
      type: String,
      default: 'N/A'
    }
  },

  data() {
    return {
      submitted: false,
      emailEntity: {
        recipientEmail: '',
        subject: '',
        message: ''
      }
    };
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        // Pre-llenar los datos cuando se abre el diálogo
        this.emailEntity = {
          recipientEmail: this.recipientEmail || '',
          subject: this.subject || '',
          message: this.message || ''
        };
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
        this.$emit('save-requested', this.emailEntity);
        this.resetForm();
      }
    },

    isFormValid() {
      const emailValid = this.emailEntity.recipientEmail && this.isValidEmail(this.emailEntity.recipientEmail);
      const subjectValid = this.emailEntity.subject && this.emailEntity.subject.trim().length > 0;

      return emailValid && subjectValid;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    resetForm() {
      this.emailEntity = {
        recipientEmail: '',
        subject: '',
        message: ''
      };
      this.submitted = false;
    }

  },

  created() {
    console.log('Email Send Dialog component created');
  }

};

</script>

<template>
  <create-and-edit
    :entity="emailEntity"
    :visible="visible"
    entity-name="correo electrónico"
    :edit="false"
    size="standard"
    custom-button-label="Enviar correo"
    @canceled-shared="cancelRequested"
    @saved-shared="saveRequested"
  >
    <template #content>
      <div class="grid p-2">

        <!-- Campo: Correo del destinatario -->
        <div class="col-12 px-2 pb-1">
          <div class="field">
            <label for="recipientEmail" class="block text-900 font-medium mb-2">
              <i class="pi pi-envelope mr-2"></i>Correo del destinatario <span class="text-red-500">*</span>
            </label>
            <pv-input-text
              id="recipientEmail"
              v-model="emailEntity.recipientEmail"
              type="email"
              class="w-full"
              size="small"
              placeholder="ejemplo@correo.com"
              :aria-invalid="submitted && (!emailEntity.recipientEmail || !isValidEmail(emailEntity.recipientEmail))"
              aria-describedby="recipientEmail-error"
              :class="{ 'p-invalid': submitted && (!emailEntity.recipientEmail || !isValidEmail(emailEntity.recipientEmail)) }"
            />
            <small v-if="submitted && !emailEntity.recipientEmail" class="p-error">
              Por favor, ingrese el correo electrónico del destinatario. Este campo es obligatorio.
            </small>
            <small v-else-if="submitted && emailEntity.recipientEmail && !isValidEmail(emailEntity.recipientEmail)"
                   class="p-error">
              El formato del correo electrónico no es válido. Debe seguir el formato: usuario@dominio.com
            </small>
          </div>
        </div>

        <!-- Campo: Asunto -->
        <div class="col-12 px-2 pb-1">
          <div class="field">
            <label for="emailSubject" class="block text-900 font-medium mb-2">
              <i class="pi pi-tag mr-2"></i>Asunto <span class="text-red-500">*</span>
            </label>
            <pv-input-text
              id="emailSubject"
              v-model="emailEntity.subject"
              class="w-full"
              size="small"
              placeholder="Asunto del correo"
              :aria-invalid="submitted && (!emailEntity.subject || emailEntity.subject.trim().length === 0)"
              aria-describedby="emailSubject-error"
              :class="{ 'p-invalid': submitted && (!emailEntity.subject || emailEntity.subject.trim().length === 0) }"
            />
            <small v-if="submitted && (!emailEntity.subject || emailEntity.subject.trim().length === 0)" class="p-error">
              Por favor, ingrese el asunto del correo. Describa brevemente el contenido del mensaje.
            </small>
          </div>
        </div>

        <!-- Campo: Mensaje -->
        <div class="col-12 px-2 pb-1">
          <div class="field">
            <label for="emailMessage" class="block text-900 font-medium mb-2">
              <i class="pi pi-comment mr-2"></i>Mensaje (opcional)
            </label>
            <pv-textarea
              id="emailMessage"
              v-model="emailEntity.message"
              rows="5"
              class="w-full"
              placeholder="Mensaje adicional..."
            />
          </div>
        </div>

        <!-- Información del reporte -->
        <div class="col-12 px-2">
          <div class="bg-blue-50 border-1 border-blue-200 border-round p-3">
            <p class="text-sm text-gray-700 m-0 mb-2">
              <i class="pi pi-info-circle text-blue-500 mr-2"></i>
              <strong>Código de reporte:</strong> {{ reportCode }}
            </p>
            <p class="text-sm text-gray-700 m-0">
              <i class="pi pi-file-pdf text-red-500 mr-2"></i>
              <strong>Nota:</strong> El reporte en formato PDF se adjuntará automáticamente al correo electrónico.
            </p>
          </div>
        </div>

      </div>
    </template>

  </create-and-edit>

</template>

<style scoped>

</style>

