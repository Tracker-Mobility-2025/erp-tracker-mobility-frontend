<script>
import { OrderResponse } from "../models/order-response.entity.js";

export default {
  name: 'resumen-service-order',
  
  inject: ['client', 'applicantCompany'],
  
  props: {
    orderResponseProp: {
      type: Object,
      default: null
    }
  },
  
  components: {},

  data() {
    return {
      content: {
        title: '¡Solicitud enviada de manera exitosa!',
        orderLabel: 'Orden de servicio:',
        applicantDataTitle: 'Datos del solicitante',
        customerDataTitle: 'Datos del cliente',
        facadePhotoTitle: 'Fotografía de la fachada',
        applicantLabels: {
          socialReason: 'Razón social',
          executiveName: 'Nombre ejecutivo',
          corporateEmail: 'Correo corporativo'
        },
        customerLabels: {
          fullName: 'Nombre completo',
          contactNumber: 'Número de contacto',
          address: 'Dirección'
        },
        actions: {
          print: 'Imprimir',
          finish: 'Finalizar'
        }
      }
    };
  },

  computed: {
    // Verificar si la solicitud fue creada exitosamente
    isRequestCreated() {
      // Obtener del localStorage o de query params del router
      return this.$route.query.success === 'true' || 
             localStorage.getItem('orderCreated') === 'true';
    },

    // Obtener los datos completos de la orden creada (prioridad: parent > prop > localStorage)
    orderData() {
      // Buscar orderResponse en el componente padre
      let parent = this.$parent;
      let maxDepth = 5; // Limitar la búsqueda para evitar bucles infinitos
      let currentDepth = 0;
      
      while (parent && !('orderResponse' in parent) && currentDepth < maxDepth) {
        parent = parent.$parent;
        currentDepth++;
      }
      
      if (parent && parent.orderResponse) {
        return parent.orderResponse;
      }
      
      // Luego la prop orderResponseProp si está disponible
      if (this.orderResponseProp) {
        return this.orderResponseProp;
      }
      
      // Fallback a localStorage
      try {
        const savedData = localStorage.getItem('orderData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          return new OrderResponse(parsedData);
        }
      } catch (error) {
        console.warn('Error al parsear orderData del localStorage:', error);
      }
      return null;
    },

    orderNumber() {
      // Priorizar datos del modelo, luego localStorage o query params
      return this.orderData?.orderCode || 
             this.$route.query.orderNumber || 
             localStorage.getItem('orderNumber') || 
             'ORD-XXXX-XXX';
    },

    // Fecha de solicitud formateada con manejo robusto de zona horaria
    requestDate() {
      // Priorizar el método del modelo si está disponible
      if (this.orderData?.formattedRequestDate) {
        return this.orderData.formattedRequestDate;
      }
      
      // Fallback: formatear manualmente con manejo de zona horaria
      const rawDate = this.orderData?.requestDate || 
                      this.$route.query.requestDate || 
                      localStorage.getItem('requestDate');
      
      if (!rawDate) return 'No especificado';
      
      return this.formatDateWithTimezone(rawDate);
    },

    // Datos del solicitante usando datos reales del applicantCompany (prioridad: orderData > inject)
    petitionerData() {
      const company = this.orderData?.applicantCompany || this.applicantCompany;
      return {
        razonSocial: company?.companyName || 'No especificado',
        nombreEjecutivo: company?.executiveName || 'No especificado',
        correoCorporativo: company?.corporateEmail || 'No especificado'
      };
    },

    // Foto de fachada desde el modelo Client (prioridad: orderData > inject)
    facadePhoto() {
      const client = this.orderData?.client || this.client;
      return client.documents?.find(doc => doc.type === 'FOTO_FACHADA_VIVIENDA') ||
             client.documents?.find(doc => doc.type === 'FACADE_PHOTO');
    },

    customerFullName() {
      const client = this.orderData?.client || this.client;
      return `${client.name || ''} ${client.lastName || ''}`.trim();
    },

    fullAddress() {
      const client = this.orderData?.client || this.client;
      
      // Si tenemos orderData, usar la dirección completa del modelo
      if (this.orderData?.client) {
        return this.orderData.clientAddress || '';
      }
      
      // Fallback para el client inyectado
      const parts = [
        client.homeAddress,
        client.district,
        client.province,
        client.department
      ].filter(Boolean);
      
      return parts.join(', ');
    },

    customerPhoneNumber() {
      const client = this.orderData?.client || this.client;
      return client.phoneNumber || 'No especificado';
    },

    facadePhotoUrl() {
      if (!this.facadePhoto) return null;
      
      // Si es un File object, crear URL temporal
      if (this.facadePhoto.file instanceof File) {
        return URL.createObjectURL(this.facadePhoto.file);
      }
      
      // Si ya es una URL en el documento
      if (this.facadePhoto.url) {
        return this.facadePhoto.url;
      }
      
      return null;
    }
  },

  methods: {
    onPrint() {
      window.print();
    },

    onFinish() {
      // Limpiar todos los datos del localStorage para permitir nuevo cliente
      localStorage.removeItem('orderCreated');
      localStorage.removeItem('orderNumber');
      localStorage.removeItem('orderData');
      localStorage.removeItem('client');
      localStorage.removeItem('applicantCompany');
      localStorage.removeItem('requestDate');
      
      // Mostrar mensaje de confirmación
      this.$toast?.add({
        severity: 'success',
        summary: 'Proceso completado',
        detail: 'Puede proceder a registrar un nuevo cliente',
        life: 3000
      });

      this.resetInjectedData();
      
      // Redirigir a la primera vista del formulario para nuevo cliente
      this.$router.push({ name: 'customer-data' });
    },

    resetInjectedData() {
      // Resetear Client
      this.client.lastName = "";
      this.client.documentNumber = "";
      this.client.landlordName = "";
      this.client.name = "";
      this.client.district = "";
      this.client.province = "";
      this.client.mapLocation = "";
      this.client.department = "";
      this.client.isTenant = false;
      this.client.homeAddress = "";
      this.client.documentType = "";
      this.client.phoneNumber = "";
      this.client.landlordPhoneNumber = "";
      this.client.documents = [];

      // Resetear ApplicantCompany
      this.applicantCompany.applicantCompanyId = null;
      this.applicantCompany.companyName = null;
      this.applicantCompany.contactPhoneNumber = null;
      this.applicantCompany.corporateEmail = null;
      this.applicantCompany.executiveName = null;
      this.applicantCompany.ruc = null;
    },

    // Método helper para formatear fechas con manejo correcto de zona horaria
    formatDateWithTimezone(dateInput) {
      if (!dateInput) return 'No especificado';
      
      try {
        let date;
        
        // Manejar diferentes formatos de entrada
        if (typeof dateInput === 'string') {
          // Si la fecha no tiene información de zona horaria, asumir UTC-5 (Perú)
          if (!dateInput.includes('T') && !dateInput.includes('Z') && 
              !dateInput.includes('+') && !dateInput.includes('-', 10)) {
            // Fecha simple (YYYY-MM-DD), agregar zona horaria de Perú
            date = new Date(dateInput + 'T00:00:00-05:00');
          } else {
            date = new Date(dateInput);
          }
        } else {
          date = new Date(dateInput);
        }
        
        if (isNaN(date.getTime())) throw new Error('Fecha inválida');
        
        // Formatear para zona horaria de Perú
        return date.toLocaleDateString('es-PE', {
          year: 'numeric',
          month: '2-digit', 
          day: '2-digit',
          timeZone: 'America/Lima'
        });
      } catch (error) {
        console.warn('Error al formatear fecha:', error);
        
        // Último recurso: formateo básico
        try {
          const fallbackDate = new Date(dateInput);
          if (!isNaN(fallbackDate.getTime())) {
            // Convertir ISO string a formato dd/mm/yyyy
            const isoString = fallbackDate.toISOString().split('T')[0];
            const [year, month, day] = isoString.split('-');
            return `${day}/${month}/${year}`;
          }
        } catch (e) {
          // Si todo falla, devolver el valor original
        }
        
        return dateInput.toString();
      }
    }
  },

  beforeUnmount() {
    // Limpiar URL temporal si existe
    if (this.facadePhotoUrl && this.facadePhoto?.file instanceof File) {
      URL.revokeObjectURL(this.facadePhotoUrl);
    }
  },

  created() {


    
    // Si hay orderResponse en el componente padre o como prop, no verificar localStorage
    let parent = this.$parent;
    while (parent && !('orderResponse' in parent)) {
      parent = parent.$parent;
    }
    if ((parent && parent.orderResponse) || this.orderResponseProp) {
      return;
    }
    
    // Verificar que la solicitud haya sido creada exitosamente
    if (!this.isRequestCreated) {
      // Si no hay solicitud creada, redirigir al inicio del flujo
      this.$toast?.add({
        severity: 'warn',
        summary: 'Acceso no autorizado',
        detail: 'Debe completar el proceso de solicitud antes de ver el resumen',
        life: 3000
      });
      this.$router.push({ name: 'customer-data' });
    }
  }
};

</script>

<template>
  <div class=" resumen-container flex w-full justify-content-center align-items-start min-h-screen p-4">
    <div class="resumen-content w-full border-round-xl shadow-3 p-6">
      <!-- Header con éxito -->
      <div class="text-center mb-4">
        <div class="success-icon inline-flex align-items-center justify-content-center mb-3">
          <i class="pi pi-check text-white text-xl"></i>
        </div>

        <h1 class="text-4xl font-bold m-0 pb-4" style="color: black">{{ content.title }}</h1>

        <!-- Orden de servicio -->
        <div class="order-info-container w-full">
          <div class="order-pill flex align-items-center justify-content-between gap-3 mb-3 w-full">
            <div>
              <span class="block">Orden de servicio:</span>
              <span class="order-pill-code block">{{ orderNumber }}</span>
            </div>
            <div class="text-right">
              <span class="text-sm text-gray-600 block">Fecha de solicitud</span>
              <span class="font-semibold text-blue-600">{{ requestDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid de contenido principal -->
      <div class="grid mb-4">
        <!-- Columna izquierda - Datos -->
        <div class="col-12 lg:col-8">
          <!-- Datos del solicitante -->
          <div class=" mb-4">
            <div class="flex align-items-center gap-2 mb-3">
              <i class="pi pi-building text-lg text-blue-600"></i>
              <h2 class="text-lg m-0 font-bold" style="color: black">{{ content.applicantDataTitle }}</h2>
            </div>
            <div class="section-content border-1 border-gray-200 border-round-xl p-4">
              <div class="grid">
                <!-- Primera columna -->
                <div class="col-12 md:col-6">
                  <div class="flex flex-column mb-3">
                    <span class="text-sm mb-1">{{ content.applicantLabels.socialReason }}</span>
                    <span class="font-semibold">{{ petitionerData.razonSocial || 'No especificado' }}</span>
                  </div>
                  <div class="flex flex-column">
                    <span class="text-sm mb-1">{{ content.applicantLabels.executiveName }}</span>
                    <span class="font-semibold">{{ petitionerData.nombreEjecutivo || 'No especificado' }}</span>
                  </div>
                </div>
                
                <!-- Segunda columna -->
                <div class="col-12 md:col-6">
                  <div class="flex flex-column">
                    <span class="text-sm mb-1">{{ content.applicantLabels.corporateEmail }}</span>
                    <span class="font-semibold">{{ petitionerData.correoCorporativo || 'No especificado' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Datos del cliente -->
          <div class="mb-4">
            <div class="flex align-items-center gap-2 mb-3">
              <i class="pi pi-user text-lg text-blue-600"></i>
              <h2 class="text-lg m-0 font-bold" style="color: black">{{ content.customerDataTitle }}</h2>
            </div>
            <div class="section-content border-1 border-gray-200 border-round-xl p-4">
              <div class="grid">
                <!-- Primera fila: dos columnas -->
                <div class="col-12 md:col-6">
                  <div class="flex flex-column mb-3">
                    <span class="text-sm mb-1">{{ content.customerLabels.fullName }}</span>
                    <span class="font-semibold">{{ customerFullName || 'No especificado' }}</span>
                  </div>
                </div>
                
                <div class="col-12 md:col-6">
                  <div class="flex flex-column mb-3">
                    <span class="text-sm mb-1">{{ content.customerLabels.contactNumber }}</span>
                    <span class="font-semibold">{{ customerPhoneNumber }}</span>
                  </div>
                </div>
                
                <!-- Segunda fila: dirección completa en todo el ancho -->
                <div class="col-12">
                  <div class="flex flex-column">
                    <span class="text-sm mb-1">{{ content.customerLabels.address }}</span>
                    <span class="font-semibold word-break-all">{{ fullAddress || 'No especificado' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna derecha - Fotografía -->
        <div class="col-12 lg:col-4">
          <div class="h-fit">
            <div class="flex align-items-center gap-2 mb-3">
              <i class="pi pi-image text-lg text-blue-600"></i>
              <h2 class="text-lg m-0 font-bold" style="color: black">{{ content.facadePhotoTitle }}</h2>
            </div>
            <div class="section-content border-1 border-gray-200 border-round-xl p-3 text-center">
              <img 
                v-if="facadePhotoUrl" 
                :src="facadePhotoUrl" 
                :alt="content.facadePhotoTitle"
                class="w-full border-round shadow-2"
                style="max-width: 300px; height: auto;"
              />
              <div v-else class="flex flex-column align-items-center justify-content-center p-4 text-gray-500">
                <i class="pi pi-image text-2xl mb-2"></i>
                <span>Sin fotografía</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-content-center gap-3 pt-3 border-top-1 border-gray-200 print-hide actions-responsive">
        <pv-button 
          :label="content.actions.print"
          icon="pi pi-print"
          class="button-print p-button-outlined"
          @click="onPrint"
        />
        <pv-button 
          :label="content.actions.finish"
          icon="pi pi-check-circle"
          class="button-finish"
          @click="onFinish"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

.resumen-content {
  width: 80%;
  max-width: 80%;
  background-color: white !important;
}

.section-content {
  background-color: var(--color-card-background) !important;
  color: black !important;
  border-color: var(--color-border-cards) !important;
}

/* Estilos para los botones */

.button-print {
  background-color: var(--color-text-gray) !important; /* Azul */
  border: 1px solid var(--color-text-gray) !important;
  color: white !important;
}

.button-finish {
  background-color: var(--color-primary) !important; /* Azul */
  color: white !important;
}




/* Contenedor de información de la orden */
.order-info-container {
  width: 100%;
  margin: 0 auto;
}

/* Estilos solo para el pill */
.order-pill{
  position: relative;
  background: #f8fbff;             /* fondo suave */
  color: black !important;
  border: 1px solid var(--color-border-cards);       /* azul */
  border-radius: 8px;
  padding: .5rem 1rem .5rem 1.75rem;
  justify-content: center;
}

/* Tarjetas de información */
.info-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.info-card:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

/* Oreja azul a la izquierda */
.order-pill::before{
  content:"";
  position:absolute;
  left:0; top:0; bottom:0;
  width:.4rem;
  background:#3b82f6;
  border-radius:8px 0 0 8px;
}

/* Código */
.order-pill-code {
  color:#1d4ed8;          /* azul fuerte */
  font-weight:700;
  font-size:1.1rem;
}



/* Solo estilos que no se pueden lograr con PrimeFlex */

.success-icon {
  width: 64px;
  height: 64px;
  background: #10b981;
  border-radius: 50%;
}

.loading-icon {
  width: 64px;
  height: 64px;
  background: #3b82f6;
  border-radius: 50%;
}

.error-icon {
  width: 64px;
  height: 64px;
  background: #ef4444;
  border-radius: 50%;
}

.validation-errors {
  max-width: 600px;
  margin: 0 auto;
}

.order-number {
  /* PrimeFlex no tiene una forma directa de manejar múltiples bordes y backgrounds específicos */
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

/* Responsive para botones en móviles */
@media (max-width: 480px) {
  .actions-responsive {
    flex-direction: column;
  }
  
  .actions-responsive .p-button {
    width: 100%;
  }
}

/* Solo para impresión: mostrar únicamente .resumen-content */
@media print {
  /* Quita márgenes de la página si deseas */
  @page {
    size: A4;
    margin: 12mm;
  }

  /* Oculta absolutamente todo */
  html, body {
    background: #fff !important;
  }

  body * {
    visibility: hidden !important;
  }

  /* Muestra solo el contenedor de resumen y su contenido */
  .resumen-content,
  .resumen-content * {
    visibility: visible !important;
  }

  /* Posiciona el resumen al inicio de la página y expándelo */
  .resumen-content {
    position: absolute !important;
    left: 0 !important;
    top: 70px !important; /* Opcional: ajusta según necesites */
    width: 100% !important;
    max-width: 100% !important;
    box-shadow: none !important;
    border: none !important;
    padding: 1rem !important;       /* opcional: controla márgenes internos */
  }

  /* Asegura que botones/acciones no aparezcan (ya tienen .print-hide) */
  .print-hide {
    display: none !important;
  }
}
</style>