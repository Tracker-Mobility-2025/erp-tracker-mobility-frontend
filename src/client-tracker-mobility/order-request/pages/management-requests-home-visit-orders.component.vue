<script>

import {OrderServiceRequest} from "../models/order-service-request.entity.js";
import ToolbarTrackerMobility from "../../../public/components/toolbar-tracker-mobility.component.vue";
import RequestProgressBar from "../components/request-progress-bar.component.vue";

export default {
  name: 'management-requests-home-visit-orders',
  components: {RequestProgressBar, ToolbarTrackerMobility},

  data(){
    return {
      serviceRequest: new OrderServiceRequest(),
    }
  },

  provide() {
    return {
      serviceRequest: this.serviceRequest
    };
  },

  computed: {

    items() {
      return [
        { label: 'Datos del solicitante', icon: 'mdi:office-building-outline', to: 'petitioner-data' },
        { label: 'Datos del cliente', icon: 'mdi:account-outline', to: 'customer-data' },
        { label: 'Documentación', icon: 'mdi:file-document-outline', to: 'documentation-upload' },
        { label: 'Confirmación', icon: 'mdi:check-circle-outline', to: 'confirmation' },
      ];
    },

    currentStep() {
      const routeToStepMap = {
        'service-order-request-management': 1,
        'petitioner-data': 1,
        'customer-data': 2,
        'documentation-upload': 3,
        'confirmation': 4,
      };
      return routeToStepMap[this.$route.name] || 0;
    }

  },

  created() {

    // Navegar con router a /admin/order-details
    this.$router.push({ name: 'petitioner-data'});


    // Inicializar el objeto serviceRequest si es necesario
    this.serviceRequest = new OrderServiceRequest();

    console.log(this.serviceRequest);

    console.log(this.currentStep);

  }

};

</script>

<template>
  <div class="service-order-management h-screen flex flex-column">
    <!-- Toolbar fijo en la parte superior -->
    <div class="toolbar-content flex-shrink-0 sticky top-0 z-5">
      <toolbar-tracker-mobility />
    </div>

    <!-- Contenedor con scroll que incluye barra de progreso y formulario -->
    <div class="main-content flex-1 overflow-auto">
      <!-- Barra de progreso -->
      <div class="progress-bar-content p-3">
        <request-progress-bar :step-labels="items" :current-step="currentStep" />
      </div>

      <!-- Formularios -->
      <div class="form-content p-4">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>

.service-order-management {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.toolbar-content {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
  z-index: 1000;
}


/* Asegurar que el contenido del formulario no se desborde */
.form-content > * {
  max-width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-content {
    padding: 1rem;
  }

  .progress-bar-content {
    padding: 0.75rem;
  }
}
</style>