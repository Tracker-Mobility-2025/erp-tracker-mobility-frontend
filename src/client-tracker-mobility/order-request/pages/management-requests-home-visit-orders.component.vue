<script>

import ToolbarTrackerMobility from "../../../public/components/toolbar-tracker-mobility.component.vue";
import RequestProgressBar from "../components/request-progress-bar.component.vue";
import {CompanyEmployeesService} from "../services/company-employees-api.service.js";
import {Client} from "../models/client.entity.js";
import {ApplicantCompany} from "../models/applicant-company.entity.js";

export default {
  name: 'management-requests-home-visit-orders',
  components: {RequestProgressBar, ToolbarTrackerMobility},

  data(){
    return {
      // Servicio para obtener la información de la empresa solicitante.
      companyEmployeesService: new CompanyEmployeesService('/company-employees'),

      // Instancia del modelo Client para manejar todos los datos del cliente
      client: new Client(),
      // Instancia del modelo ApplicantCompany para manejar todos los datos de la empresa solicitante
      applicantCompany: new ApplicantCompany({}),
      // Respuesta de la orden creada (se actualiza después de crear la solicitud)
      orderResponse: null
    }
  },

  provide() {
    return {
      client: this.client,
      applicantCompany: this.applicantCompany,
    };
  },

  computed: {

    items() {
      return [
        { label: 'Datos del cliente', icon: 'mdi:account-outline', to: 'customer-data' },
        { label: 'Documentación', icon: 'mdi:file-document-outline', to: 'documentation-upload' },
        { label: 'Confirmación', icon: 'mdi:check-circle-outline', to: 'confirmation' },
      ];
    },

    currentStep() {
      const routeToStepMap = {
        'service-order-request-management': 1,
        'customer-data': 1,
        'documentation-upload': 2,
        'confirmation': 3,
      };
      return routeToStepMap[this.$route.name] || 0;
    },

  },

  methods: {

    // retornar datos de la empresa solicitante y ejecutivo asignado
    getApplicantCompanyAndEmployeeData(usernameEmployee) {
      this.companyEmployeesService.getApplicantCompanyByUsernameEmployee(usernameEmployee).then(response => {

        // ✅ Actualizar propiedades existentes en lugar de reemplazar el objeto
        Object.assign(this.applicantCompany, response.data);
      }).catch(error => {
        console.error('Error al obtener los datos de la empresa solicitante y del empleado:', error);
      })
    }

  },

  created() {

    // Navegar con router a /admin/order-details
    this.$router.push({ name: 'customer-data'});

    // Inicializar el objeto serviceRequest si es necesario
    this.companyEmployeesService = new CompanyEmployeesService('/company-employees');
    this.getApplicantCompanyAndEmployeeData(localStorage.getItem('username'));
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