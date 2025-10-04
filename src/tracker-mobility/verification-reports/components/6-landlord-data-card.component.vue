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
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-user-edit text-white"></i>
        Datos del arrendador
      </h3>
    </template>
    <template #content>
      
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