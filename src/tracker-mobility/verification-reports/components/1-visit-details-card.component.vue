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
    <template #content>
      <h3 class="text-lg font-bold mb-4 text-primary">Detalles de la visita:</h3>
      
      <div class="formgrid grid">
        <!-- Verificador -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary">Verificador</label>
          <p class="font-semibold text-dark m-0">
            {{ item?.verifier || 'No especificado' }}
          </p>
        </div>
        
        <!-- Enlace Google Maps -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary">Enlace google maps (dirección)</label>
          <p class="text-color m-0">
            <a
              v-if="item?.googleMapsLink"
              :href="item.googleMapsLink"
              target="_blank"
              class="text-primary no-underline hover:underline break-all"
              @click.prevent="openGoogleMaps()"
            >
              {{ item.googleMapsLink }}
            </a>
            <span v-else>No disponible</span>
          </p>
        </div>
        
        <!-- Fecha de verificación -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary">Fecha de verificación</label>
          <p class="font-semibold text-dark m-0">
            {{ item?.verificationDate || 'No especificado' }}
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
</style>