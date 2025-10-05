<script>

import VerifierDataAndEdit from "../components/verifier-data-and-edit.component.vue";
import {Verifier} from "../models/verifiers.entity.js";
import ListAssignedOrders from "../components/list-assigned-orders.component.vue";
import {VerifierApiService} from "../services/verifier-api.service.js";
import {Order} from "../models/order.entity.js";
import {OrderRequestApi} from "../../service-orders/services/order-request-api.service.js";

export default {
  name: 'verifiers-details-management',
  components: {ListAssignedOrders, VerifierDataAndEdit},


  data() {
    return {

      // Servicio de Order
      orderVerifierDetailRequestApi: new OrderRequestApi('/orders'),

      // Objeto para actualizar orden
      updateOrder: null,

      isEdit:false,
      submitted: false,

      item: new Verifier({}),
      itemUpdate: new Verifier({}),


      // Arreglo de órdenes asignadas al verificador
      assignedOrders: [],
      orderEntity: new Order({}),

      // Servicio de verificador
      verifierApiServices: null,
      
      // Estados de carga para datos del verificador
      isLoadingVerifier: true,
      hasVerifierError: false,
      verifierErrorMessage: '',
      
      // Estados de carga para órdenes asignadas
      isLoadingOrders: true,
      hasOrdersError: false,
      ordersErrorMessage: '',
      
      // Progreso de carga
      loadingStep: 0,
      loadingSteps: [
        { icon: 'pi-user', label: 'Datos del verificador' },
        { icon: 'pi-list', label: 'Órdenes asignadas' },
        { icon: 'pi-check', label: 'Configuración completa' }
      ],
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
    onRemoveOrder(order) {

      console.log('Removiendo orden del verificador:', order);

      this.updateOrder = {
        "homeVisitDetails": {
          "verifierId": null,
          "visitDate": "",
          "visitTime": ""
        }
      }

      console.log('Datos para actualizar la orden:', this.updateOrder + ' para la orden ID: ' + order.id);

      this.orderVerifierDetailRequestApi.updateOrderById(order.id, this.updateOrder).then(response => {
        console.log('Orden actualizada:', response.data);
        this.$toast.add({severity:'success', summary: 'Éxito', detail: 'Orden removida del verificador correctamente', life: 3000});

        // Actualizar la lista de órdenes asignadas en la interfaz
        this.assignedOrders = this.assignedOrders.filter(o => o.id !== order.id);

      }).catch(error => {
        console.error('Error al actualizar orden:', error);
        console.error('Detalles del error:', error.response?.data);
        this.$toast.add({severity:'error', summary: 'Error', detail: 'No se pudo remover la orden del verificador', life: 3000});
      });

    },

    // Método para confirmar si quiere remover la orden del verificador
    confirmRemoveOrder(order) {
      this.$confirm.require({
        message: '¿Está seguro que desea remover esta orden del verificador?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Remover',
        acceptClass: 'p-button-danger',
        accept: () => {
          this.onRemoveOrder(order);
        },
        reject: () => {
          // Acción al rechazar (opcional)
        }
      });
    },

    simulateLoadingProgress() {
      // Simular progreso paso a paso para mejor UX
      const progressInterval = setInterval(() => {
        if (this.loadingStep < this.loadingSteps.length - 1) {
          this.loadingStep++;
        } else {
          clearInterval(progressInterval);
        }
      }, 700); // Cambiar paso cada 700ms
      
      // Limpiar intervalo si la carga se completa antes
      setTimeout(() => {
        clearInterval(progressInterval);
      }, 4000);
    },

    retryLoadingVerifier() {
      const verifierId = this.$route.query.id;
      this.hasVerifierError = false;
      this.isLoadingVerifier = true;
      this.loadingStep = 0;
      
      this.simulateLoadingProgress();
      this.getVerifierById(verifierId);
    },

    retryLoadingOrders() {
      const verifierId = this.$route.query.id;
      this.hasOrdersError = false;
      this.isLoadingOrders = true;
      
      this.getAssignedOrdersByVerifierId(verifierId);
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

        this.isLoadingVerifier = false;
        console.log('Verificador recuperado:', this.item);
      }).catch(error => {
        console.error('Error al recuperar verificador:', error);
        this.hasVerifierError = true;
        this.isLoadingVerifier = false;
        this.verifierErrorMessage = 'No se pudo cargar la información del verificador. Intente nuevamente.';
      });
    },

    // Recuperar órdenes asignadas (simulado)
    getAssignedOrdersByVerifierId(verifierId) {
      let verifierApiServicesTmp = new VerifierApiService('/orders/verifier');

      verifierApiServicesTmp.getAssignedOrders(verifierId).then(response => {
        this.assignedOrders = response.data.map(orderData => new Order(orderData));
        
        // Completar todos los pasos y finalizar carga
        this.loadingStep = this.loadingSteps.length;
        this.isLoadingOrders = false;
        
        console.log('Órdenes asignadas recuperadas:', this.assignedOrders);
      }).catch(error => {
        console.error('Error al recuperar órdenes asignadas:', error);
        this.hasOrdersError = true;
        this.isLoadingOrders = false;
        this.ordersErrorMessage = 'No se pudieron cargar las órdenes asignadas. Intente nuevamente.';
      });
    }


  },

  created() {
    this.verifierApiServices = new VerifierApiService('/verifiers');

    const verifierId = this.$route.query.id;

    if (verifierId) {
      this.isLoadingVerifier = true;
      this.isLoadingOrders = true;
      this.loadingStep = 0;
      
      // Simular progreso de carga
      this.simulateLoadingProgress();
      
      this.getVerifierById(verifierId);
      this.getAssignedOrdersByVerifierId(verifierId);
    } else {
      this.hasVerifierError = true;
      this.isLoadingVerifier = false;
      this.isLoadingOrders = false;
      this.verifierErrorMessage = 'ID de verificador no válido.';
    }
  }
}

</script>

<template>

  <!-- dialogo de confirmación -->
  <pv-confirm-dialog />

  <!-- Detalles de la orden de servicio (se divide en cards tipo grid)-->
  <div class="order-container flex flex-column p-4 h-full w-full overflow-auto " >

    <!-- Breadcrumb -->
    <div class="text-base">
      <router-link
          :to="{ name: 'verifiers' }"
          class="font-bold text-gray-900 no-underline hover:underline cursor-pointer"
      >
        Verificadores
      </router-link>
      <span class="text-gray-500 font-bold"> / </span>
      <span class="text-blue-700 font-bold hover:underline cursor-pointer">
        {{item.name}}
      </span>
    </div>

    <!-- Estado de carga para datos del verificador -->
    <div v-if="isLoadingVerifier" class="loading-container">
      <div class="loading-content">
        <!-- Spinner elegante -->
        <pv-progress-spinner 
          size="48" 
          stroke-width="4" 
          animation-duration="1.2s" 
          class="loading-spinner"
        />
        
        <!-- Contenido textual simple -->
        <div class="loading-text">
          <h3 class="loading-title">Cargando verificador</h3>
          <p class="loading-subtitle">{{ loadingSteps[loadingStep]?.label || 'Preparando datos...' }}</p>
        </div>
      </div>
    </div>

    <!-- Estado de error para datos del verificador -->
    <div v-else-if="hasVerifierError" class="flex justify-content-center align-items-center" style="min-height: 50vh;">
      <div class="text-center">
        <i class="pi pi-exclamation-triangle text-6xl text-orange-500 mb-3"></i>
        <h3 class="text-xl text-gray-700">Error al cargar verificador</h3>
        <p class="text-gray-500 mb-4">{{ verifierErrorMessage }}</p>
        <pv-button 
          label="Reintentar" 
          icon="pi pi-refresh" 
          @click="retryLoadingVerifier"
          class="p-button-outlined"
        />
      </div>
    </div>

    <!-- Contenido principal -->
    <div v-else class="flex-1 flex flex-column gap-4 mt-4">
      <verifier-data-and-edit
          :item="item"
          :cant-orders="assignedOrders.length"
          :edit="isEdit"
          :submitted="submitted"
          @save-verifier="onSaveVerifier($event)"
          @cancel-edit="OnCancelEdit"
      />

      <!-- Sección de órdenes asignadas con manejo de errores independiente -->
      <div class="w-full flex-1 flex-column gap-3">
        <h3 class="text-xlg font-bold mb-3 flex align-items-center gap-2">
          <i class="pi pi-clipboard-list text-blue-500"></i>
          Órdenes asignadas
        </h3>

        <!-- Estado de carga para órdenes -->
        <div v-if="isLoadingOrders" class="flex justify-content-center align-items-center py-6">
          <div class="text-center">
            <pv-progress-spinner 
              size="32" 
              stroke-width="4" 
              animation-duration="1.2s" 
              class="mb-3"
            />
            <p class="text-gray-600">Cargando órdenes asignadas...</p>
          </div>
        </div>

        <!-- Estado de error para órdenes -->
        <div v-else-if="hasOrdersError" class="flex justify-content-center align-items-center py-6">
          <div class="text-center">
            <i class="pi pi-exclamation-triangle text-4xl text-orange-500 mb-3"></i>
            <h4 class="text-lg text-gray-700">Error al cargar órdenes</h4>
            <p class="text-gray-500 mb-4">{{ ordersErrorMessage }}</p>
            <pv-button 
              label="Reintentar" 
              icon="pi pi-refresh" 
              @click="retryLoadingOrders"
              class="p-button-outlined p-button-sm"
            />
          </div>
        </div>

        <!-- Lista de ordenes asignadas al verificador -->
        <list-assigned-orders
            v-else
            :items="assignedOrders"
            @remove-order="confirmRemoveOrder"
        />
      </div>
    </div>

  </div>


</template>

<style scoped>

/* Estilos del indicador de carga minimalista */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  background: #fafafa;
  border-radius: 8px;
  margin: 1rem 0;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
}

.loading-spinner {
  opacity: 0.8;
}

.loading-text {
  max-width: 300px;
}

.loading-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #374151;
  margin: 0;
  letter-spacing: -0.025em;
}

.loading-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
  transition: opacity 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .loading-container {
    min-height: 40vh;
    margin: 0.5rem 0;
  }
  
  .loading-title {
    font-size: 1.125rem;
  }
  
  .loading-subtitle {
    font-size: 0.8125rem;
  }
}

</style>