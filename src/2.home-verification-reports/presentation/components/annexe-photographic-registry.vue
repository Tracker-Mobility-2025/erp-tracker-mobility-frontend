<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'pi-images'
  },
  description: {
    type: String,
    default: ''
  },
  descriptionLabel: {
    type: String,
    default: 'Descripción'
  },
  photos: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['view-photo']);

const handleViewPhoto = (photo) => {
  emit('view-photo', photo);
};
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i :class="`pi ${icon} text-white`"></i>
        {{ title }}
      </h3>
    </template>
    <template #content>
      <div class="formgrid grid">
        <!-- Descripción (opcional) -->
        <div v-if="description" class="field col-12">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-info-circle text-primary"></i>
            {{ descriptionLabel }}
          </label>
          <p class="font-semibold text-dark m-0 white-space-pre-wrap">
            {{ description }}
          </p>
        </div>

        <!-- Fotos -->
        <div class="field col-12">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2 mb-3">
            <i class="pi pi-images text-primary"></i>
            Fotografías ({{ photos.length }})
          </label>
          <div v-if="photos.length > 0" class="grid">
            <div 
              v-for="(photo, index) in photos" 
              :key="index"
              class="col-12 md:col-6 lg:col-3"
            >
              <pv-image 
                :src="photo.url" 
                :alt="photo.description"
                preview
                class="w-full border-round cursor-pointer"
                @click="handleViewPhoto(photo)"
              />
              <p class="text-sm text-center mt-2 text-color-secondary">
                {{ photo.description }}
              </p>
            </div>
          </div>
          <div v-else class="text-center p-4 surface-ground border-round">
            <p class="text-color-secondary m-0">
              <i class="pi pi-info-circle mr-2"></i>
              No hay fotografías disponibles
            </p>
          </div>
        </div>
      </div>
    </template>
  </pv-card>
</template>
