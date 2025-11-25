<script>

export default {
  name: 'details-the-interview-with-the-landlord-card',

  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({
        tenantName: '_',
        ownHouse: '-',
        serviceClientPays: '-',
        clientPaysPunctual: '-',
        clientRentalTime: '-',
        clientFloorNumber: '-'
      })
    },
    canEdit: {
      type: Boolean,
      required: false,
      default: false
    },
    blockedByFinalResult: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      isEditing: false,
      editForm: {
        tenantName: '',
        ownHouse: '',
        serviceClientPays: '',
        clientPaysPunctual: '',
        clientRentalTime: '',
        clientFloorNumber: ''
      },
      booleanOptions: [
        { label: 'No especifica', value: null },
        { label: 'Sí', value: 'Sí' },
        { label: 'No', value: 'No' }
      ]
    }
  },

  watch: {
    item: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.editForm = {
          tenantName: newVal?.tenantName || '',
          ownHouse: newVal?.ownHouse || '',
          serviceClientPays: newVal?.serviceClientPays || '',
          clientPaysPunctual: newVal?.clientPaysPunctual || '',
          clientRentalTime: newVal?.clientRentalTime || '',
          clientFloorNumber: newVal?.clientFloorNumber || ''
        };
      }
    },
    canEdit(newVal) {
      if (!newVal && this.isEditing) {
        this.isEditing = false;
      }
    }
  },

  computed: {
    formattedOwnHouse() {
      const value = this.item?.ownHouse;
      if (value === '-' || value === '' || value === null || value === undefined) {
        return 'No especifica';
      }
      return value;
    },
    
    formattedClientPaysPunctual() {
      const value = this.item?.clientPaysPunctual;
      if (value === '-' || value === '' || value === null || value === undefined) {
        return 'No especifica';
      }
      return value;
    }
  },

  methods: {
    onEditToggle() {
      if (!this.canEdit) return;
      this.isEditing = !this.isEditing;
      if (!this.isEditing) {
        // Reset form when cancelling edit mode
        this.editForm = {
          tenantName: this.item?.tenantName || '',
          ownHouse: this.item?.ownHouse || '',
          serviceClientPays: this.item?.serviceClientPays || '',
          clientPaysPunctual: this.item?.clientPaysPunctual || '',
          clientRentalTime: this.item?.clientRentalTime || '',
          clientFloorNumber: this.item?.clientFloorNumber || ''
        };
      }
    },

    validateForm() {
      // Validar que todos los campos estén completados (permitiendo "No especifica" como valor válido)
      const errors = [];

      // Validar nombre del inquilino
      if (!this.editForm.tenantName || this.editForm.tenantName.trim() === '') {
        errors.push('Nombre del inquilino');
      }

      // Casa propia: acepta null (No especifica), 'Sí', o 'No'
      // Solo inválido si es undefined o string vacío
      if (this.editForm.ownHouse === undefined || this.editForm.ownHouse === '') {
        errors.push('Casa propia');
      }

      // Validar servicio que paga el cliente
      if (!this.editForm.serviceClientPays || this.editForm.serviceClientPays.trim() === '') {
        errors.push('Servicio que paga el cliente');
      }

      // ¿Paga puntual?: acepta null (No especifica), 'Sí', o 'No'
      // Solo inválido si es undefined o string vacío
      if (this.editForm.clientPaysPunctual === undefined || this.editForm.clientPaysPunctual === '') {
        errors.push('¿El cliente paga puntual?');
      }

      // Validar tiempo de arrendamiento
      if (!this.editForm.clientRentalTime || this.editForm.clientRentalTime.trim() === '') {
        errors.push('Tiempo de arrendamiento del cliente');
      }

      // Validar número de piso
      if (!this.editForm.clientFloorNumber || this.editForm.clientFloorNumber.trim() === '') {
        errors.push('Número de piso en el que habita el cliente');
      }

      return errors;
    },

    onSaveEdit() {
      // Validar formulario antes de guardar
      const errors = this.validateForm();

      if (errors.length > 0) {
        // Mostrar mensaje de error con los campos faltantes
        this.$toast.add({
          severity: 'warn',
          summary: 'Campos incompletos',
          detail: `Debe completar los siguientes campos: ${errors.join(', ')}.`,
          life: 5000
        });
        return;
      }

      // Emitir evento al padre para gestionar la actualización
      this.$emit('update-interview-details-requested', { ...this.editForm });
      // Mantener el componente en modo lectura tras guardar
      this.isEditing = false;
    }
  }

};

</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <div class="flex justify-content-between align-items-center">
        <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
          <i class="pi pi-comments text-white"></i>
          Detalles de la entrevista
        </h3>
        <div v-if="canEdit" class="flex align-items-center gap-2 pr-3">
          <pv-button
            v-if="!isEditing"
            size="small"
            icon="pi pi-pencil"
            label="Editar"
            class="p-button-warning p-button-sm"
            @click="onEditToggle"
          />
          <template v-else>
            <pv-button
              size="small"
              icon="pi pi-times"
              label="Cancelar"
              class="p-button-secondary p-button-sm"
              @click="onEditToggle"
            />
            <pv-button
              size="small"
              icon="pi pi-save"
              label="Guardar"
              class="p-button-success p-button-sm"
              @click="onSaveEdit"
            />
          </template>
        </div>
        <div v-else-if="blockedByFinalResult" class="flex align-items-center gap-2 pr-3">
          <span class="text-sm text-white flex align-items-center gap-2">
            <i class="pi pi-lock"></i>
            Edición bloqueada porque el reporte ya tiene resultado final
          </span>
        </div>
      </div>
    </template>
    <template #content>
      
      <div class="formgrid grid">
        <!-- Primera fila -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            Nombre del inquilino:
          </label>
          <template v-if="!isEditing">
            <p class="font-semibold text-dark m-0">
              {{ item?.tenantName || '-' }}
            </p>
          </template>
          <template v-else>
            <pv-input-text v-model="editForm.tenantName" class="w-full" placeholder="Nombre del inquilino" />
          </template>
        </div>
        
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-home text-primary"></i>
            Casa propia
          </label>
          <template v-if="!isEditing">
            <p class="font-semibold text-dark m-0">
              {{ formattedOwnHouse }}
            </p>
          </template>
          <template v-else>
            <pv-select v-model="editForm.ownHouse" :options="booleanOptions" option-label="label" option-value="value" class="w-full" placeholder="Seleccione"/>
          </template>
        </div>
        
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-dollar text-primary"></i>
            Servicio que paga el cliente
          </label>
          <template v-if="!isEditing">
            <p class="font-semibold text-dark m-0">
              {{ item?.serviceClientPays || '-' }}
            </p>
          </template>
          <template v-else>
            <pv-input-text v-model="editForm.serviceClientPays" class="w-full" placeholder="Servicios (separados por coma)"/>
          </template>
        </div>
        
        <!-- Segunda fila -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-check-circle text-primary"></i>
            ¿El cliente paga puntual?
          </label>
          <template v-if="!isEditing">
            <p class="font-semibold text-dark m-0">
              {{ formattedClientPaysPunctual }}
            </p>
          </template>
          <template v-else>
            <pv-select v-model="editForm.clientPaysPunctual" :options="booleanOptions" option-label="label" option-value="value" class="w-full" placeholder="Seleccione"/>
          </template>
        </div>
        
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-clock text-primary"></i>
            Tiempo de arrendamiento del cliente:
          </label>
          <template v-if="!isEditing">
            <p class="font-semibold text-dark m-0">
              {{ item?.clientRentalTime || '-' }}
            </p>
          </template>
          <template v-else>
            <pv-input-text v-model="editForm.clientRentalTime" class="w-full" placeholder="Ej: 2 años"/>
          </template>
        </div>
        
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-building text-primary"></i>
            Nro de piso en el que habita el cliente:
          </label>
          <template v-if="!isEditing">
            <p class="font-semibold text-dark m-0">
              {{ item?.clientFloorNumber || '-' }}
            </p>
          </template>
          <template v-else>
            <pv-input-text v-model="editForm.clientFloorNumber" class="w-full" placeholder="Ej: 3"/>
          </template>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
:deep(.p-card-content) {
  padding: 0.5rem;
}

:deep(.p-card-header) {
  background-color: #4A60D0;
  border-radius: 0.375rem 0.375rem 0 0;
  overflow: hidden;
}

:deep(.p-card) {
  overflow: hidden;
  border-radius: 0.375rem;
}
</style>