<script>

import VerifierDataAndEdit from "../components/verifier-data-and-edit.component.vue";
import {Verifier} from "../models/verifiers.entity.js";
import ListAssignedOrders from "../components/list-assigned-orders.component.vue";

export default {
  name: 'verifiers-details-management',
  components: {ListAssignedOrders, VerifierDataAndEdit},

  data() {
    return {
      isEdit:false,
      submitted: false,
      item: new Verifier({}),
    }
  },

  methods: {

    // Guardar cambios en el verificador
    onSaveVerifier(item) {
      console.log('Guardando verificador en el padre:', item)
      this.item = new Verifier(item)
    },

    // Eliminar verificador
    onDeleteVerifier() {
      // Lógica de implementación para eliminar verificador


    },

    // Editar verificador
    onEditVerifier(item) {
      this.item = new Verifier({})
      this.isEdit = true
      this.submitted = false
    },

    // Cancelar edición
    OnCancelEdit() {
      // Lógica de implementación para cancelar edición

    },

    // Remover orden de la lista de órdenes asignadas
    async handleRemoveOrder(order) {
      try {
        console.log('Removiendo orden:', order);
        
        // Simular llamada a API (reemplazar con llamada real)
        // await this.orderService.removeAssignedOrder(this.item.id, order.id);
        
        // Actualizar la lista local removiendo la orden
        this.item.assignedOrders = this.item.assignedOrders.filter(o => o.id !== order.id);
        
        // Mostrar mensaje de éxito
        this.$toast.add({
          severity: 'success',
          summary: 'Orden removida',
          detail: `La orden ${order.id} ha sido removida exitosamente de ${this.item.name}`,
          life: 3000
        });
        
        console.log('Orden removida exitosamente. Órdenes restantes:', this.item.assignedOrders);
        
      } catch (error) {
        console.error('Error al remover la orden:', error);
        
        // Mostrar mensaje de error
        this.$toast.add({
          severity: 'error',
          summary: 'Error al remover',
          detail: 'No se pudo remover la orden. Inténtalo nuevamente.',
          life: 3000
        });
      }
    },
  },

  created() {
    this.item = new Verifier(
        {
          id: 1,
          name: "Janover Gonzalo",
          lastname: "Saldaña Vela",
          phone: "999 888 777",
          status: "Activo",
          ordenes: 2,
          email: "janover.saldana@trackermobility.com",
          password: "ContraseñaSegura123",
          agenda: "Lunes a Viernes",
          assignedOrders: [
            {
              id: "ORD12345",
              address: "Av. Siempre Viva 123, Springfield",
              date: "2024-10-01T10:00:00",
              googleMaps: "https://maps.google.com/?q=Av.+Siempre+Viva+123,+Springfield",
              status: "Asignado",
            },
            {
              id: "ORD67890",
              address: "Calle Falsa 456, Shelbyville",
              date: "2024-10-02T14:30:00",
              googleMaps: "https://maps.google.com/?q=Calle+Falsa+456,+Shelbyville",
              status: "Asignado",
            },
            {
              id: "ORD11223",
              address: "Boulevard de los Sueños Rotos 789, Capital City",
              date: "2024-10-03T09:15:00",
              googleMaps: "https://maps.google.com/?q=Boulevard+de+los+Sueños+Rotos+789,+Capital+City",
              status: "Completado",
            },
          ],
        }
    )
  }
}

</script>

<template>

  <!-- Detalles de la orden de servicio (se divide en cards tipo grid)-->
  <div class="order-container flex flex-column p-4 h-full w-full overflow-auto " >

    <!-- Breadcrumb -->
    <div class="text-base">
      <router-link
          to="/admin/verifiers"
          class="font-bold text-gray-900 no-underline hover:underline cursor-pointer"
      >
        Verificadores
      </router-link>
      <span class="text-gray-500 font-bold"> / </span>
      <span class="text-blue-700 font-bold hover:underline cursor-pointer">
        {{item.name}}
      </span>
    </div>

    <!-- Contenido en una solo columna -->
    <div class="flex-1 flex flex-column gap-4 mt-4">

      <verifier-data-and-edit
          :item="item"
          :edit="isEdit"
          :submitted="submitted"
          @save-verifier="onSaveVerifier($event)"
          @delete-verifier="onDeleteVerifier"
          @edit-verifier="onEditVerifier"
          @cancel-edit="OnCancelEdit"
      />

      <!-- Lista de ordenes asignadas al verificador -->

      <list-assigned-orders
          :items="item.assignedOrders"
          @remove-order="handleRemoveOrder"
      />






    </div>











  </div>


</template>

<style scoped>

</style>