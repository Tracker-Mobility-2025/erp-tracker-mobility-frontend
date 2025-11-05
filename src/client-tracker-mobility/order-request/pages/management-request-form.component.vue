<script>
import {ApplicantCompany} from "../models/applicant-company.entity.js";
import {CompanyEmployeesService} from "../services/company-employees-api.service.js";
import {Client} from "../models/client.entity.js";

// Componentes del formulario
import CustomerData from "../components/1-customer-data.component.vue";
import AddressData from "../components/2-address-data.component.vue";
import SupportDocsAndLandlordForm from "../components/3-support-docs-and-landlord-form.component.vue";
import ResumenServiceOrder from "../components/4-resumen-service-order.component.vue";

export default {
  name: 'management-request-form',

  components: {
    CustomerData,
    AddressData,
    SupportDocsAndLandlordForm,
    ResumenServiceOrder
  },

  data() {
    return {
      // Control de navegación de pasos
      currentStep: 1,
      totalSteps: 4, // Ahora incluye el paso de resumen

      // Servicio para obtener la información de la empresa solicitante
      companyEmployeesService: new CompanyEmployeesService('/company-employees'),
      
      // Modelos compartidos entre componentes
      client: new Client(),
      applicantCompany: new ApplicantCompany({}),
      orderResponse: null,
      
      // Control de estado del formulario
      isOrderCreated: false
    }
  },

  provide() {
    // Proveer los modelos a los componentes hijos
    return {
      client: this.client,
      applicantCompany: this.applicantCompany
    }
  },

  computed: {
    stepTitle() {
      const titles = {
        1: 'Datos del cliente',
        2: 'Datos de domicilio',
        3: 'Documentación y datos adicionales',
        4: 'Resumen de solicitud'
      };
      return titles[this.currentStep] || '';
    },

    progressPercentage() {
      return (this.currentStep / this.totalSteps) * 100;
    }
  },

  methods: {
    // Obtener datos de la empresa solicitante
    getApplicantCompanyData(usernameEmployee) {
      this.companyEmployeesService.getApplicantCompanyByUsernameEmployee(usernameEmployee)
        .then(response => {
          Object.assign(this.applicantCompany, response.data);
          console.log('Datos de empresa solicitante cargados:', this.applicantCompany.companyName);
        })
        .catch(error => {
          console.error('Error al obtener datos de empresa:', error);
        });
    },

    // Navegar al siguiente paso
    goToNextStep() {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.scrollToTop();
      }
    },

    // Regresar al paso anterior
    goToPreviousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.scrollToTop();
      }
    },

    // Scroll al inicio del área de contenido del formulario
    scrollToTop() {
      this.$nextTick(() => {
        const container = this.$el.querySelector('.form-content-container');
        if (container) {
          container.scrollTop = 0;
        }
      });
    },

    // Manejar la cancelación del formulario
    onFormCancel() {
      // Limpiar datos del localStorage
      localStorage.removeItem('client');
      localStorage.removeItem('applicantCompany');
      localStorage.removeItem('orderCreated');
      localStorage.removeItem('orderNumber');
      localStorage.removeItem('orderData');
      
      // Limpiar propiedades del client manteniendo la misma instancia
      Object.assign(this.client, {
        lastName: "",
        documentNumber: "",
        landlordName: "",
        name: "",
        district: "",
        province: "",
        mapLocation: "",
        department: "",
        isTenant: false,
        homeAddress: "",
        documentType: "",
        phoneNumber: "",
        landlordPhoneNumber: "",
        documents: []
      });
      
      // Limpiar propiedades del applicantCompany manteniendo la misma instancia
      Object.assign(this.applicantCompany, {
        applicantCompanyId: null,
        companyName: null,
        contactPhoneNumber: null,
        corporateEmail: null,
        executiveName: null,
        ruc: null
      });
      
      // Limpiar orderResponse
      this.orderResponse = null;
      
      // Volver al primer paso
      this.currentStep = 1;
      this.scrollToTop();
      
      // Recargar datos de la empresa solicitante
      const username = localStorage.getItem('username');
      if (username) {
        this.getApplicantCompanyData(username);
      }
    },

    // Manejar la finalización del formulario
    onFormComplete(orderResponseData) {
      // Guardar la respuesta de la orden
      this.orderResponse = orderResponseData;
      this.isOrderCreated = true;
      
      // Guardar en localStorage para persistencia
      if (orderResponseData) {
        localStorage.setItem('orderData', JSON.stringify(orderResponseData));
        localStorage.setItem('orderNumber', orderResponseData.orderCode || '');
        localStorage.setItem('orderCreated', 'true');
      }
      
      console.log('Formulario completado - Código:', orderResponseData?.orderCode);
      
      // Avanzar al paso 4 (resumen)
      this.currentStep = 4;
      this.scrollToTop();
    },

    // Manejar el finalizar desde el resumen para comenzar una nueva solicitud
    onFormFinish() {
      // Limpiar el estado de orden creada
      this.isOrderCreated = false;
      
      // Reutilizar el método onFormCancel que ya limpia todo correctamente
      this.onFormCancel();
    }
  },

  created() {
    // Obtener datos de la empresa solicitante al crear el componente
    const username = localStorage.getItem('username');
    if (username) {
      this.getApplicantCompanyData(username);
    } else {
      console.warn('No se encontró el username en localStorage');
    }
  }
}
</script>

<template>
  <div class="h-full flex justify-content-center align-items-start px-3 py-3">
    <div class="flex flex-column w-full h-full" style="max-width: 1200px;">
      
      <!-- Área fija: Título + Indicador de progreso -->
      <div class="flex flex-column align-items-center flex-shrink-0">
        <!-- Título principal - Siempre visible -->
        <h1 class="text-primary-local font-bold mb-2 text-center" style="font-size: 2rem;">
          Solicitud de visita domiciliaria
        </h1>

        <!-- Indicador de progreso -->
        <div class="w-full mb-3">
          <div class="flex justify-content-between align-items-center mb-2">
            <span class="text-sm font-medium text-color">Paso {{ currentStep }} de {{ totalSteps }}</span>
            <span class="text-sm font-medium text-primary-local">{{ progressPercentage.toFixed(0) }}% completado</span>
          </div>
          <pv-progress-bar 
            :value="progressPercentage" 
            :show-value="false"
            style="height: 0.5rem;"
          />
        </div>
      </div>

      <!-- Área scrollable: Componentes del formulario -->
      <div class="flex-grow-1 overflow-auto form-content-container">
        <div class="flex justify-content-center">
          <div class="w-full">
            <!-- Paso 1: Datos del cliente -->
            <customer-data 
              v-if="currentStep === 1"
              class="w-full"
              @next="goToNextStep"
            />

            <!-- Paso 2: Datos de domicilio -->
            <address-data 
              v-if="currentStep === 2"
              class="w-full"
              @next="goToNextStep"
              @back="goToPreviousStep"
            />

            <!-- Paso 3: Documentación y arrendador -->
            <support-docs-and-landlord-form 
              v-if="currentStep === 3"
              class="w-full"
              @back="goToPreviousStep"
              @cancel="onFormCancel"
              @complete="onFormComplete"
            />

            <!-- Paso 4: Resumen de la solicitud -->
            <resumen-service-order 
              v-if="currentStep === 4"
              class="w-full"
              :orderResponseProp="orderResponse"
              @finish="onFormFinish"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Área de contenido con scroll suave solo cuando sea necesario */
.form-content-container {
  scroll-behavior: smooth;
}

/* Estilos para el progress bar corporativo */
:deep(.p-progressbar) {
  background-color: var(--color-light);
  border-radius: 0.5rem;
}

:deep(.p-progressbar .p-progressbar-value) {
  background-color: var(--color-primary);
  border-radius: 0.5rem;
  transition: width 0.3s ease;
}
</style>