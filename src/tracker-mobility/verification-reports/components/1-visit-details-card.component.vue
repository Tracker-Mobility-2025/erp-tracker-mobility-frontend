<script>

export default {
  name: 'visit-details-card',

  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({
        verifier: 'Janover Gonzalo Saldaña Vela',
        googleMapsLink: 'https://maps.app.goo.gl/WQpZ2SPsPAinAovTA',
        verificationDate: '10/09/2025'
      })
    },
    // Resultado de la verificación (string)
    result: {
      type: String,
      required: false,
      default: 'Pendiente'
    }
  },

  computed: {
    resultClass() {
      const result = this.result?.toLowerCase();
      return {
        'text-green-700 bg-green-100': result === 'conforme',
        'text-yellow-700 bg-yellow-100': result === 'observado',
        'text-red-700 bg-red-100': result === 'rechazado',
        'text-blue-700 bg-blue-100': result === 'pendiente',
        'text-purple-700 bg-purple-100': result === 'ent faltante'
      };
    },
    
    formattedResult() {
      if (this.result === 'ENTREVISTA_ARRENDADOR_FALTANTE') {
        return 'ENT FALTANTE';
      }
      return this.result;
    }
  },

  methods: {
    openGoogleMaps() {
      if (this.item?.googleMapsLink) {
        window.open(this.item.googleMapsLink, '_blank');
      }
    }
  }

};

</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-map-marker text-white"></i>
        Detalles de la visita
      </h3>
    </template>
    <template #content>
      
      <div class="formgrid grid w-full">
        <!-- Verificador -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            Verificador
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.verifier || 'No especificado' }}
          </p>
        </div>
        
        <!-- Enlace Google Maps -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-globe text-primary"></i>
            Enlace google maps (dirección)
          </label>
          <p class="text-color m-0">
            <a
              v-if="item?.googleMapsLink"
              :href="item.googleMapsLink"
              target="_blank"
              class="text-primary no-underline hover:underline break-all flex align-items-center gap-2"
              @click.prevent="openGoogleMaps()"
            >
              <i class="pi pi-external-link text-sm"></i>
              {{ item.googleMapsLink }}
            </a>
            <span v-else>No disponible</span>
          </p>
        </div>
        
        <!-- Fecha de verificación -->
        <div class="field col-12 md:col-3 ">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-calendar text-primary"></i>
            Fecha de verificación
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.verificationDate || 'No especificado' }}
          </p>
        </div>
        
        <!-- Resultado -->
        <div class="field col-12 md:col-2 ">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-check-circle text-primary"></i>
            Resultado
          </label>
          <p class="font-semibold text-dark m-0">
            <span 
              :class="[resultClass, 'px-2 py-1 border-round text-sm font-semibold']"
            >
              {{ formattedResult || 'No especificado' }}
            </span>
          </p>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
:deep(.p-card-content) {
  padding: 0.5rem;
}

.break-all {
  word-break: break-all;
}

:deep(.p-card-header) {
  background-color: #4A60D0;
  border-radius: 0.375rem 0.375rem 0 0;
  overflow: hidden;
}

:deep(.p-card) {
  overflow: hidden;
  border-radius: 0.375rem;
}
</style>