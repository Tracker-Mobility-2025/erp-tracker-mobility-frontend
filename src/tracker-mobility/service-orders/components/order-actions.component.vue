<script>



export default {
  name: 'order-actions',
  components: {
  },

  props : {
    item: {
      type: Object,
      required: true,
      default: () => ({
        assignedVerifier: null,
        scheduledDate: null,
        scheduledTime: null,
        status: 'En progreso',
        documentType: 'Documento de identidad',
        observations: ''
      })
    },

    verifiersList: {
      type: Array,
      required: true,
      default: () => ([
        { id: 1, name: 'Juan Pérez' },
        { id: 2, name: 'María Gómez' },
        { id: 3, name: 'Carlos Rodríguez' }
      ])
    },

    statusOptions: {
      type: Array,
      required: false,
      default : () => (['Pendiente', 'En progreso', 'Completado', 'Cancelado'])
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
      }
    };
  },

  methods : {
    // Habilitar modo edición para una sección específica
    enableEditing(section) {
      // Guardar datos originales de la sección específica
      if (section === 'verifier') {
        this.originalData.verifier = {
          assignedVerifier: this.item.assignedVerifier,
          scheduledDate: this.item.scheduledDate,
          scheduledTime: this.item.scheduledTime
        };
      } else if (section === 'status') {
        this.originalData.status = {
          status: this.item.status
        };
      } else if (section === 'observations') {
        this.originalData.observations = {
          documentType: this.item.documentType,
          observations: this.item.observations
        };
      }
      
      this.editingStates[section] = true;
    },

    // Cancelar edición y restaurar datos originales para una sección específica
    cancelEditing(section) {
      // Restaurar datos originales de la sección específica
      if (section === 'verifier') {
        Object.assign(this.item, this.originalData.verifier);
      } else if (section === 'status') {
        Object.assign(this.item, this.originalData.status);
      } else if (section === 'observations') {
        Object.assign(this.item, this.originalData.observations);
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
      // Lógica para enviar observaciones
      this.$emit('submit-observations', this.item);
      this.editingStates.observations = false;
    },

    // Cancelar orden de servicio
    cancelOrder() {
      // Lógica para cancelar orden
      this.$emit('cancel-order', this.item);
      this.editingStates.status = false;
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
            v-model="item.assignedVerifier" 
            :options="verifiersList" 
            optionLabel="name" 
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
              v-model="item.scheduledDate" 
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
              v-model="item.scheduledTime" 
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
            :options="statusOptions.map(status => ({ label: status, value: status }))" 
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
            v-model="item.documentType"
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
            v-model="item.observations" 
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