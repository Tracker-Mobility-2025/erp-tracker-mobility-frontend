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

  methods : {
    // Asignar verificador a una orden de servicio (programar fecha de visita y hora de visita)
    assignVerifierToOrder() {
      // Lógica para asignar verificador
      this.$emit('assign-verifier', this.item);
    },

    // Actualizar estado del servicio
    updateServiceStatus() {
      // Lógica para actualizar estado del servicio
      this.$emit('update-status', this.item);
    },

    // Enviar observaciones de la orden de servicio
    submitOrderObservations() {
      // Lógica para enviar observaciones
      this.$emit('submit-observations', this.item);
    },
  }
};

</script>

<template>
  <div class="flex flex-column gap-4 w-full">

    <!-- ====================== Card -> Asignar a verificador ====================== -->
    <pv-card class="w-full ">
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-primary">Asignar a verificador</h3>
        
        <div class="field mb-3">
          <label for="verifier" class="font-medium text-gray-700">Seleccionar verificador *</label>
          <pv-dropdown
            id="verifier"
            v-model="item.assignedVerifier" 
            :options="verifiersList" 
            optionLabel="name" 
            optionValue="id"
            placeholder="Ingresar el nombre del verificador"
            class="w-full mt-1"
          />
        </div>

        <div class="formgrid grid mb-4">
          <div class="field col-6">
            <label for="visitDate" class="font-medium text-gray-700">Fecha de visita *</label>
            <pv-calendar
              id="visitDate"
              v-model="item.scheduledDate" 
              placeholder="dd/mm/aaaa"
              dateFormat="dd/mm/yy"
              class="w-full mt-1"
              showIcon
            />
          </div>
          <div class="field col-6">
            <label for="visitTime" class="font-medium text-gray-700">Hora de visita *</label>
            <pv-calendar
              id="visitTime"
              v-model="item.scheduledTime" 
              timeOnly 
              placeholder="hh:mm"
              class="w-full mt-1"
              showIcon
            />
          </div>
        </div>

        <div class="flex justify-content-end gap-2 w-full">
          <pv-button
            label="Asignar" 
            icon="pi pi-user-plus" 
            class="p-button-primary p-button-sm w-full"
            @click="assignVerifierToOrder"
          />
        </div>
      </template>
    </pv-card>

    <!-- ====================== Card -> Acciones ====================== -->
    <pv-card class="w-full">
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-primary">Acciones</h3>
        
        <div class="field mb-3">
          <label for="serviceStatus" class="font-medium text-gray-700">Actualizar estado</label>
          <pv-dropdown
            id="serviceStatus"
            v-model="item.status" 
            :options="statusOptions.map(status => ({ label: status, value: status }))" 
            optionLabel="label" 
            optionValue="value"
            placeholder="En progreso"
            class="w-full mt-1"
          />
        </div>
        
        <pv-button
          label="Guardar cambios" 
          icon="pi pi-save"
          class="p-button-primary w-full"
          @click="updateServiceStatus"
        />
      </template>
    </pv-card>

    <!-- ====================== Card -> Observaciones ====================== -->
    <pv-card class="w-full">
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-primary">Observaciones</h3>
        
        <div class="field mb-3">
          <label for="documentType" class="font-medium text-gray-700">Selecciona el documento</label>
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
          />
        </div>
        
        <div class="field mb-4">
          <label for="observations" class="font-bold text-primary">Descripción</label>
          <pv-textarea
            id="observations"
            v-model="item.observations" 
            :rows="3" 
            placeholder="Los datos del documento de identidad no coinciden con los datos del cliente"
            class="w-full mt-1"
          />
        </div>
        
        <pv-button
          label="Guardar cambios" 
          icon="pi pi-save"
          class="p-button-primary w-full"
          @click="submitOrderObservations"
        />
      </template>
    </pv-card>
  </div>
</template>

<style scoped>

:deep(.p-card-content) {
  padding: 0.5rem;
}

</style>