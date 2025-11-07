<script>
export default {
  name: 'request-applicant-details',

  props: {
    applicantCompany: {
      type: Object,
      required: true
    }
  }
}
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <div class="flex align-items-center gap-2 px-3 py-2" style="background-color: #4A60D0; color: white; border-top-left-radius: 6px; border-top-right-radius: 6px;">
        <i class="pi pi-briefcase" style="color: white;"></i>
        <span class="text-lg font-bold">Datos del solicitante</span>
      </div>
    </template>
    <template #content>
      <div class="formgrid grid">
        <!-- Fila 1: Razón Social, RUC y Ejecutivo -->
         <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-building text-primary"></i>
            Razón social
          </label>
          <p class="font-semibold text-dark m-0">{{ applicantCompany?.companyName || 'No disponible' }}</p>
        </div>

        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-id-card text-primary"></i>
            RUC
          </label>
          <p class="font-semibold text-dark m-0">{{ applicantCompany?.ruc || 'No disponible' }}</p>
        </div>
        
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            Ejecutivo
          </label>
          <p class="font-semibold text-dark m-0">{{ applicantCompany?.executiveName || 'No disponible' }}</p>
        </div>
        
        <!-- Fila 2: Teléfono y Correo -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-phone text-primary"></i>
            Teléfono de contacto
          </label>
          <p class="font-semibold text-dark m-0">{{ applicantCompany?.contactPhoneNumber || 'No disponible' }}</p>
        </div>
        <div class="field col-12 md:col-8">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-envelope text-primary"></i>
            Correo corporativo
          </label>
          <p class="font-semibold text-dark m-0">{{ applicantCompany?.corporateEmail || 'No disponible' }}</p>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
:deep(.p-card) {
  border-radius: 6px !important;
  overflow: hidden !important;
}

:deep(.p-card .p-card-header) {
  background-color: #4A60D0 !important;
  color: white !important;
  border-top-left-radius: 6px !important;
  border-top-right-radius: 6px !important;
  padding: 0 !important;
  border-bottom: none !important;
}

:deep(.p-card-content) {
  padding: 0.5rem;
}

.card-header {
  background-color: #4A60D0 !important;
  color: white !important;
}
</style>
