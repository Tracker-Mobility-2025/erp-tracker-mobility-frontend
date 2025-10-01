<script>
export default {
  name: 'customer-data-card',

  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({
        fullName: 'Alfonso Eloy Sanchez Vela',
        interviewee: 'Alfonso Eloy Sanchez Vela',
        relationship: 'Titular',
        documentType: 'CE',
        documentNumber: '007943592'
      })
    },
  },

  computed: {
    relationshipClass() {
      const relationship = this.item?.relationship?.toLowerCase();
      return {
        'text-blue-700 bg-blue-100': relationship === 'titular',
        'text-green-700 bg-green-100': relationship === 'cónyuge' || relationship === 'esposo' || relationship === 'esposa',
        'text-purple-700 bg-purple-100': relationship === 'hijo' || relationship === 'hija',
        'text-orange-700 bg-orange-100': relationship === 'otro'
      };
    }
  }

};

</script>

<template>
  <pv-card class="w-full">
    <template #content>
      <h3 class="text-lg font-bold mb-4 text-primary">Datos del cliente</h3>
      
      <div class="formgrid grid">
        <!-- Nombre completo -->
        <div class="field col-12 md:col-6">
          <label class="font-semibold text-color-secondary">Nombre completo</label>
          <p class="font-semibold text-dark m-0">
            {{ item?.fullName || 'No especificado' }}
          </p>
        </div>
        
        <!-- Entrevistado -->
        <div class="field col-12 md:col-6">
          <label class="font-semibold text-color-secondary">Entrevistado</label>
          <p class="font-semibold text-dark m-0">
            {{ item?.interviewee || 'No especificado' }}
          </p>
        </div>
        
        <!-- Parentesco -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary">Parentesco</label>
          <p class="font-semibold text-dark m-0">
            <span 
              :class="[relationshipClass, 'px-2 py-1 border-round text-sm font-semibold']"
            >
              {{ item?.relationship || 'No especificado' }}
            </span>
          </p>
        </div>
        
        <!-- Tipo de documento -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary">Tipo de documento</label>
          <p class="font-semibold text-dark m-0">
            {{ item?.documentType || 'No especificado' }}
          </p>
        </div>
        
        <!-- Número -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary">Número</label>
          <p class="font-semibold text-dark m-0">
            {{ item?.documentNumber || 'No especificado' }}
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