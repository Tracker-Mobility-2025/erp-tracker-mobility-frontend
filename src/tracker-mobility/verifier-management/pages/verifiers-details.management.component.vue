<script>

import VerifierDataAndEdit from "../components/verifier-data-and-edit.component.vue";
import {Verifier} from "../models/verifiers.entity.js";
import ListAssignedOrders from "../components/list-assigned-orders.component.vue";
import {VerifierApiService} from "../services/verifier-api.service.js";
import {Order} from "../models/order.entity.js";

export default {
  name: 'verifiers-details-management',
  components: {ListAssignedOrders, VerifierDataAndEdit},


  data() {
    return {
      isEdit:false,
      submitted: false,

      item: new Verifier({}),
      itemUpdate: new Verifier({}),


      // Arreglo de órdenes asignadas al verificador
      assignedOrders: [],
      orderEntity: new Order({}),

      // Servicio de verificador
      verifierApiServices: null,
    }
  },

  methods: {

    // Guardar cambios en el verificador
    onSaveVerifier(item) {
      console.log('Guardando verificador en el padre:', item)
      this.itemUpdate = new Verifier(item)
      this.isEdit = false
      this.submitted = true
      this.update();
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

    // Guardar verificador
    update(){

      this.verifierApiServices.update(this.itemUpdate.id, this.itemUpdate).then(response => {
        this.item = new Verifier(response.data);
        console.log('Verificador actualizado:', this.item);
        this.$toast.add({severity:'success', summary: 'Éxito', detail: 'Verificador actualizado correctamente', life: 3000});
      }).catch(error => {
        console.error('Error al actualizar verificador:', error);
        this.$toast.add({severity:'error', summary: 'Error', detail: 'No se pudo actualizar el verificador', life: 3000});
      });

    },

    // Cancelar edición
    OnCancelEdit() {
      this.isEdit = false
      this.submitted = false
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


    // Recuperamos los datos del verificador por su ID (simulado)
    getVerifierById(verifierId) {

      this.verifierApiServices.getById(verifierId).then(response => {
        this.item = new Verifier(response.data);

        // Parseamos el estado de Inglés a Español
        if (this.item.status === "ACTIVE") {
          this.item.status = "ACTIVO";
        } else if (this.item.status === "INACTIVE") {
          this.item.status = "INACTIVO";
        }

        console.log('Verificador recuperado:', this.item);
      }).catch(error => {
        console.error('Error al recuperar verificador:', error);
      })
    },


    // Recuperar órdenes asignadas (simulado)
    getAssignedOrdersByVerifierId(verifierId) {

      let verifierApiServicesTmp = new VerifierApiService('/orders/verifier');

      verifierApiServicesTmp.getAssignedOrders(verifierId).then(response => {

        this.assignedOrders = response.data.map(orderData => new Order(orderData));

        console.log('Órdenes asignadas recuperadas:', this.assignedOrders);
      }).catch(error => {
        console.error('Error al recuperar órdenes asignadas:', error);
      });


    }


  },

  created() {

    this.verifierApiServices = new VerifierApiService('/verifiers');

    const verifierId = this.$route.query.id;

    this.getVerifierById(verifierId);

    this.getAssignedOrdersByVerifierId(verifierId);


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
          :cant-orders="assignedOrders.length"
          :edit="isEdit"
          :submitted="submitted"
          @save-verifier="onSaveVerifier($event)"
          @delete-verifier="onDeleteVerifier"
          @edit-verifier="onEditVerifier"
          @cancel-edit="OnCancelEdit"
      />

      <!-- Lista de ordenes asignadas al verificador -->

      <list-assigned-orders
          :items="assignedOrders"
          @remove-order="handleRemoveOrder"
      />
    </div>

  </div>


</template>

<style scoped>

</style>