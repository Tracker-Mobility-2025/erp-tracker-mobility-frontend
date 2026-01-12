<script>

import OrderDescription from "../components/order-description.component.vue";
import OrderActions from "../components/order-actions.component.vue";
import {OrderRequestApi} from "../services/order-request-api.service.js";
import {VerifierApi} from "../services/verifier-api.service.js";
import {OrderService} from "../models/order-service.entity.js";
import {Verifier} from "../../../3.verifiers-accounts/domain/models/verifier.entity.js";
import {NotificationMixin} from "../../../shared/utils/notification.utils.js";

// Constantes de configuración
const STATUS_OPTIONS = [
  { label: 'Todos', value: null },
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Asignado', value: 'ASIGNADO' },
  { label: 'En Proceso', value: 'EN_PROCESO' },
  { label: 'Completada', value: 'COMPLETADA' },
  { label: 'Cancelada', value: 'CANCELADA' },
  { label: 'Observado', value: 'OBSERVADO' },
  { label: 'Subsanada', value: 'SUBSANADA' }
];

const LOADING_STEPS = [
  { icon: 'pi-file-o', label: 'Datos de la orden' },
  { icon: 'pi-users', label: 'Información del cliente' },
  { icon: 'pi-cog', label: 'Detalles del servicio' }
];

export default {
  name: 'order-detail-management',
  
  mixins: [NotificationMixin],
  
  components: {OrderActions, OrderDescription},

  data() {
    return {
      orderRequestApi: new OrderRequestApi('/orders'),
      verifierApi: new VerifierApi('/verifiers'),
      verifiersArray: [],
      statusOptions: STATUS_OPTIONS,
      item: null,
      isLoading: true,
      hasError: false,
      errorMessage: '',
      loadingStep: 0,
      loadingSteps: LOADING_STEPS,
      loadingProgressInterval: null
    };
  },

  methods : {

    onDownloadDocument (payload) {
      // Lógica para descargar documento
      console.log(`Descargar documento: ${payload.type} para la orden ${payload.item.id}`);
      // Aquí iría la lógica real de descarga
    },

    formatDate(dateString) {
      if (!dateString) return 'No disponible';
      try {
        const datePart = dateString.includes('T') ? dateString.split('T')[0] : dateString;
        const [year, month, day] = datePart.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        
        if (isNaN(date.getTime())) return 'Fecha inválida';
        
        return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
      } catch (error) {
        console.error('Error al formatear fecha:', error);
        return 'Fecha inválida';
      }
    },

    async getOrderDetailsByOrderId(orderId) {
      console.log(`Obtener detalles de la orden con ID: `, orderId);
      
      this.resetLoadingState();
      this.simulateLoadingProgress();
      
      try {
        const response = await this.orderRequestApi.getById(orderId);
        this.item = new OrderService(response.data);
        this.loadingStep = this.loadingSteps.length;
        
        await new Promise(resolve => setTimeout(resolve, 200));
        this.isLoading = false;
        console.log('Detalles de la orden obtenidos:', this.item);
      } catch (error) {
        console.error('Error al obtener detalles de la orden:', error);
        this.handleLoadingError();
        this.showToast({
          severity: 'error',
          summary: 'Error al cargar',
          detail: 'No se pudieron obtener los detalles de la orden.'
        });
      }
    },

    simulateLoadingProgress() {
      this.clearLoadingInterval();
      this.loadingProgressInterval = setInterval(() => {
        if (this.loadingStep < this.loadingSteps.length - 1) {
          this.loadingStep++;
        } else {
          this.clearLoadingInterval();
        }
      }, 200);
      setTimeout(() => this.clearLoadingInterval(), 4000);
    },

    async getAllVerifiers() {
      console.log('Obtener lista de verificadores disponibles');
      try {
        const response = await this.verifierApi.getAll();
        this.verifiersArray = response.data
          .map(resource => new Verifier(resource))
          .filter(verifier => verifier.status === 'ACTIVE');
        console.log('Lista de verificadores obtenida:', this.verifiersArray);
      } catch (error) {
        console.error('Error al obtener lista de verificadores:', error);
        this.showToast({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'No se pudo cargar la lista de verificadores.'
        });
      }
    },

    // Métodos helper para gestión de estado
    resetLoadingState() {
      this.isLoading = true;
      this.hasError = false;
      this.loadingStep = 0;
      this.errorMessage = '';
    },

    handleLoadingError() {
      this.isLoading = false;
      this.hasError = true;
      this.errorMessage = 'Error al cargar los detalles de la orden. Por favor, intente nuevamente.';
    },

    clearLoadingInterval() {
      if (this.loadingProgressInterval) {
        clearInterval(this.loadingProgressInterval);
        this.loadingProgressInterval = null;
      }
    }
  },


  created() {
    const orderId = this.$route.query.id;
    console.log(`Cargar detalles de la orden con ID: ${orderId}`);
    this.getAllVerifiers();
    this.getOrderDetailsByOrderId(orderId);
  },

  beforeUnmount() {
    this.clearLoadingInterval();
  }
};

</script>

<template>

  <!-- Detalles de la orden de servicio (se divide en cards tipo grid)-->
  <div class="flex flex-column p-4 h-full w-full">

    <!-- Breadcrumb -->
    <div class="text-base">
      <router-link
          :to="{ name: 'service-orders' }"
          class="font-bold text-gray-900 no-underline hover:underline cursor-pointer"
      >
        Órdenes
      </router-link>
      <span class="text-gray-500 font-bold"> / </span>
      <span class="text-blue-700 font-bold hover:underline cursor-pointer">
        detalle de la orden
      </span>
    </div>

    <!-- Número de orden a la izquierda y fecha de solicitud a la derecha -->
    <div class="flex align-content-center justify-content-between mt-4 mb-2" v-if="item">
      <!-- Izquierda -->
      <h2 class="text-2xl xl:font-bold font-extrabold text-gray-900">
        Orden:<span class="text-blue-700 xl:font-bold "> {{ item.orderCode || 'No disponible' }}</span>
      </h2>

      <!-- Derecha -->
      <span class="font-medium text-gray-900">
        Fecha de solicitud: {{ formatDate(item.requestDate) }}
      </span>
    </div>


    <!-- Estado de carga minimalista -->
    <div v-if="isLoading" class="loading-container">
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
          <h3 class="loading-title">Cargando orden de servicio</h3>
          <p class="loading-subtitle">{{ loadingSteps[loadingStep]?.label || 'Preparando datos...' }}</p>
        </div>
      </div>
    </div>

    <!-- Estado de error -->
    <div v-else-if="hasError" class="flex justify-content-center align-items-center ">
      <pv-message severity="error" :closable="false">
        <template #default>
          <div class="flex flex-column align-items-center">
            <i class="pi pi-exclamation-triangle text-4xl mb-3"></i>
            <span>{{ errorMessage }}</span>
            <pv-button 
              label="Reintentar" 
              icon="pi pi-refresh" 
              class="mt-3"
              @click="getOrderDetailsByOrderId($route.query.id)"
            />
          </div>
        </template>
      </pv-message>
    </div>

    <!-- Grid de detalles de la orden (con dos columnas: izquierda más ancha, derecha más estrecha) -->
    <div v-else-if="item" class="flex flex-wrap gap-3">

      <!-- Columna izquierda (60% del ancho) -->
      <div class="flex-1" style="min-width: 300px; max-width: 100%;">
        <order-description
            :item="item"
            @download-document="onDownloadDocument"
        />
      </div>

      <!-- Columna derecha (40% del ancho) -->
      <div class="flex-none" style="width: 450px; min-width: 300px;">
        <order-actions
            :item="item"
            :verifiers-list="verifiersArray"
            :status-options="statusOptions"
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