<script>


export default {
  name: 'order-description',

  props : {
    item: {
      type: Object,
      required: true
    }
  },

};

</script>

<template>

  <div class="flex flex-column gap-4">

    <!-- ====================== Card -> Datos del solicitante ====================== -->
    <div class="card p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h3 class="text-lg font-semibold mb-4 text-gray-900">Datos del solicitante</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- Fila 1: RUC y Razón Social -->
        <div>
          <span class="font-medium text-gray-700">Ruc</span>
          <div class="text-gray-900">1234567890</div>
        </div>
        <div>
          <span class="font-medium text-gray-700">Razón social</span>
          <div class="text-gray-900">Tracker Mobility S.A.C</div>
        </div>
        <!-- Fila 2: Nombre de ejecutivo y Número de contacto -->
        <div>
          <span class="font-medium text-gray-700">Nombre de ejecutivo</span>
          <div class="text-gray-900">Gonzalo Saldaña</div>
        </div>
        <div>
          <span class="font-medium text-gray-700">Número de contacto</span>
          <div class="text-gray-900">999 888 777</div>
        </div>
      </div>
      
      <!-- Fila 3: Correo corporativo (ocupa toda la fila) -->
      <div>
        <span class="font-medium text-gray-700">Correo corporativo</span>
        <div class="text-gray-900">juan.perez@trackermobility.com</div>
      </div>
    </div>



    <!-- ====================== Card -> Datos del cliente ====================== -->
    <div class="card p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h3 class="text-lg font-semibold mb-4 text-gray-900">Datos del cliente</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- Fila 1: Nombres completos y Apellidos completos -->
        <div>
          <span class="font-medium text-gray-700">Nombres completos</span>
          <div class="text-gray-900">Janover Gonzalo</div>
        </div>
        <div>
          <span class="font-medium text-gray-700">Apellidos completos</span>
          <div class="text-gray-900">Saldaña Vela</div>
        </div>
        <!-- Fila 2: Tipo de documento y N° de documento -->
        <div>
          <span class="font-medium text-gray-700">Tipo de documento</span>
          <div class="text-gray-900">DNI</div>
        </div>
        <div>
          <span class="font-medium text-gray-700">N° de documento de identidad</span>
          <div class="text-gray-900">75126098</div>
        </div>
        <!-- Fila 3: Número de contacto y Dirección de domicilio -->
        <div>
          <span class="font-medium text-gray-700">Número de contacto</span>
          <div class="text-gray-900">1234567890</div>
        </div>
        <div>
          <span class="font-medium text-gray-700">Dirección de domicilio</span>
          <div class="text-gray-900">999 888 777</div>
        </div>
      </div>
      
      <!-- Ubicación en Google Maps -->
      <div class="mb-4">
        <span class="font-medium text-gray-700">Ubicación en google maps</span>
        <div>
          <a
              href="https://maps.app.goo.gl/VVQpZ2SPsPAinAovTA"
              target="_blank"
              class="text-blue-600 hover:underline"
          >
            https://maps.app.goo.gl/VVQpZ2SPsPAinAovTA
          </a>
        </div>
      </div>
    </div>

    <!-- ====================== Card -> Documentos adjuntos ====================== -->
    <div class="card p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h3 class="text-lg font-semibold mb-4 text-gray-900">Documentos adjuntos</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Recibo de servicios -->
        <div>
          <span class="font-medium text-gray-700">Recibo de servicios (agua o luz)</span>
          <div class="mt-2 flex flex-col items-center">
            <img
                src="https://via.placeholder.com/150x100"
                alt="Recibo de Servicios"
                class="w-full max-w-32 h-20 object-cover mb-2 border border-gray-300 rounded"
            />
            <a
                href="#"
                download
                class="text-blue-600 hover:underline flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
              </svg>
            </a>
          </div>
        </div>
        
        <!-- Documento de identidad -->
        <div>
          <span class="font-medium text-gray-700">Documento de identidad</span>
          <div class="mt-2 flex flex-col items-center">
            <img
                src="https://via.placeholder.com/150x100"
                alt="Documento de Identidad"
                class="w-full max-w-32 h-20 object-cover mb-2 border border-gray-300 rounded"
            />
            <a
                href="#"
                download
                class="text-blue-600 hover:underline flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- ====================== Card -> Datos del arrendador ====================== -->
    <div class="card p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h3 class="text-lg font-semibold mb-4 text-gray-900">Datos del arrendador</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span class="font-medium text-gray-700">Nombre completo</span>
          <div class="text-gray-900">Gonzalo Saldaña Vela</div>
        </div>
        <div>
          <span class="font-medium text-gray-700">Número de contacto</span>
          <div class="text-gray-900">999 888 777</div>
        </div>
      </div>
    </div>

  </div>

</template>

<style scoped>

</style>