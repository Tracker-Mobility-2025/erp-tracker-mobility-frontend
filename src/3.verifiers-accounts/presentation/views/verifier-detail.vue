<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import VerifierDataAndEdit from "../../../tracker-mobility/verifier-management/components/verifier-data-and-edit.component.vue";
import ListAssignedOrders from "../../../tracker-mobility/verifier-management/components/list-assigned-orders.component.vue";
import useVerifierStore from "../../application/verifier.store.js";
import { UpdateVerifierCommand } from "../../domain/commands/update-verifier.command.js";

// Composables
const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const verifierStore = useVerifierStore();

// State
const item = ref({});
const itemUpdate = ref({});
const isEdit = ref(false);
const submitted = ref(false);
const assignedOrders = ref([]);

// Loading states
const isLoadingVerifier = ref(true);
const hasVerifierError = ref(false);
const verifierErrorMessage = ref('');

const isLoadingOrders = ref(true);
const hasOrdersError = ref(false);
const ordersErrorMessage = ref('');

const loadingStep = ref(0);
const loadingSteps = [
  { icon: 'pi-user', label: 'Datos del verificador' },
  { icon: 'pi-list', label: 'Órdenes asignadas' },
  { icon: 'pi-check', label: 'Configuración completa' }
];

// Methods
const onSaveVerifier = (updatedData) => {
  console.log('Guardando verificador:', updatedData);
  
  const updateCommand = new UpdateVerifierCommand({
    id: item.value.id,
    ...updatedData
  });
  
  itemUpdate.value = updateCommand;
  isEdit.value = false;
  submitted.value = true;
  update();
};

const update = () => {
  verifierStore.updateVerifier(itemUpdate.value);
  
  // Actualizar item local
  item.value = {
    ...item.value,
    ...itemUpdate.value
  };
  
  toast.add({
    severity: 'success',
    summary: 'Éxito',
    detail: 'Verificador actualizado correctamente',
    life: 3000
  });
};

const OnCancelEdit = () => {
  isEdit.value = false;
  submitted.value = false;
};

const onRemoveOrder = async (order) => {
  console.log('Removiendo orden del verificador:', order);
  
  // TODO: Implementar actualización de orden para remover verificador
  // Esto debería estar en un OrderStore separado
  const updateOrder = {
    homeVisitDetails: {
      verifierId: null,
      visitDate: "",
      visitTime: ""
    }
  };
  
  try {
    // Por ahora simulamos la actualización
    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Orden removida del verificador correctamente',
      life: 3000
    });
    
    // Actualizar la lista localmente
    assignedOrders.value = assignedOrders.value.filter(o => o.id !== order.id);
  } catch (error) {
    console.error('Error al actualizar orden:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo remover la orden del verificador',
      life: 3000
    });
  }
};

const confirmRemoveOrder = (order) => {
  confirm.require({
    message: '¿Está seguro que desea remover esta orden del verificador?',
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Remover',
    acceptClass: 'p-button-danger',
    accept: () => {
      onRemoveOrder(order);
    }
  });
};

const simulateLoadingProgress = () => {
  const progressInterval = setInterval(() => {
    if (loadingStep.value < loadingSteps.length - 1) {
      loadingStep.value++;
    } else {
      clearInterval(progressInterval);
    }
  }, 700);
  
  setTimeout(() => {
    clearInterval(progressInterval);
  }, 4000);
};

const retryLoadingVerifier = () => {
  const verifierId = route.query.id;
  hasVerifierError.value = false;
  isLoadingVerifier.value = true;
  loadingStep.value = 0;
  
  simulateLoadingProgress();
  getVerifierById(verifierId);
};

const retryLoadingOrders = () => {
  const verifierId = route.query.id;
  hasOrdersError.value = false;
  isLoadingOrders.value = true;
  
  getAssignedOrdersByVerifierId(verifierId);
};

const getVerifierById = async (verifierId) => {
  try {
    // Buscar en el store
    let verifier = verifierStore.getVerifierById(verifierId);
    
    // Si no está en el store, buscarlo en la API
    if (!verifier) {
      await verifierStore.fetchVerifiers();
      verifier = verifierStore.getVerifierById(verifierId);
    }
    
    if (verifier) {
      item.value = { ...verifier };
      isLoadingVerifier.value = false;
      console.log('Verificador recuperado:', item.value);
    } else {
      throw new Error('Verificador no encontrado');
    }
  } catch (error) {
    console.error('Error al recuperar verificador:', error);
    hasVerifierError.value = true;
    isLoadingVerifier.value = false;
    verifierErrorMessage.value = 'No se pudo cargar la información del verificador. Intente nuevamente.';
  }
};

const getAssignedOrdersByVerifierId = async (verifierId) => {
  try {
    const orders = await verifierStore.fetchAssignedOrders(verifierId);
    assignedOrders.value = orders || [];
    
    loadingStep.value = loadingSteps.length;
    isLoadingOrders.value = false;
    
    console.log('Órdenes asignadas recuperadas:', assignedOrders.value);
  } catch (error) {
    console.error('Error al recuperar órdenes asignadas:', error);
    hasOrdersError.value = true;
    isLoadingOrders.value = false;
    ordersErrorMessage.value = 'No se pudieron cargar las órdenes asignadas. Intente nuevamente.';
  }
};

// Lifecycle
onMounted(async () => {
  const verifierId = route.query.id;

  if (verifierId) {
    isLoadingVerifier.value = true;
    isLoadingOrders.value = true;
    loadingStep.value = 0;
    
    simulateLoadingProgress();
    
    await getVerifierById(verifierId);
    await getAssignedOrdersByVerifierId(verifierId);
  } else {
    hasVerifierError.value = true;
    isLoadingVerifier.value = false;
    isLoadingOrders.value = false;
    verifierErrorMessage.value = 'ID de verificador no válido.';
  }
});
</script>

<template>
  <pv-confirm-dialog/>
  <pv-toast/>

  <div class="order-container flex flex-column p-4 h-full w-full overflow-auto">
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
        {{ item.name }}
      </span>
    </div>

    <!-- Estado de carga para datos del verificador -->
    <div v-if="isLoadingVerifier" class="loading-container">
      <div class="loading-content">
        <pv-progress-spinner 
          size="48" 
          stroke-width="4" 
          animation-duration="1.2s" 
          class="loading-spinner"
        />
        
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

      <!-- Sección de órdenes asignadas -->
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

        <!-- Lista de ordenes asignadas -->
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