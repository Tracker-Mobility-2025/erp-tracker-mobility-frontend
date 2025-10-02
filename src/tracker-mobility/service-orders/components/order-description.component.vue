<script>


export default {
  name: 'order-description',

  props : {
    item: {
      type: Object,
      required: true
    }
  },

  methods: {
    downloadDocument(type, document = null) {
      // Lógica para descargar documento
      console.log(`Descargar documento: ${type}`, document);
      // Aquí iría la lógica real de descarga
      this.$emit('download-document', { type, item: this.item, document });
    },

    getDocumentLabel(documentType) {
      const labels = {
        'identity': 'Documento de identidad',
        'receipt': 'Recibo de servicios (agua o luz)',
        'contract': 'Contrato de alquiler',
        'other': 'Otro documento'
      };
      return labels[documentType] || documentType || 'Documento';
    },

    handleImageError(event) {
      // Cambiar a imagen por defecto si no se puede cargar la imagen
      event.target.src = 'https://via.placeholder.com/150x100/f0f0f0/666666?text=Sin+imagen';
    }
  }
};

</script>

<template>

  <div class="flex flex-column pb-4 gap-4">

    <!-- ====================== Card -> Datos del solicitante ====================== -->
    <pv-card class="w-full">
      <template #content >
        <h3 class="text-lg font-bold mb-4 text-primary flex align-items-center gap-2">
          <i class="pi pi-briefcase"></i>
          Datos del solicitante
        </h3>
        
        <div class="formgrid grid">
          <!-- Fila 1: RUC, Razón Social y Nombre de ejecutivo -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-id-card text-primary"></i>
              Ruc
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.applicantCompany?.ruc || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-building text-primary"></i>
              Razón social
            </label>
            <p class=" font-semibold text-dark m-0">{{ item?.applicantCompany?.companyName || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-user text-primary"></i>
              Nombre de ejecutivo
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.applicantCompany?.executiveName || 'No disponible' }}</p>
          </div>
          <!-- Fila 2: Número de contacto y Correo corporativo -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-phone text-primary"></i>
              Número de contacto
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.applicantCompany?.contactPhoneNumber || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-8">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-envelope text-primary"></i>
              Correo corporativo
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.applicantCompany?.corporateEmail || 'No disponible' }}</p>
          </div>
        </div>
      </template>
    </pv-card>



    <!-- ====================== Card -> Datos del cliente ====================== -->
    <pv-card class="w-full">
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-primary flex align-items-center gap-2">
          <i class="pi pi-user-plus"></i>
          Datos del cliente
        </h3>
        
        <div class="formgrid grid">
          <!-- Fila 1: Nombres completos, Apellidos completos y Tipo de documento -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-user text-primary"></i>
              Nombres completos
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.client?.name || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-users text-primary"></i>
              Apellidos completos
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.client?.lastName || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-credit-card text-primary"></i>
              Tipo de documento
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.client?.identityDocument?.documentType || 'No disponible' }}</p>
          </div>
          <!-- Fila 2: N° de documento, Número de contacto y Dirección de domicilio -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-hashtag text-primary"></i>
              N° de documento de identidad
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.client?.identityDocument?.documentNumber || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-phone text-primary"></i>
              Número de contacto
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.client?.phoneNumber || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-home text-primary"></i>
              Dirección de domicilio
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.client?.dwelling?.homeAddress || 'No disponible' }}</p>
          </div>
          <!-- Ubicación en Google Maps -->
          <div class="field col-12" v-if="item?.client?.location?.mapLocation">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-map-marker text-primary"></i>
              Ubicación en google maps
            </label>
            <p class="text-color m-0">
              <a
                  :href="item.client.location.mapLocation"
                  target="_blank"
                  class="text-primary no-underline hover:underline flex align-items-center gap-2"
              >
                <i class="pi pi-external-link text-sm"></i>
                {{ item.client.location.mapLocation }}
              </a>
            </p>
          </div>
          <div class="field col-12" v-else>
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-map-marker text-primary"></i>
              Ubicación en google maps
            </label>
            <p class="text-color m-0">No disponible</p>
          </div>
        </div>
      </template>
    </pv-card>

    <!-- ====================== Card -> Documentos adjuntos ====================== -->
    <pv-card class="w-full">
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-primary flex align-items-center gap-2">
          <i class="pi pi-paperclip"></i>
          Documentos adjuntos
        </h3>
        
        <div v-if="item?.client?.documents && item.client.documents.length > 0" class="formgrid grid">
          <!-- Mostrar documentos disponibles dinámicamente -->
          <div 
            v-for="document in item.client.documents" 
            :key="document.id" 
            class="field col-12 md:col-6"
          >
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-file text-primary"></i>
              {{ getDocumentLabel(document.type) }}
            </label>
            <div class="mt-2 flex flex-column align-items-center">
              <img
                  :src="document.url || 'https://via.placeholder.com/150x100'"
                  :alt="getDocumentLabel(document.type)"
                  class="w-full max-w-8rem h-5rem object-fit-cover mb-2 border-round border-1 surface-border"
                  @error="handleImageError"
              />
              <pv-button 
                  icon="pi pi-download" 
                  class="p-button-sm p-button-text p-button-primary"
                  @click="downloadDocument(document.type, document)"
                  :disabled="!document.url"
              />
            </div>
          </div>
        </div>
        
        <!-- Mensaje cuando no hay documentos -->
        <div v-else class="text-center py-4">
          <i class="pi pi-file-excel text-4xl text-color-secondary"></i>
          <p class="text-color-secondary mt-2 mb-0">No hay documentos adjuntos disponibles</p>
        </div>
      </template>
    </pv-card>

    <!-- ====================== Card -> Datos del arrendador ====================== -->
    <pv-card class="w-full">
      <template #content>
        <h3 class="text-lg font-bold mb-4 text-primary flex align-items-center gap-2">
          <i class="pi pi-home"></i>
          Datos del arrendador
        </h3>
        
        <div class="formgrid grid">
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-user text-primary"></i>
              Nombre completo
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.client?.landlord?.fullName || 'No disponible' }}</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-phone text-primary"></i>
              Número de contacto
            </label>
            <p class="font-semibold text-dark m-0">{{ item?.client?.landlord?.phoneNumber || 'No disponible' }}</p>
          </div>
        </div>
      </template>
    </pv-card>

  </div>

</template>

<style scoped>

:deep(.p-card-content) {
  padding: 0.5rem;
}

</style>