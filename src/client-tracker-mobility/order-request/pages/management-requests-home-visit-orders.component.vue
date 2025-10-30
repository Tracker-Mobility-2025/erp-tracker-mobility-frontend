<script>

import ToolbarTrackerMobility from "../../../public/components/toolbar-tracker-mobility.component.vue";
import RequestProgressBar from "../components/request-progress-bar.component.vue";
import CustomerDataComponent from "../components/1-customer-data.component.vue";
import AddressDataComponent from "../components/2-address-data.component.vue";
import SupportDocsAndLandlordFormComponent from "../components/3-support-docs-and-landlord-form.component.vue";
import ResumenServiceOrderComponent from "../components/4-resumen-service-order.component.vue";
import {CompanyEmployeesService} from "../services/company-employees-api.service.js";
import {Client} from "../models/client.entity.js";
import {ApplicantCompany} from "../models/applicant-company.entity.js";

export default {
  name: 'management-requests-home-visit-orders',
  components: {
    RequestProgressBar,
    ToolbarTrackerMobility,
    CustomerDataComponent,
    AddressDataComponent,
    SupportDocsAndLandlordFormComponent,
    ResumenServiceOrderComponent
  },

  data(){
    return {
      // Control de vista actual
      currentView: 'customer-data', // 'customer-data' | 'address-data' | 'documentation-upload' | 'confirmation'

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
        { label: 'Datos de domicilio', icon: 'mdi:home-outline', to: 'address-data' },
        { label: 'Documentación', icon: 'mdi:file-document-outline', to: 'documentation-upload' },
        { label: 'Confirmación', icon: 'mdi:check-circle-outline', to: 'confirmation' },
      ];
    },

    currentStep() {
      const viewToStepMap = {
        'customer-data': 1,
        'address-data': 2,
        'documentation-upload': 3,
        'confirmation': 4,
      };
      return viewToStepMap[this.currentView] || 1;
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
    },

    // Navegar a la siguiente vista
    goToNextView() {
      const views = ['customer-data', 'address-data', 'documentation-upload', 'confirmation'];
      const currentIndex = views.indexOf(this.currentView);
      if (currentIndex < views.length - 1) {
        this.currentView = views[currentIndex + 1];
      }
    },

    // Navegar a la vista anterior
    goToPreviousView() {
      const views = ['customer-data', 'address-data', 'documentation-upload', 'confirmation'];
      const currentIndex = views.indexOf(this.currentView);
      if (currentIndex > 0) {
        this.currentView = views[currentIndex - 1];
      }
    }

  },

  created() {
    // Inicializar con la primera vista
    this.currentView = 'customer-data';

    // Inicializar el servicio y obtener datos de la empresa solicitante
    this.companyEmployeesService = new CompanyEmployeesService('/company-employees');
    this.getApplicantCompanyAndEmployeeData(localStorage.getItem('username'));
  }

};

</script>

<template>
  <div class="service-order-management h-screen flex flex-column">


    <div class="progress-bar-content p-3">
      <request-progress-bar :step-labels="items" :current-step="currentStep" />
    </div>

    <!-- Formularios -->
    <div class="form-content p-4">
      <customer-data-component
        v-if="currentView === 'customer-data'"
        @next="goToNextView"
      />
      <address-data-component
        v-if="currentView === 'address-data'"
        @next="goToNextView"
        @back="goToPreviousView"
      />
      <support-docs-and-landlord-form-component
        v-if="currentView === 'documentation-upload'"
        @next="goToNextView"
        @back="goToPreviousView"
      />
      <resumen-service-order-component
        v-if="currentView === 'confirmation'"
        @back="goToPreviousView"
      />
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