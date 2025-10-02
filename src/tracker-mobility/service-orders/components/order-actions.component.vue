<script>

import {OrderService} from "../models/order-service.entity.js";

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
      editingStates: {
        verifier: false,
        observations: false
      },
      originalData: {
        verifier: {},
        observations: {}
      },
      currentObservation: {
        documentType: 'Documento de identidad',
        description: ''
      }
    };
  },

  computed: {
    verifiersListFormatted() {
      return this.verifiersList.map(verifier => ({
        ...verifier,
        fullName: `${verifier.name || ''} ${verifier.lastName || ''}`.trim()
      }));
    },

    statusOptionsFormatted() {
      return this.statusOptions
        .filter(option => option.value !== null)
        .map(option => ({
          label: option.label,
          value: option.value
        }));
    },

    // Validación en tiempo real para los campos de asignación
    isVerifierAssignmentValid() {
      if (!this.editingStates.verifier) return true;
      
      const { verifierId, visitDate, visitTime } = this.item.homeVisitDetails;
      return verifierId && visitDate && visitTime;
    },

    // Obtener el verificador seleccionado
    selectedVerifier() {
      if (!this.item.homeVisitDetails.verifierId) return null;
      return this.verifiersListFormatted.find(
        verifier => verifier.id === this.item.homeVisitDetails.verifierId
      );
    }
  },

  methods : {
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
          verifierId: this.item.homeVisitDetails?.verifierId || null,
          visitDate: this.item.homeVisitDetails?.visitDate || null,
          visitTime: this.item.homeVisitDetails?.visitTime || null
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
        if (this.item.homeVisitDetails) {
          this.item.homeVisitDetails.verifierId = this.originalData.verifier.verifierId;
          this.item.homeVisitDetails.visitDate = this.originalData.verifier.visitDate;
          this.item.homeVisitDetails.visitTime = this.originalData.verifier.visitTime;
        }
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
      
      if (!validation.isValid) {
        this.showToast('error', 'Campos requeridos', validation.message);
        return;
      }

      // Lógica para asignar verificador
      this.$emit('assign-verifier', this.item);
      this.editingStates.verifier = false;
      
      // Mostrar toast de confirmación
      this.showToast('success', 'Verificador asignado', 'El verificador ha sido asignado correctamente a la orden de servicio.');
    },

    // Validar los campos requeridos para la asignación del verificador
    validateVerifierAssignment() {
      const { verifierId, visitDate, visitTime } = this.item.homeVisitDetails;
      
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

      // Emitir evento con el item actualizado
      this.$emit('submit-observations', this.item);
      this.editingStates.observations = false;
    },


  },

  created() {
    // Inicializar estados de edición y datos originales
    // Asegurar que homeVisitDetails existe
    if (!this.item.homeVisitDetails) {
      this.item.homeVisitDetails = {
        verifierId: null,
        visitDate: null,
        visitTime: null
      };
    }

    // Asegurar que observations existe
    if (!this.item.observations) {
      this.item.observations = [];
    }
  },

  watch: {
    // Observar cambios en el item prop para reinicializar datos locales
    item: {
      handler(newItem) {
        if (newItem) {
          // Reinicializar homeVisitDetails si no existe
          if (!newItem.homeVisitDetails) {
            newItem.homeVisitDetails = {
              verifierId: null,
              visitDate: null,
              visitTime: null
            };
          }
          
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
    <pv-card class="w-full ">
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-primary flex align-items-center gap-2">
          <i class="pi pi-user-plus"></i>
          Asignar a verificador
        </h3>

        <div class="field mb-3">
          <label for="verifier" class="font-medium text-gray-700 flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            Seleccionar verificador *
            <span class="text-red-500">*</span>
          </label>
          <pv-dropdown
              id="verifier"
              v-model="item.homeVisitDetails.verifierId"
              :options="verifiersListFormatted"
              optionLabel="fullName"
              optionValue="id"
              placeholder="Ingresar el nombre del verificador"
              class="w-full mt-1"
              :class="{ 'p-invalid': editingStates.verifier && !item.homeVisitDetails.verifierId }"
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
                v-model="item.homeVisitDetails.visitDate"
                placeholder="dd/mm/aaaa"
                dateFormat="dd/mm/yy"
                class="w-full mt-1"
                :class="{ 'p-invalid': editingStates.verifier && !item.homeVisitDetails.visitDate }"
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
                v-model="item.homeVisitDetails.visitTime"
                timeOnly
                placeholder="hh:mm"
                class="w-full mt-1"
                :class="{ 'p-invalid': editingStates.verifier && !item.homeVisitDetails.visitTime }"
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
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-primary flex align-items-center gap-2">
          <i class="pi pi-flag"></i>
          Estado del Servicio
        </h3>

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
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-primary flex align-items-center gap-2">
          <i class="pi pi-comment"></i>
          Observaciones
        </h3>

        <div class="field mb-3">
          <label for="documentType" class="font-medium text-gray-700 flex align-items-center gap-2">
            <i class="pi pi-file text-primary"></i>
            Selecciona el documento
          </label>
          <pv-dropdown
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

/* Estilos para dropdown inválido */
:deep(.p-dropdown.p-invalid) {
  border-color: #ef4444 !important;
}

:deep(.p-dropdown.p-invalid:not(.p-disabled):hover) {
  border-color: #ef4444 !important;
}

:deep(.p-dropdown.p-invalid:not(.p-disabled).p-focus) {
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