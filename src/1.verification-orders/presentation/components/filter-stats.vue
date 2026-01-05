<template>
  <Card class="filter-stats-card">
    <template #content>
      <div class="stats-grid">
        <!-- Total -->
        <div class="stat-item">
          <div class="stat-icon total">
            <i class="pi pi-list"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">Total</div>
          </div>
        </div>

        <!-- Pendientes -->
        <div class="stat-item">
          <div class="stat-icon pending">
            <i class="pi pi-clock"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.pending }}</div>
            <div class="stat-label">Pendientes</div>
          </div>
        </div>

        <!-- En Proceso -->
        <div class="stat-item">
          <div class="stat-icon in-progress">
            <i class="pi pi-sync"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.inProgress }}</div>
            <div class="stat-label">En Proceso</div>
          </div>
        </div>

        <!-- Completadas -->
        <div class="stat-item">
          <div class="stat-icon completed">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.completed }}</div>
            <div class="stat-label">Completadas</div>
          </div>
        </div>

        <!-- Con Observaciones -->
        <div class="stat-item">
          <div class="stat-icon observations">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.withObservations }}</div>
            <div class="stat-label">Con Observaciones</div>
          </div>
        </div>

        <!-- Completitud -->
        <div class="stat-item completeness-stat">
          <div class="completeness-content">
            <div class="flex justify-content-between align-items-center mb-2">
              <span class="font-semibold">Completitud Promedio</span>
              <span class="text-primary font-bold text-xl">{{ averageCompleteness }}%</span>
            </div>
            <ProgressBar :value="averageCompleteness" :showValue="false" />
            <div class="flex justify-content-between mt-2 text-sm">
              <span class="text-color-secondary">{{ stats.complete }} completos</span>
              <span class="text-color-secondary">{{ stats.incomplete }} incompletos</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import Card from 'primevue/card';
import ProgressBar from 'primevue/progressbar';

const props = defineProps({
  stats: {
    type: Object,
    required: true
  },
  orders: {
    type: Array,
    default: () => []
  }
});

const averageCompleteness = computed(() => {
  if (!props.orders || props.orders.length === 0) return 0;
  
  const total = props.orders.reduce((sum, order) => {
    return sum + (order.reportCompleteness || 0);
  }, 0);
  
  return Math.round(total / props.orders.length);
});
</script>

<style scoped>
.filter-stats-card {
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.stat-item:hover {
  background: var(--surface-50);
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.stat-icon.total {
  background: var(--blue-50);
  color: var(--blue-500);
}

.stat-icon.pending {
  background: var(--orange-50);
  color: var(--orange-500);
}

.stat-icon.in-progress {
  background: var(--cyan-50);
  color: var(--cyan-500);
}

.stat-icon.completed {
  background: var(--green-50);
  color: var(--green-500);
}

.stat-icon.observations {
  background: var(--yellow-50);
  color: var(--yellow-600);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
  color: var(--text-color);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  margin-top: 0.25rem;
}

.completeness-stat {
  grid-column: span 2;
  padding: 1rem;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--surface-0) 100%);
  border: 1px solid var(--primary-100);
}

.completeness-content {
  width: 100%;
}

@media (max-width: 1200px) {
  .completeness-stat {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .completeness-stat {
    grid-column: span 2;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .completeness-stat {
    grid-column: span 1;
  }
}
</style>
