<script>

export default {
  name: 'landlord-data-card',

  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({
        fullName: 'Janover Gonzalo Saldaña Vela',
        contactNumber: '999 777 666',
        documentNumber: '007943592',
        documentType: 'CE'
      })
    },
  },
}

</script>

<template>
  <pv-card class="w-full">
    <template #content>
      <h3 class="text-lg font-bold mb-4 text-primary flex align-items-center gap-2">
        <i class="pi pi-user-edit"></i>
        Datos del arrendador
      </h3>
      
      <div class="formgrid grid">
        <!-- Nombre completo -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            Nombre completo:
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.fullName || 'No especificado' }}
          </p>
        </div>
        
        <!-- Número de contacto -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-phone text-primary"></i>
            Número de contacto:
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.contactNumber || 'No especificado' }}
          </p>
        </div>
        
        <!-- Número de documento -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-hashtag text-primary"></i>
            Número de documento:
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.documentNumber || 'No especificado' }}
          </p>
        </div>
        
        <!-- Tipo -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-credit-card text-primary"></i>
            Tipo:
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.documentType || 'No especificado' }}
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
</style>