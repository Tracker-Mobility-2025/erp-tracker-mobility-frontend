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

  <div class="flex flex-column gap-4">

    <!-- ====================== Card -> Datos del solicitante ====================== -->
    <pv-card class="w-full">
      <template #content>
        <h3 class="text-lg font-semibold mb-4 text-primary">Datos del solicitante</h3>
        
        <div class="formgrid grid mb-4">
          <!-- Fila 1: RUC y Razón Social -->
          <div class="field col-12 md:col-6">
            <label class="font-medium text-color-secondary">Ruc</label>
            <p class="text-color m-0">1234567890</p>
          </div>
          <div class="field col-12 md:col-6">
            <label class="font-medium text-color-secondary">Razón social</label>
            <p class="text-color m-0">Tracker Mobility S.A.C</p>
          </div>
          <!-- Fila 2: Nombre de ejecutivo y Número de contacto -->
          <div class="field col-12 md:col-6">
            <label class="font-medium text-color-secondary">Nombre de ejecutivo</label>
            <p class="text-color m-0">Gonzalo Saldaña</p>
          </div>
          <div class="field col-12 md:col-6">
            <label class="font-medium text-color-secondary">Número de contacto</label>
            <p class="text-color m-0">999 888 777</p>
          </div>
          <!-- Fila 3: Correo corporativo (ocupa toda la fila) -->
          <div class="field col-12">
            <label class="font-medium text-color-secondary">Correo corporativo</label>
            <p class="text-color m-0">juan.perez@trackermobility.com</p>
          </div>
        </div>
      </template>
    </pv-card>



    <!-- ====================== Card -> Datos del cliente ====================== -->
    <pv-card class="w-full">
      <template #content>
        <h3 class="text-lg font-semibold mb-4 text-primary">Datos del cliente</h3>
        
        <div class="formgrid grid mb-4">
          <!-- Fila 1: Nombres completos y Apellidos completos -->
          <div class="field col-12 md:col-6">
            <label class="font-medium text-color-secondary">Nombres completos</label>
            <p class="text-color m-0">Janover Gonzalo</p>
          </div>
          <div class="field col-12 md:col-6">
            <label class="font-medium text-color-secondary">Apellidos completos</label>
            <p class="text-color m-0">Saldaña Vela</p>
          </div>
          <!-- Fila 2: Tipo de documento y N° de documento -->
          <div class="field col-12 md:col-6">
            <label class="font-medium text-color-secondary">Tipo de documento</label>
            <p class="text-color m-0">DNI</p>
          </div>
          <div class="field col-12 md:col-6">
            <label class="font-medium text-color-secondary">N° de documento de identidad</label>
            <p class="text-color m-0">75126098</p>
          </div>
          <!-- Fila 3: Número de contacto y Dirección de domicilio -->
          <div class="field col-12 md:col-6">
            <label class="font-medium text-color-secondary">Número de contacto</label>
            <p class="text-color m-0">1234567890</p>
          </div>
          <div class="field col-12 md:col-6">
            <label class="font-medium text-color-secondary">Dirección de domicilio</label>
            <p class="text-color m-0">999 888 777</p>
          </div>
          <!-- Ubicación en Google Maps -->
          <div class="field col-12">
            <label class="font-medium text-color-secondary">Ubicación en google maps</label>
            <p class="text-color m-0">
              <a
                  href="https://maps.app.goo.gl/VVQpZ2SPsPAinAovTA"
                  target="_blank"
                  class="text-primary no-underline hover:underline"
              >
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
        <h3 class="text-lg font-semibold mb-4 text-primary">Documentos adjuntos</h3>
        
        <div class="formgrid grid">
          <!-- Recibo de servicios -->
          <div class="field col-12 md:col-6">
            <label class="font-medium text-color-secondary">Recibo de servicios (agua o luz)</label>
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
            <label class="font-medium text-color-secondary">Documento de identidad</label>
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
        <h3 class="text-lg font-semibold mb-4 text-primary">Datos del arrendador</h3>
        
        <div class="formgrid grid">
          <div class="field col-12 md:col-6">
            <label class="font-medium text-color-secondary">Nombre completo</label>
            <p class="text-color m-0">Gonzalo Saldaña Vela</p>
          </div>
          <div class="field col-12 md:col-6">
            <label class="font-medium text-color-secondary">Número de contacto</label>
            <p class="text-color m-0">999 888 777</p>
          </div>
        </div>
      </template>
    </pv-card>

  </div>

</template>

<style scoped>

</style>