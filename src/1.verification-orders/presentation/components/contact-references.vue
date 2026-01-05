<template>
  <Card class="references-card">
    <template #title>
      <div class="flex align-items-center gap-2">
        <i class="pi pi-users text-2xl"></i>
        <span>Referencias de Contacto</span>
        <Badge v-if="references && references.length > 0" :value="references.length" severity="info" />
      </div>
    </template>

    <template #content>
      <div v-if="references && references.length > 0" class="references-content">
        <div class="grid">
          <div v-for="reference in references" :key="reference.id" class="col-12 md:col-6">
            <div class="reference-card">
              <div class="reference-header">
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-user text-xl text-primary"></i>
                  <span class="reference-name">{{ reference.fullName }}</span>
                </div>
                <div class="reference-badges">
                  <Tag v-if="reference.isPrimary" value="Principal" severity="success" size="small" />
                  <Tag v-if="reference.isVerified" value="Verificada" severity="info" size="small" />
                </div>
              </div>

              <Divider class="my-2" />

              <div class="reference-details">
                <div class="detail-item">
                  <i class="pi pi-heart detail-icon"></i>
                  <div class="detail-content">
                    <span class="detail-label">Relación</span>
                    <span class="detail-value">{{ reference.relationship || 'No especificado' }}</span>
                  </div>
                </div>

                <div class="detail-item" v-if="reference.phoneNumber">
                  <i class="pi pi-phone detail-icon"></i>
                  <div class="detail-content">
                    <span class="detail-label">Teléfono</span>
                    <span class="detail-value">{{ reference.phoneNumber }}</span>
                  </div>
                </div>

                <div class="detail-item" v-if="reference.address">
                  <i class="pi pi-map-marker detail-icon"></i>
                  <div class="detail-content">
                    <span class="detail-label">Dirección</span>
                    <span class="detail-value">{{ reference.address }}</span>
                  </div>
                </div>
              </div>

              <div class="reference-actions mt-3">
                <Button 
                  icon="pi pi-phone" 
                  label="Llamar"
                  severity="success"
                  outlined
                  size="small"
                  :disabled="!reference.hasValidPhone"
                  @click="callReference(reference)"
                  class="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-data-message">
        <i class="pi pi-users text-4xl mb-3"></i>
        <span>No hay referencias de contacto registradas</span>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Divider from 'primevue/divider';

const props = defineProps({
  references: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['call-reference']);

const callReference = (reference) => {
  if (reference.hasValidPhone) {
    emit('call-reference', reference);
  }
};
</script>

<style scoped>
.references-card {
  margin-bottom: 1.5rem;
}

.references-content {
  padding: 0.5rem 0;
}

.reference-card {
  padding: 1.25rem;
  background: var(--surface-50);
  border: 1px solid var(--surface-200);
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.reference-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
}

.reference-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.reference-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.reference-details {
  flex: 1;
}

.detail-item {
  display: flex;
  align-items: start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.detail-icon {
  color: var(--primary-500);
  margin-top: 0.25rem;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.detail-label {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 0.95rem;
  color: var(--text-color);
}

.no-data-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-color-secondary);
}
</style>
