<script>

export default {
  name: 'order-actions',

  props : {
    item: {
      type: Object,
      required: true
    }
  },

  data() {
    return {

      verifiersList: [
        { id: 1, name: 'Verificador 1' },
        { id: 2, name: 'Verificador 2' },
        { id: 3, name: 'Verificador 3' }
      ],

      statusOptions: ['Pendiente', 'En Proceso', 'Completado', 'Cancelado']

    };
  },

  methods : {
    // Asignar verificador a una orden de servicio (programar fecha de visita y hora de visita)
    assignVerifierToOrder() {
      // Lógica para asignar verificador
    },

    // Editar verificador asignado
    editVerifier() {
      // Lógica para editar verificador
    },

    // Actualizar estado del servicio
    updateServiceStatus() {
      // Lógica para actualizar estado del servicio
    },

    // Enviar observaciones de la orden de servicio
    submitOrderObservations() {
      // Lógica para enviar observaciones
    },

  }


};

</script>

<template>


  <div class="flex flex-column gap-2">


    <!-- Card
            Titulo -> Asignar a verificador
            Select -> Lista de verificadores (obtenida de la base de datos)
            Datepicker -> Fecha de visita
            Timepicker -> Hora de visita
            Botón -> Asignar verificador
            Botón -> Editar verificador (si ya tiene un verificador asignado)
           -->

    <div class="p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h3 class="text-lg font-semibold mb-2 text-gray-900">Asignar a verificador</h3>
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-1" for="verifier">Verificador:</label>
        <select
            id="verifier"
            v-model="item.assignedVerifier"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Seleccione un verificador</option>
          <option
              v-for="verifier in verifiersList"
              :key="verifier.id"
              :value="verifier.id"
          >
            {{ verifier.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-1" for="visitDate">Fecha de Visita:</label>
        <input
            type="date"
            id="visitDate"
            v-model="item.scheduledDate"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-4">
        <pv-label class="block text-gray-700 font-medium mb-1" for="visitTime">Hora de Visita:</pv-label>
        <pv-input
            type="time"
            id="visitTime"
            v-model="item.scheduledTime"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <pv-button
          @click="assignVerifierToOrder"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Asignar Verificador
      </pv-button>
      <pv-button
          v-if="item.assignedVerifier"
          @click="editVerifier"
          class="ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        Editar Verificador
      </pv-button>

    </div>

    <!-- Card
           Titulo -> Actualizar estado del servicio
           Select -> Lista de estados (Pendiente, En Proceso, Completado, Cancelado)
           Botón -> Actualizar estado
          -->
    <div class="mt-6 p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h3 class="text-lg font-semibold mb-2 text-gray-900">Actualizar estado del servicio</h3>
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-1" for="serviceStatus">Estado del Servicio:</label>
        <select
            id="serviceStatus"
            v-model="item.status"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Pendiente">Pendiente</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Completado">Completado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>
      <pv-button
          @click="updateServiceStatus"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Actualizar Estado
      </pv-button>
    </div>

    <!-- Card
            Titulo -> Observaciones de la orden de servicio
            Textarea -> Ingresar observaciones
            Botón -> Enviar observaciones
           -->
    <div class="mt-6 p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h3 class="text-lg font-semibold mb-2 text-gray-900">Observaciones de la orden de servicio</h3>
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-1" for="observations">Observaciones:</label>
        <textarea
            id="observations"
            v-model="item.observations"
            rows="4"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      <pv-button
          @click="submitOrderObservations"
          class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        Enviar Observaciones
      </pv-button>
    </div>
  </div>


</template>

<style scoped>

</style>