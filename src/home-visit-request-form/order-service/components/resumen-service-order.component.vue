<script>

export default {
  name: 'resumen-service-order',
  
  inject: ['serviceRequest'],
  
  components: {},

  data() {
    return {
      orderNumber: 'ORD-2025-001', // Este podría generarse dinámicamente
      
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
    petitionerData() {
      return this.serviceRequest?.petitionerData || {};
    },

    customerData() {
      return this.serviceRequest?.clientData || {};
    },

    addressData() {
      return this.serviceRequest?.addressData || {};
    },

    supportDocs() {
      return this.serviceRequest?.supportDocs || [];
    },

    landlordData() {
      return this.serviceRequest?.landlordData || {};
    },


    customerFullName() {
      const customer = this.customerData;
      return `${customer.nombresCompletos || ''} ${customer.apellidosCompletos || ''}`.trim();
    },

    fullAddress() {
      const address = this.addressData;
      const parts = [
        address.direccionCompleta,
        address.distrito,
        address.provincia,
        address.departamento
      ].filter(Boolean);
      
      return parts.join(', ');
    },

    facadePhoto() {
      return this.addressData?.fotografiaDomicilio;
    },

    facadePhotoUrl() {
      if (!this.facadePhoto) return null;
      
      // Si es un File object, crear URL temporal
      if (this.facadePhoto instanceof File) {
        return URL.createObjectURL(this.facadePhoto);
      }
      
      // Si ya es una URL
      if (typeof this.facadePhoto === 'string') {
        return this.facadePhoto;
      }
      
      return null;
    }
  },

  methods: {
    onPrint() {
      window.print();
    },

    onFinish() {
      // Redirigir al inicio o a donde corresponda
      this.$router.push('/');
    }
  },

  beforeUnmount() {
    // Limpiar URL temporal si existe
    if (this.facadePhotoUrl && this.facadePhoto instanceof File) {
      URL.revokeObjectURL(this.facadePhotoUrl);
    }
  },

  created() {
    // Lógica de inicialización si es necesario
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
        <div class="order-pill flex align-items-center gap-2">
          <div>
            <span class="block">Orden de servicio:</span>
            <span class="order-pill-code block"> ORD-2025-001 </span>
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
              <div class="flex flex-column mb-3">
                <span class="text-sm  mb-1">{{ content.applicantLabels.socialReason }}</span>
                <span class="font-semibold ">{{ petitionerData.razonSocial || 'No especificado' }}</span>
              </div>
              <div class="flex flex-column mb-3">
                <span class="text-sm mb-1">{{ content.applicantLabels.executiveName }}</span>
                <span class="font-semibold">{{ petitionerData.nombreEjecutivo || 'No especificado' }}</span>
              </div>
              <div class="flex flex-column">
                <span class="text-sm mb-1">{{ content.applicantLabels.corporateEmail }}</span>
                <span class="font-semibold">{{ petitionerData.correoCorporativo || 'No especificado' }}</span>
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
              <div class="flex flex-column mb-3">
                <span class="text-sm mb-1">{{ content.customerLabels.fullName }}</span>
                <span class="font-semibold ">{{ customerFullName || 'No especificado' }}</span>
              </div>
              <div class="flex flex-column mb-3">
                <span class="text-sm  mb-1">{{ content.customerLabels.contactNumber }}</span>
                <span class="font-semibold ">{{ customerData.numeroContacto || 'No especificado' }}</span>
              </div>
              <div class="flex flex-column">
                <span class="text-sm mb-1">{{ content.customerLabels.address }}</span>
                <span class="font-semibold  word-break-all">{{ fullAddress || 'No especificado' }}</span>
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




/* Estilos solo para el pill */
.order-pill{
  position: relative;
  background: #f8fbff;             /* fondo suave */
  color: black !important;
  border: 1px solid var(--color-border-cards);       /* azul */
  border-radius: 8px;
  padding: .5rem 1rem .5rem 1.75rem;
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