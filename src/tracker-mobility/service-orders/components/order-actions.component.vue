<script>

export default {
  name: 'order-actions',

  props : {
    item: {
      type: Object,
      required: true
    },

    verifiersList: {
      type: Array,
      required: true
    },

    statusOptions: {
      type: Array,
      required: false,
      default : () => (['Pendiente', 'En Proceso', 'Completado', 'Cancelado'])
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
    <div class="card p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h3 class="text-lg font-semibold mb-4 text-gray-900">Asignar a verificador</h3>
      
      <div class="mb-3">
        <label class="block text-gray-700 font-medium mb-1" for="verifier">Seleccionar verificador *</label>
        <select
            id="verifier"
            v-model="item.assignedVerifier"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Ingresar el nombre del verificador</option>
          <option
              v-for="verifier in verifiersList"
              :key="verifier.id"
              :value="verifier.id"
          >
            {{ verifier.name }}
          </option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label class="block text-gray-700 font-medium mb-1" for="visitDate">Fecha de visita *</label>
          <input
              type="date"
              id="visitDate"
              v-model="item.scheduledDate"
              placeholder="dd/mm/aaaa"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1" for="visitTime">Hora de visita *</label>
          <input
              type="time"
              id="visitTime"
              v-model="item.scheduledTime"
              placeholder="hh:mm"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="flex gap-2">
        <button
            @click="assignVerifierToOrder"
            class="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Editar
        </button>
        <button
            @click="assignVerifierToOrder"
            class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Asignar
        </button>
      </div>
    </div>

    <!-- ====================== Card -> Acciones ====================== -->
    <div class="card p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h3 class="text-lg font-semibold mb-4 text-gray-900">Acciones</h3>
      
      <div class="mb-3">
        <label class="block text-gray-700 font-medium mb-1" for="serviceStatus">Actualizar estado</label>
        <select
            id="serviceStatus"
            v-model="item.status"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="En progreso">En progreso</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Completado">Completado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>
      
      <button
          @click="updateServiceStatus"
          class="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Guardar cambios
      </button>
    </div>

    <!-- ====================== Card -> Observaciones ====================== -->
    <div class="card p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h3 class="text-lg font-semibold mb-4 text-gray-900">Observaciones</h3>
      
      <div class="mb-3">
        <label class="block text-gray-700 font-medium mb-1" for="documentType">Selecciona el documento</label>
        <select
            id="documentType"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Documento de identidad">Documento de identidad</option>
          <option value="Recibo de servicios">Recibo de servicios</option>
        </select>
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-1" for="observations">Descripción</label>
        <textarea
            id="observations"
            v-model="item.observations"
            rows="3"
            placeholder="Los datos del documento de identidad no coinciden con los datos del cliente"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      
      <button
          @click="submitOrderObservations"
          class="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Guardar cambios
      </button>
    </div>
  </div>


</template>

<style scoped>

</style>