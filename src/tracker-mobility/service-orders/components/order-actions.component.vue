<script>

import {OrderService} from "../models/order-service.entity.js";
import {VerifierApi} from "../services/verifier-api.service.js";
import {OrderRequestApi} from "../services/order-request-api.service.js";

export default {
  name: 'order-actions',
  components: {
  },

  props : {
    item: {
      type: OrderService,
      required: true,
    },

    verifiersList: {
      type: Array,
      required: true,
    },

    statusOptions: {
      type: Array,
      required: false,
    }
  },

  data() {
    return {

      // Servicio de API para órdenes de servicio
      orderRequestApi: new OrderRequestApi('/orders'),

      // Datos locales para evitar mutación directa del prop
      localHomeVisitDetails: {
        verifierId: null,
        visitDate: null,
        visitTime: null
      },

      // Estados de edición para secciones específicas
      editingStates: {
        verifier: false,
        observations: false
      },

      // Datos originales para restaurar en caso de cancelar edición
      originalData: {
        verifier: {},
        observations: {}
      },

      // Datos para la nueva observación
      currentObservation: {
        documentType: 'Documento de identidad',
        description: ''
      }
    };
  },

  computed: {

    // Formatear lista de verificadores para el dropdown
    verifiersListFormatted() {
      return this.verifiersList.map(verifier => ({
        ...verifier,
        fullName: `${verifier.name || ''} ${verifier.lastName || ''}`.trim()
      }));
    },

    // Validación en tiempo real para los campos de asignación
    isVerifierAssignmentValid() {
      if (!this.editingStates.verifier) return true;
      
      const { verifierId, visitDate, visitTime } = this.localHomeVisitDetails;
      return verifierId && visitDate && visitTime;
    },

  },

  methods : {
    // Inicializar datos locales desde el prop
    initializeLocalData() {
      if (this.item.homeVisitDetails) {
        this.localHomeVisitDetails = {
          verifierId: this.item.homeVisitDetails.verifierId || null,
          visitDate: this.item.homeVisitDetails.visitDate || null,
          visitTime: this.item.homeVisitDetails.visitTime || null
        };
      } else {
        this.localHomeVisitDetails = {
          verifierId: null,
          visitDate: null,
          visitTime: null
        };
      }
    },

    // Formatear fecha para envío al API
    formatDate(date) {
      if (!date) return null;
      if (date instanceof Date) {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
      }
      return date;
    },

    // Formatear hora para envío al API
    formatTime(time) {
      if (!time) return null;
      if (time instanceof Date) {
        return time.toTimeString().split(' ')[0].substring(0, 5); // HH:mm
      }
      return time;
    },

    // Obtener etiqueta del estado para mostrar en solo lectura
    getStatusLabel(statusValue) {
      if (!this.statusOptions || !statusValue) return 'Sin estado';
      
      const statusOption = this.statusOptions.find(option => option.value === statusValue);
      return statusOption ? statusOption.label : statusValue;
    },

    // Habilitar modo edición para una sección específica
    enableEditing(section) {
      // Guardar datos originales de la sección específica
      if (section === 'verifier') {
        this.originalData.verifier = {
          verifierId: this.localHomeVisitDetails.verifierId,
          visitDate: this.localHomeVisitDetails.visitDate,
          visitTime: this.localHomeVisitDetails.visitTime
        };
      } else if (section === 'observations') {
        this.originalData.observations = {
          observations: [...(this.item.observations || [])]
        };
      }

      this.editingStates[section] = true;
    },

    // Cancelar edición y restaurar datos originales para una sección específica
    cancelEditing(section) {
      // Restaurar datos originales de la sección específica
      if (section === 'verifier') {
        this.localHomeVisitDetails.verifierId = this.originalData.verifier.verifierId;
        this.localHomeVisitDetails.visitDate = this.originalData.verifier.visitDate;
        this.localHomeVisitDetails.visitTime = this.originalData.verifier.visitTime;
      } else if (section === 'observations') {
        this.item.observations = [...this.originalData.observations.observations];
      }

      this.editingStates[section] = false;
      this.originalData[section] = {};
    },

    // Asignar verificador a una orden de servicio (programar fecha de visita y hora de visita)
    assignVerifierToOrder() {
      // Validar que se hayan seleccionado todos los campos requeridos
      const validation = this.validateVerifierAssignment();

      // Si la validación falla, mostrar mensaje de error y salir
      if (!validation.isValid) {
        this.showToast('error', 'Error de validación', validation.message);
        return;
      }

      // Preparar datos para la actualización con formato correcto
      const updateData = {
        verifierId: this.localHomeVisitDetails.verifierId,
        visitDate: this.formatDate(this.localHomeVisitDetails.visitDate),
        visitTime: this.formatTime(this.localHomeVisitDetails.visitTime)
      };

      // Llamar al servicio API para actualizar la orden de servicio
      this.orderRequestApi.assignVerifier(this.item.id, updateData).then(response => {

          // Deshabilitar modo edición
          this.editingStates.verifier = false;
          this.originalData.verifier = {};

          this.showToast('success', 'Verificador asignado', 'El verificador ha sido asignado correctamente a la orden de servicio.');
        })
        .catch(error => {
          console.error('Error al asignar verificador:', error);
          
          let errorMessage = 'Hubo un error al asignar el verificador.';
          
          if (error.response) {
            // Error del servidor
            switch(error.response.status) {
              case 404:
                errorMessage = 'Orden de servicio no encontrada.';
                break;
              case 400:
                errorMessage = 'Datos inválidos. Verifique la información ingresada.';
                break;
              case 409:
                errorMessage = 'El verificador ya está asignado a otra orden en esa fecha y hora.';
                break;
              case 500:
                errorMessage = 'Error interno del servidor. Intente más tarde.';
                break;
              default:
                errorMessage = `Error del servidor (${error.response.status}). Contacte al administrador.`;
            }
          } else if (error.request) {
            errorMessage = 'Error de conexión. Verifique su conexión a internet.';
          } else {
            errorMessage = 'Error inesperado. Por favor, intente nuevamente.';
          }
          
          this.showToast('error', 'Error al asignar verificador', errorMessage);
        });
    },

    // Validar los campos requeridos para la asignación del verificador
    validateVerifierAssignment() {
      const { verifierId, visitDate, visitTime } = this.localHomeVisitDetails;
      
      if (!verifierId) {
        return {
          isValid: false,
          message: 'Debe seleccionar un verificador.'
        };
      }
      
      if (!visitDate) {
        return {
          isValid: false,
          message: 'Debe ingresar la fecha de visita.'
        };
      }
      
      if (!visitTime) {
        return {
          isValid: false,
          message: 'Debe ingresar la hora de visita.'
        };
      }

      // Validar que la fecha de visita no sea en el pasado
      if (visitDate instanceof Date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (visitDate < today) {
          return {
            isValid: false,
            message: 'La fecha de visita no puede ser en el pasado.'
          };
        }
      }
      
      return {
        isValid: true,
        message: ''
      };
    },

    // Método para mostrar toast messages
    showToast(severity, summary, detail, life = 3000) {
      // Verificar si PrimeVue Toast está disponible
      if (this.$toast && typeof this.$toast.add === 'function') {
        this.$toast.add({
          severity: severity,
          summary: summary,
          detail: detail,
          life: life
        });
      } else {
        // Fallback para consola si Toast no está disponible
        console.log(`${severity.toUpperCase()}: ${summary} - ${detail}`);
      }
    },


    // Enviar observaciones de la orden de servicio
    submitOrderObservations() {
      // Crear nueva observación con ID único
      const newObservation = {
        id: Date.now(), // ID temporal
        documentType: this.currentObservation.documentType,
        description: this.currentObservation.description
      };

      // Añadir la nueva observación al array de observaciones
      if (!this.item.observations) {
        this.item.observations = [];
      }
      this.item.observations.push(newObservation);

      // Limpiar el formulario de observación actual
      this.currentObservation = {
        documentType: 'Documento de identidad',
        description: ''
      };

      this.editingStates.observations = false;
    },


  },

  created() {
    // Inicializar datos locales desde el prop item
    this.initializeLocalData();

    // Asegurar que observations existe
    if (!this.item.observations) {
      this.item.observations = [];
    }
  },

  watch: {
    // Observar cambios en el item prop para sincronizar datos locales
    item: {
      handler(newItem) {
        if (newItem) {
          // Sincronizar datos locales con el nuevo item
          this.initializeLocalData();
          
          // Reinicializar observations si no existe
          if (!newItem.observations) {
            newItem.observations = [];
          }
        }
      },
      immediate: true,
      deep: true
    }
  }
};

</script>

<template>
  <div class="flex flex-column gap-4 w-full">

    <!-- ====================== Card -> Asignar a verificador ====================== -->
    <pv-card class="w-full">
      <template #header>
        <div class="flex align-items-center gap-2 px-3 py-2" style="background-color: #4A60D0; color: white;">
          <i class="pi pi-user-plus" style="color: white;"></i>
          <span class="text-lg font-bold">Asignar a verificador</span>
        </div>
      </template>
      <template #content>

        <div class="field mb-3">
          <label for="verifier" class="font-medium text-gray-700 flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            Seleccionar verificador *
            <span class="text-red-500">*</span>
          </label>
          <pv-select
              id="verifier"
              v-model="localHomeVisitDetails.verifierId"
              :options="verifiersListFormatted"
              optionLabel="fullName"
              optionValue="id"
              placeholder="Ingresar el nombre del verificador"
              class="w-full mt-1"
              :class="{ 'p-invalid': editingStates.verifier && !localHomeVisitDetails.verifierId }"
              :disabled="!editingStates.verifier"
          />
        </div>

        <div class="formgrid grid mb-4">
          <div class="field col-6">
            <label for="visitDate" class="font-medium text-gray-700 flex align-items-center gap-2">
              <i class="pi pi-calendar text-primary"></i>
              Fecha de visita *
              <span class="text-red-500">*</span>
            </label>
            <pv-calendar
                id="visitDate"
                v-model="localHomeVisitDetails.visitDate"
                placeholder="dd/mm/aaaa"
                dateFormat="dd/mm/yy"
                class="w-full mt-1"
                :class="{ 'p-invalid': editingStates.verifier && !localHomeVisitDetails.visitDate }"
                showIcon
                :disabled="!editingStates.verifier"
            />
          </div>
          <div class="field col-6">
            <label for="visitTime" class="font-medium text-gray-700 flex align-items-center gap-2">
              <i class="pi pi-clock text-primary"></i>
              Hora de visita *
              <span class="text-red-500">*</span>
            </label>
            <pv-calendar
                id="visitTime"
                v-model="localHomeVisitDetails.visitTime"
                timeOnly
                placeholder="hh:mm"
                class="w-full mt-1"
                :class="{ 'p-invalid': editingStates.verifier && !localHomeVisitDetails.visitTime }"
                showIcon
                :disabled="!editingStates.verifier"
            />
          </div>
        </div>

        <div class="flex gap-2 w-full">
          <!-- Botón de Editar (cuando no está editando) -->
          <pv-button
              v-if="!editingStates.verifier"
              label="Editar"
              icon="pi pi-pencil"
              class="p-button-warning w-full"
              @click="enableEditing('verifier')"
          />

          <!-- Botones de acción (cuando está editando) -->
          <template v-if="editingStates.verifier">
            <pv-button
                label="Asignar"
                icon="pi pi-user-plus"
                class="p-button-primary flex-1"
                :disabled="!isVerifierAssignmentValid"
                @click="assignVerifierToOrder"
            />
            <pv-button
                label="Cancelar"
                icon="pi pi-times"
                class="p-button-secondary flex-1"
                @click="cancelEditing('verifier')"
            />
          </template>
        </div>
      </template>
    </pv-card>

    <!-- ====================== Card -> Estado del Servicio ====================== -->
    <pv-card class="w-full">
      <template #header>
        <div class="flex align-items-center gap-2 px-3 py-2" style="background-color: #4A60D0; color: white;">
          <i class="pi pi-flag" style="color: white;"></i>
          <span class="text-lg font-bold">Estado del Servicio</span>
        </div>
      </template>
      <template #content>

        <div class="field mb-3">
          <label class="font-medium text-gray-700 flex align-items-center gap-2 mb-2">
            <i class="pi pi-info-circle text-primary"></i>
            Estado actual
          </label>
          <div class="p-3 border-1 border-300 border-round bg-gray-50 flex align-items-center gap-2">
            <i class="pi pi-circle-fill text-primary"></i>
            <span class="font-semibold text-gray-800">
              {{ getStatusLabel(item.status) }}
            </span>
          </div>
        </div>
      </template>
    </pv-card>

    <!-- ====================== Card -> Observaciones ====================== -->
    <pv-card class="w-full">
      <template #header>
        <div class="flex align-items-center gap-2 px-3 py-2" style="background-color: #4A60D0; color: white;">
          <i class="pi pi-comment" style="color: white;"></i>
          <span class="text-lg font-bold">Observaciones</span>
        </div>
      </template>
      <template #content>

        <div class="field mb-3">
          <label for="documentType" class="font-medium text-gray-700 flex align-items-center gap-2">
            <i class="pi pi-file text-primary"></i>
            Selecciona el documento
          </label>
          <pv-select
              id="documentType"
              v-model="currentObservation.documentType"
              :options="[
              { label: 'Documento de identidad', value: 'Documento de identidad' },
              { label: 'Recibo de servicios', value: 'Recibo de servicios' }
            ]"
              optionLabel="label"
              optionValue="value"
              placeholder="Documento de identidad"
              class="w-full mt-1"
              :disabled="!editingStates.observations"
          />
        </div>

        <div class="field mb-4">
          <label for="observations" class="font-bold text-primary flex align-items-center gap-2">
            <i class="pi pi-align-left text-primary"></i>
            Descripción
          </label>
          <pv-textarea
              id="observations"
              v-model="currentObservation.description"
              :rows="3"
              placeholder="Los datos del documento de identidad no coinciden con los datos del cliente"
              class="w-full mt-1"
              :disabled="!editingStates.observations"
          />
        </div>

        <div class="flex gap-2 w-full">
          <!-- Botón de Editar (cuando no está editando) -->
          <pv-button
              v-if="!editingStates.observations"
              label="Editar"
              icon="pi pi-pencil"
              class="p-button-warning w-full"
              @click="enableEditing('observations')"
          />

          <!-- Botones de acción (cuando está editando) -->
          <template v-if="editingStates.observations">
            <pv-button
                label="Guardar"
                icon="pi pi-save"
                class="p-button-primary flex-1"
                @click="submitOrderObservations"
            />
            <pv-button
                label="Cancelar"
                icon="pi pi-times"
                class="p-button-secondary flex-1"
                @click="cancelEditing('observations')"
            />
          </template>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>

:deep(.p-card-content) {
  padding: 0.5rem;
}

/* Estilos para el header de las cards */
:deep(.p-card .p-card-header) {
  background-color: #4A60D0 !important;
  color: white !important;
  border-top-left-radius: var(--border-radius) !important;
  border-top-right-radius: var(--border-radius) !important;
  padding: 0 !important;
  border-bottom: none !important;
}

/* Asegurar que la card mantenga sus bordes redondeados */
:deep(.p-card) {
  border-radius: var(--border-radius) !important;
  overflow: hidden !important;
}

/* Estilos para campos requeridos */
.text-red-500 {
  color: #ef4444;
}

/* Estilos para campos inválidos */
:deep(.p-invalid) {
  border-color: #ef4444 !important;
}

:deep(.p-invalid:focus) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.2) !important;
}

/* Estilos para select inválido */
:deep(.p-select.p-invalid) {
  border-color: #ef4444 !important;
}

:deep(.p-select.p-invalid:not(.p-disabled):hover) {
  border-color: #ef4444 !important;
}

:deep(.p-select.p-invalid:not(.p-disabled).p-focus) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.2) !important;
}

/* Estilos para calendar inválido */
:deep(.p-inputwrapper-invalid .p-inputtext) {
  border-color: #ef4444 !important;
}

:deep(.p-inputwrapper-invalid .p-inputtext:focus) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.2) !important;
}

</style>