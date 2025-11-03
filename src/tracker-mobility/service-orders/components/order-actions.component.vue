<script>

import {OrderService} from "../models/order-service.entity.js";
import {OrderRequestApi} from "../services/order-request-api.service.js";
import {ObservationApiService} from "../services/observation-api.service.js";

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

      // Servicio de API para observaciones (si es necesario)
      observationApiService: new ObservationApiService('/orders'),

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
        observationType: null,
        description: ''
      },

      // Opciones de tipos de observación
      observationTypeOptions: [
        { label: '-- Seleccionar tipo --', value: null },
        { label: 'Documento de identidad', value: 'DOCUMENTO_IDENTIDAD' },
        { label: 'Recibo de servicio', value: 'RECIBO_SERVICIO' }
      ],

      // Opciones de estados de observación
      observationStatusOptions: [
        { label: 'Pendiente', value: 'PENDIENTE', severity: 'warning' },
        { label: 'Resuelta', value: 'RESUELTA', severity: 'success' }
      ]
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

    // Validación en tiempo real para observaciones
    isObservationValid() {
      if (!this.editingStates.observations) return true;

      return this.currentObservation.observationType &&
             this.currentObservation.description &&
             this.currentObservation.description.trim() !== '';
    }

  },

  methods : {
    // Obtener etiqueta del tipo de observación
    getObservationTypeLabel(value) {
      const option = this.observationTypeOptions.find(opt => opt.value === value);
      return option ? option.label : value;
    },

    // Obtener información del estado de observación
    getObservationStatusInfo(status) {
      const option = this.observationStatusOptions.find(opt => opt.value === status);
      return option || { label: status, severity: 'info' };
    },
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
      // Validar que se haya ingresado una descripción
      if (!this.currentObservation.description || this.currentObservation.description.trim() === '') {
        this.showToast('warn', 'Campo requerido', 'Debe ingresar una descripción para la observación.');
        return;
      }

      // Crear nueva observación
      const newObservation = {
        observationType: this.currentObservation.observationType,
        description: this.currentObservation.description.trim(),
      };

      // Crear la observación en el backend
      this.observationApiService.create(this.item.id, newObservation).then(response => {
          // Agregar la nueva observación a la lista de observaciones del ítem
          if (!this.item.observations) {
            this.item.observations = [];
          }
          this.item.observations.push(response.data);

          // Mostrar mensaje de éxito
          this.showToast('success', 'Observación agregada', 'La observación ha sido agregada correctamente.');

          // Limpiar el formulario de observación actual
          this.currentObservation = {
            observationType: 'DOCUMENTO_IDENTIDAD',
            description: ''
          };

          this.editingStates.observations = false;
      })
        .catch(error => {
          console.error('Error al crear la observación en el backend:', error);
          this.showToast('error', 'Error', 'No se pudo agregar la observación. Intente nuevamente.');
        });
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
          <label for="verifier" class="font-medium text-600 flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            Seleccionar verificador
            <span class="text-red-500">*</span>
          </label>
          <pv-select
              id="verifier"
              v-model="localHomeVisitDetails.verifierId"
              :options="verifiersListFormatted"
              optionLabel="fullName"
              optionValue="id"
              placeholder="-- Seleccionar verificador --"
              class="w-full mt-1"
              :class="{ 'p-invalid': editingStates.verifier && !localHomeVisitDetails.verifierId }"
              :disabled="!editingStates.verifier"
              showClear
          />
        </div>

        <div class="formgrid grid mb-4">
          <div class="field col-12 md:col-6">
            <label for="visitDate" class="font-medium text-600 flex align-items-center gap-2">
              <i class="pi pi-calendar text-primary"></i>
              Fecha de visita
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
          <div class="field col-12 md:col-6">
            <label for="visitTime" class="font-medium text-600 flex align-items-center gap-2">
              <i class="pi pi-clock text-primary"></i>
              Hora de visita
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
          <label class="font-medium text-600 flex align-items-center gap-2 mb-2">
            <i class="pi pi-info-circle text-primary"></i>
            Estado actual
          </label>
          <div class="p-3 border-1 surface-border border-round surface-50 flex align-items-center gap-2">
            <i class="pi pi-circle-fill text-primary"></i>
            <span class="font-semibold text-900">
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
          <label for="observationType" class="font-medium text-600 flex align-items-center gap-2">
            <i class="pi pi-file text-primary"></i>
            Tipo de observación
            <span class="text-red-500">*</span>
          </label>
          <pv-select
              id="observationType"
              v-model="currentObservation.observationType"
              :options="observationTypeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="-- Seleccionar tipo de observación --"
              class="w-full mt-1"
              :class="{ 'p-invalid': editingStates.observations && !currentObservation.observationType }"
              :disabled="!editingStates.observations"
              showClear
          />
        </div>

        <div class="field mb-4">
          <label for="observations" class="font-medium text-600 flex align-items-center gap-2">
            <i class="pi pi-align-left text-primary"></i>
            Descripción
            <span class="text-red-500">*</span>
          </label>
          <pv-textarea
              id="observations"
              v-model="currentObservation.description"
              :rows="3"
              placeholder="Detalla la observación aquí..."
              class="w-full mt-1"
              :class="{ 'p-invalid': editingStates.observations && (!currentObservation.description || currentObservation.description.trim() === '') }"
              :disabled="!editingStates.observations"
          />
        </div>

        <!-- Lista de observaciones existentes -->
        <div v-if="item.observations && item.observations.length > 0" class="field mb-4">
          <label class="font-medium text-600 flex align-items-center gap-2 mb-2">
            <i class="pi pi-list text-primary"></i>
            Observaciones registradas ({{ item.observations.length }})
          </label>
          <div class="observations-list max-h-15rem overflow-y-auto" style="scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9;">
            <div
              v-for="(observation, index) in item.observations"
              :key="observation.id || index"
              class="observation-item p-3 mb-2 border-1 border-300 border-round bg-blue-50 transition-all transition-duration-200 cursor-pointer"
            >
              <div class="flex align-items-start gap-2">
                <i class="pi pi-file text-blue-600 mt-1"></i>
                <div class="flex-1">
                  <div class="flex align-items-center justify-content-between mb-1">
                    <p class="font-semibold text-sm text-blue-800 m-0">
                      {{ getObservationTypeLabel(observation.observationType) }}
                    </p>
                    <pv-tag
                      v-if="observation.status"
                      :value="getObservationStatusInfo(observation.status).label"
                      :severity="getObservationStatusInfo(observation.status).severity"
                      class="text-xs"
                    />
                  </div>
                  <p class="text-sm text-600 m-0">
                    {{ observation.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
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
                :disabled="!isObservationValid"
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

/* Asegurar que la card mantenga sus bordes redondeados */
:deep(.p-card) {
  border-radius: 6px !important;
  overflow: hidden !important;
}

/* Estilos personalizados para el header de las cards (no disponibles en PrimeFlex) */
:deep(.p-card .p-card-header) {
  background-color: #4A60D0 !important;
  color: white !important;
  border-top-left-radius: 6px !important;
  border-top-right-radius: 6px !important;
  padding: 0 !important;
  border-bottom: none !important;
}

/* Asegurar que el texto seleccionado en los dropdowns sea oscuro */
:deep(.p-select .p-select-label) {
  color: #1e293b !important;
  font-weight: 500 !important;
}

:deep(.p-select .p-select-label.p-placeholder) {
  color: #94a3b8 !important;
  font-weight: 400 !important;
}

:deep(.p-select:not(.p-disabled) .p-select-label) {
  color: #1e293b !important;
}

/* Scrollbar personalizada para lista de observaciones */
.observations-list::-webkit-scrollbar {
  width: 6px;
}

.observations-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.observations-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.observations-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Estilos para campos inválidos (validación) */
:deep(.p-invalid) {
  border-color: #ef4444 !important;
}

:deep(.p-invalid:focus) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.2) !important;
}

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

:deep(.p-inputwrapper-invalid .p-inputtext) {
  border-color: #ef4444 !important;
}

:deep(.p-inputwrapper-invalid .p-inputtext:focus) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.2) !important;
}

</style>