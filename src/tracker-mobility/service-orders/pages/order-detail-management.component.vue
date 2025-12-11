<script>

import OrderDescription from "../components/order-description.component.vue";
import OrderActions from "../components/order-actions.component.vue";
import {OrderRequestApi} from "../services/order-request-api.service.js";
import {VerifierApi} from "../services/verifier-api.service.js";
import {OrderService} from "../models/order-service.entity.js";
import {Verifier} from "../../verifier-management/models/verifiers.entity.js";

export default {
  name: 'order-detail-management',
  components: {OrderActions, OrderDescription},

  data() {
    return {

      // Servicio para obtener detalles de la orden por ID
      orderRequestApi: new OrderRequestApi('/orders'),


      // Servicio para obtener lista de verificadores
      verifierApi: null,

      verifiersArray: [],

      statusOptions: [
        { label: 'Todos', value: null },
        { label: 'Pendiente', value: 'PENDIENTE' },
        { label: 'Asignado', value: 'ASIGNADO' },
        { label: 'En Proceso', value: 'EN_PROCESO' },
        { label: 'Completada', value: 'COMPLETADA' },
        { label: 'Cancelada', value: 'CANCELADA' },
        { label: 'Observado', value: 'OBSERVADO' },
        { label: 'Subsanada', value: 'SUBSANADA' }
      ],

      // Item de la orden obtenido de la API
      item: null,

      // Estados de carga
      isLoading: true,
      hasError: false,
      errorMessage: '',
      
      // Progreso de carga
      loadingStep: 0,
      loadingSteps: [
        { icon: 'pi-file-o', label: 'Datos de la orden' },
        { icon: 'pi-users', label: 'Información del cliente' },
        { icon: 'pi-cog', label: 'Detalles del servicio' }
      ],


    };
  },

  methods : {

    onDownloadDocument (payload) {
      // Lógica para descargar documento
      console.log(`Descargar documento: ${payload.type} para la orden ${payload.item.id}`);
      // Aquí iría la lógica real de descarga
    },

    // Formatear fecha para mostrar
    formatDate(dateString) {
      if (!dateString) return 'No disponible';
      
      try {
        // Manejar diferentes formatos de fecha de entrada
        let dateToFormat;
        
        if (dateString.includes('T')) {
          // Si tiene formato ISO con hora, extraer solo la fecha
          const datePart = dateString.split('T')[0];
          const [year, month, day] = datePart.split('-');
          // Crear fecha usando componentes individuales para evitar zona horaria
          dateToFormat = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else if (dateString.includes('-')) {
          // Si es formato YYYY-MM-DD
          const [year, month, day] = dateString.split('-');
          dateToFormat = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          // Fallback para otros formatos
          dateToFormat = new Date(dateString);
        }
        
        // Verificar que la fecha sea válida
        if (isNaN(dateToFormat.getTime())) return 'Fecha inválida';
        
        // Formatear como dd/mm/aaaa usando los métodos locales
        const day = dateToFormat.getDate().toString().padStart(2, '0');
        const month = (dateToFormat.getMonth() + 1).toString().padStart(2, '0');
        const year = dateToFormat.getFullYear();
        
        return `${day}/${month}/${year}`;
      } catch (error) {
        console.error('Error al formatear fecha:', error);
        return 'Fecha inválida';
      }
    },

    getOrderDetailsByOrderId(orderId) {
      // Lógica para obtener detalles de la orden por ID
      console.log(`Obtener detalles de la orden con ID: `, orderId);
      
      this.isLoading = true;
      this.hasError = false;
      this.loadingStep = 0;
      
      // Simular progreso de carga
      this.simulateLoadingProgress();
      
      this.orderRequestApi.getById(orderId).then(response => {
          this.item = new OrderService(response.data);
          
          // Completar todos los pasos
          this.loadingStep = this.loadingSteps.length;
          
          // Mostrar mensaje de éxito después de un breve delay
          setTimeout(() => {
            this.isLoading = false;
            console.log('Detalles de la orden obtenidos:', this.item);
          }, 300);
        })
        .catch(error => {
          console.error('Error al obtener detalles de la orden:', error);
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage = 'Error al cargar los detalles de la orden. Por favor, intente nuevamente.';
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
      }, 600); // Cambiar paso cada 600ms
      
      // Limpiar intervalo si la carga se completa antes
      setTimeout(() => {
        clearInterval(progressInterval);
      }, 4000);
    },

    // Obtener lista de verificadores disponibles
    getAllVerifiers() {
      // Lógica para obtener lista de verificadores activos
      console.log('Obtener lista de verificadores disponibles');
      this.verifierApi.getAll().then(response => {

        this.verifiersArray = response.data.map(resource  => new Verifier(resource));

        // Filtrar solo los verificadores con status ACTIVE
        this.verifiersArray = this.verifiersArray.filter(verifier => verifier.status === 'ACTIVE');

        console.log('Lista de verificadores obtenida:', this.verifiersArray);

        })
        .catch(error => {
          console.error('Error al obtener lista de verificadores:', error);
        });
    }

  },


  created() {
    // Obtener el id de la query en router
    const orderId = this.$route.query.id;

    console.log(`Cargar detalles de la orden con ID: ${orderId}`);
    // Aquí iría la lógica real para cargar los detalles de la orden usando el orderId

    // Inicializar servicios
    this.orderRequestApi = new OrderRequestApi('/orders');
    this.verifierApi = new VerifierApi('/verifiers');


    // Llamar a la función para obtener lista de verificadores
    this.getAllVerifiers();
    // Llamar a la función para obtener detalles de la orden
    this.getOrderDetailsByOrderId(orderId);

  }

};

</script>

<template>

  <!-- Detalles de la orden de servicio (se divide en cards tipo grid)-->
  <div class="order-container flex flex-column p-4 h-full w-full overflow-auto ">

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
    <div class="flex align-content-center justify-content-between  mt-4 mb-2" v-if="item">
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
    <div v-else-if="hasError" class="flex justify-content-center align-items-center h-20rem">
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
    <div v-else-if="item" class="grid">

      <!-- Columna izquierda (2/3 del ancho) -->
      <div class="col-16 lg:col-8" >
        <order-description
            :item="item"
            @download-document="onDownloadDocument"
        />
      </div>

      <!-- Columna derecha (1/3 del ancho) -->
      <div class="col-8 lg:col-4" >
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