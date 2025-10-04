<script>

export default {
  name: 'details-residence-dwelling-garage-card',

  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({
        livesWith: 'Vive con su pareja e hijos',
        resides: 'Sí',
        residenceTime: '5 años',
        housingRented: 'Alquilado',
        housingType: 'Departamento',
        floorsQuantity: '5 pisos',
        floorLives: '5 piso',
        facadeColor: 'Verde',
        material: 'Noble',
        state: 'Bueno',
        zone: 'Urbana',
        housingStatus: 'Amoblada',
        roofType: 'Techada',
        zoneCharacteristic: 'Vigilada',
        housingAccess: 'Fácil',
        zoneRisk: 'Ninguna',
        garageIs: 'Alquilado',
        garageDistance: 'Ubicada dentro de la vivienda',
        realDirection: 'Calle 27 las praderas Mz K Lote 46 Santa Anita',
        familiarReferences: [
          { name: 'Lucila', contact: '999 666 777', relationship: 'Arrendador' },
          { name: 'Meleni', contact: '999 666 777', relationship: 'Esposa' },
          { name: 'José', contact: '999 666 777', relationship: 'Primo' }
        ]
      })
    },
  },

  computed: {
    statusClass() {
      return {
        'text-green-700 bg-green-100': true // Default styling
      };
    }
  }
}

</script>

<template>
  <div class="flex flex-column gap-4">
    <!-- Primera card: Detalles de residencia, vivienda y cochera -->
    <pv-card class="w-full">
      <template #header>
        <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
          <i class="pi pi-home text-white"></i>
          Detalles de residencia, vivienda y cochera
        </h3>
      </template>
      <template #content>
        <!-- SECCIÓN: Información de Residencia -->
        <div class="mb-4">
          <h4 class="text-md font-bold text-primary mb-3">
            Información de Residencia
          </h4>
          <div class="formgrid grid">
            <div class="field col-12 md:col-3">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-users text-primary"></i>
                Vive con:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.livesWith || 'No especificado' }}</p>
            </div>
            
            <div class="field col-12 md:col-3">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-check-circle text-primary"></i>
                Reside:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.resides || 'No especificado' }}</p>
            </div>
            
            <div class="field col-12 md:col-3">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-clock text-primary"></i>
                Tiempo de residencia:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.residenceTime || 'No especificado' }}</p>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: Características de la Vivienda -->
        <div class="mb-4">
          <h4 class="text-md font-bold text-primary mb-3">
            Características de la Vivienda
          </h4>
          <div class="formgrid grid">
            <div class="field col-12 md:col-3">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-key text-primary"></i>
                Vivienda es:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.housingRented || 'No especificado' }}</p>
            </div>
            
            <div class="field col-12 md:col-3">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-building text-primary"></i>
                Tipo de vivienda:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.housingType || 'No especificado' }}</p>
            </div>
            
            <div class="field col-12 md:col-3">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-sort-numeric-up text-primary"></i>
                Cant. de pisos:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.floorsQuantity || 'No especificado' }}</p>
            </div>
            
            <div class="field col-12 md:col-3">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-arrow-up text-primary"></i>
                Piso que habita:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.floorLives || 'No especificado' }}</p>
            </div>
            
            <div class="field col-12 md:col-3">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-home text-primary"></i>
                La vivienda está:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.housingStatus || 'No especificado' }}</p>
            </div>
            
            <div class="field col-12 md:col-3">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-angle-up text-primary"></i>
                Techo de vivienda:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.roofType || 'No especificado' }}</p>
            </div>
            
            <div class="field col-12 md:col-3">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-wrench text-primary"></i>
                Material:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.material || 'No especificado' }}</p>
            </div>
            
            <div class="field col-12 md:col-3">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-star text-primary"></i>
                Estado:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.state || 'No especificado' }}</p>
            </div>
            
            <div class="field col-12 md:col-4">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-palette text-primary"></i>
                Color de fachada:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.facadeColor || 'No especificado' }}</p>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: Información de la Zona -->
        <div class="mb-4">
          <h4 class="text-md font-bold text-primary mb-3">
            Información de la Zona
          </h4>
          <div class="formgrid grid">
            <div class="field col-12 md:col-3">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-map text-primary"></i>
                Zona:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.zone || 'No especificado' }}</p>
            </div>
            
            <div class="field col-12 md:col-3">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-eye text-primary"></i>
                Característica de la zona:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.zoneCharacteristic || 'No especificado' }}</p>
            </div>
            
            <div class="field col-12 md:col-3">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-exclamation-triangle text-primary"></i>
                Riesgo de la zona:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.zoneRisk || 'No especificado' }}</p>
            </div>
            
            <div class="field col-12 md:col-3">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-sign-in text-primary"></i>
                Acceso a la vivienda:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.housingAccess || 'No especificado' }}</p>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: Información de Cochera -->
        <div class="mb-4">
          <h4 class="text-md font-bold text-primary mb-3">
            Información de Cochera
          </h4>
          <div class="formgrid grid">
            <div class="field col-12 md:col-3">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-car text-primary"></i>
                La cochera es:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.garageIs || 'No especificado' }}</p>
            </div>
            
            <div class="field col-12 md:col-9">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-compass text-primary"></i>
                Distancia de la cochera:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.garageDistance || 'No especificado' }}</p>
            </div>
          </div>
        </div>
        
        <!-- SECCIÓN: Ubicación -->
        <div class="mb-4">
          <h4 class="text-md font-bold text-primary mb-3">
            Ubicación
          </h4>
          <div class="formgrid grid">
            <div class="field col-12">
              <label class="font-semibold text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-map-marker text-primary"></i>
                Dirección real:
              </label>
              <p class="font-semibold text-dark m-0">{{ item?.realDirection || 'No especificado' }}</p>
            </div>
          </div>
        </div>
      </template>
    </pv-card>

    <!-- Segunda card: Datos referenciales de familiares o arrendadores -->
    <pv-card class="w-full">
      <template #header>
        <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
          <i class="pi pi-users text-white"></i>
          Datos referenciales de familiares o arrendadores
        </h3>
      </template>
      <template #content>
        <div class="formgrid grid">
          <div class="field col-12">
            <div v-if="item?.familiarReferences && item.familiarReferences.length > 0" class="mt-2">
              <div v-for="(reference, index) in item.familiarReferences" :key="index" class="grid mb-3 p-3 bg-gray-50 border-round">
                <div class="col-4 flex align-items-center">
                  <span class="font-semibold text-color-secondary flex align-items-center gap-2">
                    <i class="pi pi-user text-primary"></i>
                    Nombre:
                  </span>
                  <span class="font-semibold text-dark ml-2">{{ reference.name }}</span>
                </div>
                <div class="col-4 flex align-items-center">
                  <span class="font-semibold text-color-secondary flex align-items-center gap-2">
                    <i class="pi pi-phone text-primary"></i>
                    Contacto:
                  </span>
                  <span class="font-semibold text-dark ml-2">{{ reference.contact }}</span>
                </div>
                <div class="col-4 flex align-items-center">
                  <span class="font-semibold text-color-secondary flex align-items-center gap-2">
                    <i class="pi pi-heart text-primary"></i>
                    Parentesco:
                  </span>
                  <span class="font-semibold text-dark ml-2">{{ reference.relationship }}</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center p-4">
              <i class="pi pi-info-circle text-3xl text-gray-400 mb-3"></i>
              <p class="font-semibold text-gray-500 m-0">No hay referencias registradas</p>
            </div>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
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