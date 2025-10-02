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
        status: false,
        observations: false
      },
      originalData: {
        verifier: {},
        status: {},
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
    }
  },

  methods : {
    // Habilitar modo edición para una sección específica
    enableEditing(section) {
      // Guardar datos originales de la sección específica
      if (section === 'verifier') {
        this.originalData.verifier = {
          verifierId: this.item.homeVisitDetails?.verifierId || null,
          visitDate: this.item.homeVisitDetails?.visitDate || null,
          visitTime: this.item.homeVisitDetails?.visitTime || null
        };
      } else if (section === 'status') {
        this.originalData.status = {
          status: this.item.status
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
      } else if (section === 'status') {
        this.item.status = this.originalData.status.status;
      } else if (section === 'observations') {
        this.item.observations = [...this.originalData.observations.observations];
      }

      this.editingStates[section] = false;
      this.originalData[section] = {};
    },

    // Asignar verificador a una orden de servicio (programar fecha de visita y hora de visita)
    assignVerifierToOrder() {
      // Lógica para asignar verificador
      this.$emit('assign-verifier', this.item);
      this.editingStates.verifier = false;
    },

    // Confirmar cambios realizados
    confirmChanges() {
      // Lógica para confirmar cambios
      this.$emit('confirm-changes', this.item);
      this.editingStates.status = false;
    },

    // Actualizar estado del servicio
    updateServiceStatus() {
      // Lógica para actualizar estado del servicio
      this.$emit('update-status', this.item);
      this.editingStates.status = false;
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

    // Cancelar orden de servicio
    cancelOrder() {
      // Lógica para cancelar orden
      this.$emit('cancel-order', this.item);
      this.editingStates.status = false;
    }
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
          </label>
          <pv-dropdown
              id="verifier"
              v-model="item.homeVisitDetails.verifierId"
              :options="verifiersListFormatted"
              optionLabel="fullName"
              optionValue="id"
              placeholder="Ingresar el nombre del verificador"
              class="w-full mt-1"
              :disabled="!editingStates.verifier"
          />
        </div>

        <div class="formgrid grid mb-4">
          <div class="field col-6">
            <label for="visitDate" class="font-medium text-gray-700 flex align-items-center gap-2">
              <i class="pi pi-calendar text-primary"></i>
              Fecha de visita *
            </label>
            <pv-calendar
                id="visitDate"
                v-model="item.homeVisitDetails.visitDate"
                placeholder="dd/mm/aaaa"
                dateFormat="dd/mm/yy"
                class="w-full mt-1"
                showIcon
                :disabled="!editingStates.verifier"
            />
          </div>
          <div class="field col-6">
            <label for="visitTime" class="font-medium text-gray-700 flex align-items-center gap-2">
              <i class="pi pi-clock text-primary"></i>
              Hora de visita *
            </label>
            <pv-calendar
                id="visitTime"
                v-model="item.homeVisitDetails.visitTime"
                timeOnly
                placeholder="hh:mm"
                class="w-full mt-1"
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

    <!-- ====================== Card -> Acciones ====================== -->
    <pv-card class="w-full">
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-primary flex align-items-center gap-2">
          <i class="pi pi-cog"></i>
          Acciones
        </h3>

        <div class="field mb-3">
          <label for="serviceStatus" class="font-medium text-gray-700 flex align-items-center gap-2">
            <i class="pi pi-flag text-primary"></i>
            Actualizar estado
          </label>
          <pv-dropdown
              id="serviceStatus"
              v-model="item.status"
              :options="statusOptionsFormatted"
              optionLabel="label"
              optionValue="value"
              placeholder="En progreso"
              class="w-full mt-1"
              :disabled="!editingStates.status"
          />
        </div>

        <div class="flex gap-2 w-full">
          <!-- Botón de Editar (cuando no está editando) -->
          <pv-button
              v-if="!editingStates.status"
              label="Editar"
              icon="pi pi-pencil"
              class="p-button-warning w-full"
              @click="enableEditing('status')"
          />

          <!-- Botones de acción (cuando está editando) -->
          <template v-if="editingStates.status">
            <pv-button
                label="Confirmar"
                icon="pi pi-check"
                class="p-button-primary flex-1"
                @click="confirmChanges"
            />
            <pv-button
                label="Cancelar"
                icon="pi pi-times"
                class="p-button-secondary flex-1"
                @click="cancelEditing('status')"
            />
          </template>
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

</style>