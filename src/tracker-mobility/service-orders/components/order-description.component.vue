<script>


export default {
  name: 'order-description',

  props : {
    order: {
      type: Object,
      required: true
    }
  }




};

</script>

<template>

  <!-- Card de datos del solicitante en dos columnas (RUC - Razón social / Nombre de ejecutivo - Número de
        contacto / Correo corporativo) -->

  <div class="p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
    <h3 class="text-lg font-semibold mb-2 text-gray-900">Datos del solicitante</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <span class="font-medium text-gray-700">RUC:</span>
        <span class="text-gray-900"> 12345678901</span>
      </div>
      <div>
        <span class="font-medium text-gray-700">Razón Social:</span>
        <span class="text-gray-900"> Empresa Ejemplo S.A.</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      <div>
        <span class="font-medium text-gray-700">Nombre del Ejecutivo:</span>
        <span class="text-gray-900"> Juan Pérez</span>
      </div>
      <div>
        <span class="font-medium text-gray-700">Número de Contacto:</span>
        <span class="text-gray-900"> +51 987654321</span>
      </div>
    </div>

    <div class="mt-2">
      <span class="font-medium text-gray-700">Correo Corporativo:</span>
      <span class="text-gray-900"> juan@trackermobility.com </span>
    </div>
  </div>


  <!-- Card
  Titulo -> Datos del cliente
  Nombres completos - Apellidos completos
  Tipo de documento - N° de documento de identidad
  Número de contacto - Dirección de domicilio
  Ubicación por google maps (link)

  Titulo -> Documentos adjuntos (Ambos visibles en miniatura y al hacer click se descarga)
  Recibo de servicios (aguo o luz) - Documento de identidad
   -->

  <div class="p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
    <h3 class="text-lg font-semibold mb-2 text-gray-900">Datos del cliente</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <span class="font-medium text-gray-700">Nombres Completos:</span>
        <span class="text-gray-900"> Carlos Ramírez</span>
      </div>
      <div>
        <span class="font-medium text-gray-700">Apellidos Completos:</span>
        <span class="text-gray-900"> López García</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      <div>
        <span class="font-medium text-gray-700">Tipo de Documento:</span>
        <span class="text-gray-900"> DNI</span>
      </div>
      <div>
        <span class="font-medium text-gray-700">N° de Documento de Identidad:</span>
        <span class="text-gray-900"> 45678912</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      <div>
        <span class="font-medium text-gray-700">Número de Contacto:</span>
        <span class="text-gray-900"> +51 912345678</span>
      </div>
      <div>
        <span class="font-medium text-gray-700">Dirección de Domicilio:</span>
        <span class="text-gray-900"> Av. Siempre Viva 123, Lima</span>
      </div>
    </div>

    <div class="mt-2">
      <a
          href="https://maps.google.com/?q=Av.+Siempre+Viva+123,+Lima"
          target="_blank"
          class="text-blue-600 hover:underline"
      >
        Ver Ubicación en Google Maps
      </a>
    </div>

    <div class="mt-4">
      <h3 class="text-lg font-semibold mb-2 text-gray-900">Documentos Adjuntos</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col items-center">
          <img
              src="https://via.placeholder.com/150"
              alt="Recibo de Servicios"
              class="w-32 h-32 object-cover mb-2 border border-gray-300 rounded"
          />
          <a
              href="#"
              download
              class="text-blue-600 hover:underline"
          >
            Descargar Recibo de Servicios
          </a>
        </div>
        <div class="flex flex-col items-center">
          <img
              src="https://via.placeholder.com/150"
              alt="Documento de Identidad"
              class="w-32 h-32 object-cover mb-2 border border-gray-300 rounded"
          />
          <a
              href="#"
              download
              class="text-blue-600 hover:underline"
          >
            Descargar Documento de Identidad
          </a>
        </div>
      </div>
    </div>
  </div>



  <!-- Card
    Titulo -> Datos del arrendador
    Nombre completo - Número de contacto
   -->
  <div class="p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
    <h3 class="text-lg font-semibold mb-2 text-gray-900">Datos del arrendador</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <span class="font-medium text-gray-700">Nombre Completo:</span>
        <span class="text-gray-900"> Luis Fernández</span>
      </div>
      <div>
        <span class="font-medium text-gray-700">Número de Contacto:</span>
        <span class="text-gray-900"> +51 923456789</span>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>