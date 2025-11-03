<script>
export default {
  name: 'request-client-details',

  props: {
    client: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // Copia local de los datos del cliente para edición
      localClient: null
    }
  },

  watch: {
    client: {
      handler(newValue) {
        if (newValue) {
          this.localClient = { ...newValue };
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <div class="flex align-items-center gap-2 px-3 py-2" :style="editMode ? 'background-color: #d97706; color: white; border-top-left-radius: 6px; border-top-right-radius: 6px;' : 'background-color: #4A60D0; color: white; border-top-left-radius: 6px; border-top-right-radius: 6px;'">
        <i class="pi pi-user-plus" style="color: white;"></i>
        <span class="text-lg font-bold">Datos del cliente</span>
        <pv-badge v-if="editMode" value="EDITABLE" severity="warning" class="ml-auto" style="opacity: 0.85;" />
      </div>
    </template>
    <template #content>
      <div class="formgrid grid">
        <!-- Fila 1: Nombres, Apellidos y Tipo de documento -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            Nombres completos
          </label>
          <pv-input-text
            v-if="editMode"
            v-model="localClient.name"
            class="w-full"
            placeholder="Ingrese nombres"
          />
          <p v-else class="font-semibold text-dark m-0">{{ client?.name || 'No disponible' }}</p>
        </div>
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-users text-primary"></i>
            Apellidos completos
          </label>
          <pv-input-text
            v-if="editMode"
            v-model="localClient.lastName"
            class="w-full"
            placeholder="Ingrese apellidos"
          />
          <p v-else class="font-semibold text-dark m-0">{{ client?.lastName || 'No disponible' }}</p>
        </div>
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-credit-card text-primary"></i>
            Tipo de documento
          </label>
          <pv-select
            v-if="editMode"
            v-model="localClient.identityDocument.documentType"
            :options="['DNI', 'CE', 'PASAPORTE']"
            class="w-full"
            placeholder="Seleccione tipo"
          />
          <p v-else class="font-semibold text-dark m-0">{{ client?.identityDocument?.documentType || 'No disponible' }}</p>
        </div>
        
        <!-- Fila 2: N° documento, Teléfono y Condición de inquilino -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-hashtag text-primary"></i>
            N° de documento
          </label>
          <pv-input-text
            v-if="editMode"
            v-model="localClient.identityDocument.documentNumber"
            class="w-full"
            placeholder="Ingrese número de documento"
          />
          <p v-else class="font-semibold text-dark m-0">{{ client?.identityDocument?.documentNumber || 'No disponible' }}</p>
        </div>
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-phone text-primary"></i>
            Teléfono
          </label>
          <pv-input-text
            v-if="editMode"
            v-model="localClient.phoneNumber"
            class="w-full"
            placeholder="Ingrese teléfono"
          />
          <p v-else class="font-semibold text-dark m-0">{{ client?.phoneNumber || 'No disponible' }}</p>
        </div>
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-home text-primary"></i>
            ¿Es inquilino?
          </label>
          <p class="font-semibold text-dark m-0">
            <pv-tag 
              :value="client?.isTenant ? 'Sí' : 'No'" 
              :severity="client?.isTenant ? 'info' : 'secondary'"
              class="text-sm"
            />
          </p>
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
