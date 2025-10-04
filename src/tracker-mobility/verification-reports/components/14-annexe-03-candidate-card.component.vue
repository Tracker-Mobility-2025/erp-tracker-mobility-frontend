<script>

export default {
  name: 'annexe-03-candidate-card',

  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({
        title: 'ANEXO 03: Registro fotográfico del candidato',
        images: [
          {
            src: 'https://via.placeholder.com/300x200/dc2626/ffffff?text=Foto+Candidato',
            alt: 'Fotografía del candidato',
            description: 'Foto del candidato en el domicilio'
          },
          {
            src: 'https://via.placeholder.com/300x200/dc2626/ffffff?text=Documento+1',
            alt: 'Documento de identidad del candidato - Parte 1',
            description: 'Documento de identidad - Anverso'
          },
          {
            src: 'https://via.placeholder.com/300x200/dc2626/ffffff?text=Documento+2',
            alt: 'Documento de identidad del candidato - Parte 2', 
            description: 'Documento de identidad - Reverso'
          }
        ]
      })
    },
  },

  methods: {
    openImageModal(image) {
      // Lógica para abrir imagen en modal o nueva ventana
      console.log('Abrir imagen:', image.src);
    },

    downloadImage(image) {
      // Lógica para descargar imagen
      console.log('Descargar imagen:', image.src);
    }
  }

};

</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-user text-white"></i>
        {{ item?.title || 'ANEXO 03: Registro fotográfico del candidato' }}
      </h3>
    </template>
    <template #content>
      
      <div class="formgrid grid">
        <div class="field col-12">
          <div class="grid" v-if="item?.images && item.images.length > 0">
            <div 
              v-for="(image, index) in item.images" 
              :key="index" 
              class="col-12 md:col-6 lg:col-4"
            >
              <div class="image-container p-2">
                <div class="image-wrapper border-1 surface-border border-round overflow-hidden">
                  <img
                    :src="image.src"
                    :alt="image.alt"
                    class="w-full h-12rem object-fit-cover cursor-pointer transition-all transition-duration-300 hover:scale-105"
                    @click="openImageModal(image)"
                  />
                </div>
                <div class="image-actions mt-2 flex justify-content-center gap-2">
                  <pv-button 
                    icon="pi pi-eye" 
                    class="p-button-sm p-button-text p-button-primary"
                    v-tooltip="'Ver imagen'"
                    @click="openImageModal(image)"
                  />
                  <pv-button 
                    icon="pi pi-download" 
                    class="p-button-sm p-button-text p-button-primary"
                    v-tooltip="'Descargar imagen'"
                    @click="downloadImage(image)"
                  />
                </div>
                <p v-if="image.description" class="text-sm text-center text-color mt-1 m-0">
                  {{ image.description }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-center p-4">
            <i class="pi pi-image text-4xl text-color-secondary mb-3"></i>
            <p class="text-color-secondary m-0">No hay imágenes disponibles</p>
          </div>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
:deep(.p-card-content) {
  padding: 0.5rem;
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

.image-container {
  text-align: center;
}

.image-wrapper {
  position: relative;
  overflow: hidden;
}

.image-wrapper:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.transition-all {
  transition: all 0.3s ease;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>