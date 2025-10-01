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
  <pv-card class="w-full">
    <template #content>
      <h3 class="text-lg font-bold mb-4 text-primary">Detalles de residencia, vivienda y cochera</h3>
      
      <div class="formgrid grid">
        <!-- Primera fila -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">Vive con:</label>
          <p class="font-semibold text-dark m-0">{{ item?.livesWith || 'No especificado' }}</p>
        </div>
        
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">Reside:</label>
          <p class="font-semibold text-dark m-0">{{ item?.resides || 'No especificado' }}</p>
        </div>
        
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">Tiempo de residencia:</label>
          <p class="font-semibold text-dark m-0">{{ item?.residenceTime || 'No especificado' }}</p>
        </div>
        
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">Vivienda es:</label>
          <p class="font-semibold text-dark m-0">{{ item?.housingRented || 'No especificado' }}</p>
        </div>
        
        <!-- Segunda fila -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">Tipo de vivienda:</label>
          <p class="font-semibold text-dark m-0">{{ item?.housingType || 'No especificado' }}</p>
        </div>
        
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">Cant. de pisos:</label>
          <p class="font-semibold text-dark m-0">{{ item?.floorsQuantity || 'No especificado' }}</p>
        </div>
        
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">Piso que habita:</label>
          <p class="font-semibold text-dark m-0">{{ item?.floorLives || 'No especificado' }}</p>
        </div>
        
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">Color de fachada:</label>
          <p class="font-semibold text-dark m-0">{{ item?.facadeColor || 'No especificado' }}</p>
        </div>
        
        <!-- Tercera fila -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">Material:</label>
          <p class="font-semibold text-dark m-0">{{ item?.material || 'No especificado' }}</p>
        </div>
        
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">Estado:</label>
          <p class="font-semibold text-dark m-0">{{ item?.state || 'No especificado' }}</p>
        </div>
        
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">Zona:</label>
          <p class="font-semibold text-dark m-0">{{ item?.zone || 'No especificado' }}</p>
        </div>
        
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">La vivienda está:</label>
          <p class="font-semibold text-dark m-0">{{ item?.housingStatus || 'No especificado' }}</p>
        </div>
        
        <!-- Cuarta fila -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">Techo de vivienda:</label>
          <p class="font-semibold text-dark m-0">{{ item?.roofType || 'No especificado' }}</p>
        </div>
        
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">Característica de la zona:</label>
          <p class="font-semibold text-dark m-0">{{ item?.zoneCharacteristic || 'No especificado' }}</p>
        </div>
        
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">Acceso a la vivienda:</label>
          <p class="font-semibold text-dark m-0">{{ item?.housingAccess || 'No especificado' }}</p>
        </div>
        
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">Riesgo de la zona:</label>
          <p class="font-semibold text-dark m-0">{{ item?.zoneRisk || 'No especificado' }}</p>
        </div>
        
        <!-- Quinta fila -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary">La cochera es:</label>
          <p class="font-semibold text-dark m-0">{{ item?.garageIs || 'No especificado' }}</p>
        </div>
        
        <div class="field col-12 md:col-9">
          <label class="font-semibold text-color-secondary">Distancia de la cochera:</label>
          <p class="font-semibold text-dark m-0">{{ item?.garageDistance || 'No especificado' }}</p>
        </div>
        
        <!-- Sexta fila -->
        <div class="field col-12">
          <label class="font-semibold text-color-secondary">Dirección real:</label>
          <p class="font-semibold text-dark m-0">{{ item?.realDirection || 'No especificado' }}</p>
        </div>
        
        <!-- Referencias familiares -->
        <div class="field col-12">
          <label class="font-semibold text-color-secondary">DATOS REFERENCIALES DE FAMILIARES O ARRENDADORES:</label>
          <div v-if="item?.familiarReferences && item.familiarReferences.length > 0" class="mt-2">
            <div v-for="(reference, index) in item.familiarReferences" :key="index" class="flex align-items-center gap-4 mb-2 p-2 bg-gray-50 border-round">
              <div class="flex-1">
                <span class="font-semibold text-color-secondary">Nombre: </span>
                <span class="font-semibold text-dark">{{ reference.name }}</span>
              </div>
              <div class="flex-1">
                <span class="font-semibold text-color-secondary">Contacto: </span>
                <span class="font-semibold text-dark">{{ reference.contact }}</span>
              </div>
              <div class="flex-1">
                <span class="font-semibold text-color-secondary">Parentesco: </span>
                <span class="font-semibold text-dark">{{ reference.relationship }}</span>
              </div>
            </div>
          </div>
          <p v-else class="font-semibold text-dark m-0">No hay referencias registradas</p>
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