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
    downloadDocument(type) {
      // Lógica para descargar documento
      console.log(`Descargar documento: ${type}`);
      // Aquí iría la lógica real de descarga
      this.$emit('download-document', { type, item: this.item });
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
            <p class="font-semibold text-dark m-0">1234567890</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-building text-primary"></i>
              Razón social
            </label>
            <p class=" font-semibold text-dark m-0">Tracker Mobility S.A.C</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-user text-primary"></i>
              Nombre de ejecutivo
            </label>
            <p class="font-semibold text-dark m-0">Gonzalo Saldaña</p>
          </div>
          <!-- Fila 2: Número de contacto y Correo corporativo -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-phone text-primary"></i>
              Número de contacto
            </label>
            <p class="font-semibold text-dark m-0">999 888 777</p>
          </div>
          <div class="field col-12 md:col-8">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-envelope text-primary"></i>
              Correo corporativo
            </label>
            <p class="font-semibold text-dark m-0">juan.perez@trackermobility.com</p>
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
            <p class="font-semibold text-dark m-0">Janover Gonzalo</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-users text-primary"></i>
              Apellidos completos
            </label>
            <p class="font-semibold text-dark m-0">Saldaña Vela</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-credit-card text-primary"></i>
              Tipo de documento
            </label>
            <p class="font-semibold text-dark m-0">DNI</p>
          </div>
          <!-- Fila 2: N° de documento, Número de contacto y Dirección de domicilio -->
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-hashtag text-primary"></i>
              N° de documento de identidad
            </label>
            <p class="font-semibold text-dark m-0">75126098</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-phone text-primary"></i>
              Número de contacto
            </label>
            <p class="font-semibold text-dark m-0">1234567890</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-home text-primary"></i>
              Dirección de domicilio
            </label>
            <p class="font-semibold text-dark m-0">999 888 777</p>
          </div>
          <!-- Ubicación en Google Maps -->
          <div class="field col-12">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-map-marker text-primary"></i>
              Ubicación en google maps
            </label>
            <p class="text-color m-0">
              <a
                  href="https://maps.app.goo.gl/VVQpZ2SPsPAinAovTA"
                  target="_blank"
                  class="text-primary no-underline hover:underline flex align-items-center gap-2"
              >
                <i class="pi pi-external-link text-sm"></i>
                https://maps.app.goo.gl/VVQpZ2SPsPAinAovTA
              </a>
            </p>
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
        
        <div class="formgrid grid">
          <!-- Recibo de servicios -->
          <div class="field col-12 md:col-6">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-file text-primary"></i>
              Recibo de servicios (agua o luz)
            </label>
            <div class="mt-2 flex flex-column align-items-center">
              <img
                  src="https://via.placeholder.com/150x100"
                  alt="Recibo de Servicios"
                  class="w-full max-w-8rem h-5rem object-fit-cover mb-2 border-round border-1 surface-border"
              />
              <pv-button 
                  icon="pi pi-download" 
                  class="p-button-sm p-button-text p-button-primary"
                  @click="downloadDocument('recibo')"
              />
            </div>
          </div>
          
          <!-- Documento de identidad -->
          <div class="field col-12 md:col-6">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-id-card text-primary"></i>
              Documento de identidad
            </label>
            <div class="mt-2 flex flex-column align-items-center">
              <img
                  src="https://via.placeholder.com/150x100"
                  alt="Documento de Identidad"
                  class="w-full max-w-8rem h-5rem object-fit-cover mb-2 border-round border-1 surface-border"
              />
              <pv-button 
                  icon="pi pi-download" 
                  class="p-button-sm p-button-text p-button-primary"
                  @click="downloadDocument('documento')"
              />
            </div>
          </div>
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
            <p class="font-semibold text-dark m-0">Gonzalo Saldaña Vela</p>
          </div>
          <div class="field col-12 md:col-4">
            <label class="font-semibold text-color-secondary flex align-items-center gap-2">
              <i class="pi pi-phone text-primary"></i>
              Número de contacto
            </label>
            <p class="font-semibold text-dark m-0">999 888 777</p>
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