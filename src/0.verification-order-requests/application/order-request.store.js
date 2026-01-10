// Order Request Store
// Application layer - State management for order requests

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { OrderRequestApi } from '../infrastructure/order-request.api.js';
import { ClientFormData, ApplicantCompanyData } from '../domain/models/order-request.entity.js';

const api = new OrderRequestApi();

export const useOrderRequestStore = defineStore('orderRequest', () => {
  // State
  const currentStep = ref(1);
  const totalSteps = ref(4);
  const client = ref(new ClientFormData());
  const applicantCompany = ref(new ApplicantCompanyData());
  const orderResponse = ref(null);
  const isOrderCreated = ref(false);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const progressPercentage = computed(() => {
    return (currentStep.value / totalSteps.value) * 100;
  });

  const stepTitle = computed(() => {
    const titles = {
      1: 'Datos del cliente',
      2: 'Datos de domicilio',
      3: 'Documentación y datos adicionales',
      4: 'Resumen de solicitud'
    };
    return titles[currentStep.value] || '';
  });

  // Actions
  
  /**
   * Obtiene los datos de la empresa solicitante por username
   */
  async function fetchApplicantCompanyData(usernameEmployee) {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await api.getApplicantCompanyByUsername(usernameEmployee);
      
      if (response.data) {
        Object.assign(applicantCompany.value, response.data);
        console.log('✅ Datos de empresa cargados:', applicantCompany.value.companyName);
      }
      
      return { success: true, data: response.data };
    } catch (err) {
      error.value = err.message || 'Error al cargar datos de la empresa';
      console.error('❌ Error al obtener datos de empresa:', err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Crea una nueva orden de servicio
   */
  async function createOrder() {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await api.create(
        applicantCompany.value,
        client.value
      );
      
      if (response.data) {
        orderResponse.value = response.data;
        isOrderCreated.value = true;
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('orderData', JSON.stringify(response.data));
        localStorage.setItem('orderNumber', response.data.orderCode || '');
        localStorage.setItem('orderCreated', 'true');
        
        console.log('✅ Orden creada exitosamente:', response.data.orderCode);
      }
      
      return { success: true, data: response.data };
    } catch (err) {
      error.value = err.message || 'Error al crear la orden';
      console.error('❌ Error al crear orden:', err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Navega al siguiente paso
   */
  function goToNextStep() {
    if (currentStep.value < totalSteps.value) {
      currentStep.value++;
    }
  }

  /**
   * Navega al paso anterior
   */
  function goToPreviousStep() {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  }

  /**
   * Reinicia el formulario completo
   */
  function resetForm() {
    // Limpiar localStorage
    localStorage.removeItem('client');
    localStorage.removeItem('applicantCompany');
    localStorage.removeItem('orderCreated');
    localStorage.removeItem('orderNumber');
    localStorage.removeItem('orderData');
    
    // Reiniciar client
    client.value = new ClientFormData();
    
    // Reiniciar orderResponse
    orderResponse.value = null;
    isOrderCreated.value = false;
    
    // Volver al primer paso
    currentStep.value = 1;
    
    // Recargar datos de la empresa
    const username = localStorage.getItem('username');
    if (username) {
      fetchApplicantCompanyData(username);
    }
    
    console.log('🔄 Formulario reiniciado');
  }

  /**
   * Actualiza los datos del cliente
   */
  function updateClientData(data) {
    Object.assign(client.value, data);
  }

  /**
   * Navega directamente a un paso específico
   */
  function goToStep(step) {
    if (step >= 1 && step <= totalSteps.value) {
      currentStep.value = step;
    }
  }

  return {
    // State
    currentStep,
    totalSteps,
    client,
    applicantCompany,
    orderResponse,
    isOrderCreated,
    loading,
    error,
    
    // Getters
    progressPercentage,
    stepTitle,
    
    // Actions
    fetchApplicantCompanyData,
    createOrder,
    goToNextStep,
    goToPreviousStep,
    resetForm,
    updateClientData,
    goToStep
  };
});
