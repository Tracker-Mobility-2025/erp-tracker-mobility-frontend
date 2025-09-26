# Data Manager Genérico - Implementación de Filtros

## Resumen de Cambios

Se ha refactorizado el componente `data-manager.component.vue` para hacerlo completamente genérico, permitiendo que los componentes padre apliquen sus propios filtros personalizados.

## Cambios Principales

### 1. Nuevas Props en Data Manager

```javascript
// Props para filtros personalizados
filteredItems: { type: Array, default: null }, // Items ya filtrados desde el componente padre
globalFilterValue: { type: String, default: '' }, // Valor del filtro global controlado desde el padre
```

### 2. Computed Properties Mejoradas

```javascript
computed: {
  // Usa los items filtrados del padre si están disponibles, si no usa los items originales
  displayItems() {
    return this.filteredItems || this.items;
  },

  // Valor del filtro global: usa el del padre si está disponible, si no el interno
  currentGlobalFilterValue: {
    get() {
      return this.globalFilterValue !== '' ? this.globalFilterValue : this.internalGlobalFilterValue;
    },
    set(value) {
      this.internalGlobalFilterValue = value;
      this.$emit('global-filter-change', value);
    }
  }
}
```

### 3. Nuevos Eventos Emitidos

- `@global-filter-change`: Se emite cuando cambia el valor del filtro global
- `@clear-filters`: Se emite cuando se limpian todos los filtros

## Implementación en Componente Padre

### Ejemplo: verification-reports-management.component.vue

#### 1. Computed Property Combinada

```javascript
computed: {
  // Filtro combinado que aplica todos los filtros activos
  filteredVerificationReports() {
    let filtered = [...this.verificationReports];

    // Filtro por búsqueda global (nombre de solicitante, ID reporte, ID orden)
    if (this.globalFilterValue) {
      const searchTerm = this.globalFilterValue.toLowerCase();
      filtered = filtered.filter(report =>
        report.petitioner.toLowerCase().includes(searchTerm) ||
        report.reportId.toLowerCase().includes(searchTerm) ||
        report.serviceOrderId.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por estado seleccionado
    if (this.selectedStatus) {
      filtered = filtered.filter(report => report.result === this.selectedStatus);
    }

    // Filtro por fecha seleccionada
    if (this.selectedDate) {
      const selectedDateStr = this.selectedDate.toISOString().split('T')[0];
      filtered = filtered.filter(report => report.resultDate === selectedDateStr);
    }

    return filtered;
  }
}
```

#### 2. Métodos de Manejo de Filtros

```javascript
methods: {
  onGlobalFilterChange(value) {
    this.globalFilterValue = value;
  },

  clearAllFilters() {
    this.globalFilterValue = '';
    this.selectedStatus = null;
    this.selectedDate = null;
  }
}
```

#### 3. Uso del Data Manager

```vue
<data-manager
    :items="verificationReports"
    :filtered-items="filteredVerificationReports"
    :global-filter-value="globalFilterValue"
    :columns="columns"
    :title="title"
    :loading="loading"
    :dynamic="true"
    @global-filter-change="onGlobalFilterChange"
    @clear-filters="clearAllFilters"
    @new-item-requested-manager="onNewItemRequested"
    @delete-selected-items-requested-manager="onDeleteSelectedItems"
    @view-item-requested-manager="onViewItem"
>
  <!-- Filtros personalizados en slot -->
  <template #filters="{ clearFilters }">
    <div class="flex align-items-center gap-2">
      <pv-dropdown
          v-model="selectedStatus"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          placeholder="Estado: Todos"
          class="w-10rem"
      />
      <pv-calendar
          v-model="selectedDate"
          placeholder="dd/mm/aaaa"
          dateFormat="dd/mm/yy"
          showIcon
      />
    </div>
  </template>
</data-manager>
```

## Ventajas de la Nueva Implementación

### 1. **Flexibilidad Total**
- Cada componente padre puede implementar sus propios filtros específicos
- Los filtros se aplican en tiempo real sin afectar el rendimiento
- Soporte para filtros complejos y combinados

### 2. **Reutilización Mejorada**
- El data-manager es completamente genérico
- Puede ser usado en cualquier contexto sin modificaciones
- Mantiene compatibilidad con implementaciones existentes

### 3. **Separación de Responsabilidades**
- Data-manager: UI y funcionalidad de tabla
- Componente padre: Lógica de negocio y filtros específicos

### 4. **Rendimiento Optimizado**
- Los filtros se calculan solo cuando es necesario
- No hay duplicación de lógica de filtrado
- Computed properties reactivas eficientes

## Patrones de Uso Recomendados

### Para Filtros Simples
```javascript
// Un solo filtro de búsqueda
computed: {
  filteredItems() {
    if (!this.globalFilterValue) return this.items;
    return this.items.filter(item => 
      item.name.toLowerCase().includes(this.globalFilterValue.toLowerCase())
    );
  }
}
```

### Para Filtros Múltiples
```javascript
// Múltiples filtros aplicados secuencialmente
computed: {
  filteredItems() {
    let filtered = [...this.items];
    
    if (this.globalFilterValue) {
      const search = this.globalFilterValue.toLowerCase();
      filtered = filtered.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(search)
        )
      );
    }
    
    if (this.statusFilter) {
      filtered = filtered.filter(item => item.status === this.statusFilter);
    }
    
    if (this.dateFilter) {
      filtered = filtered.filter(item => item.date === this.dateFilter);
    }
    
    return filtered;
  }
}
```

## Ejemplos de Implementación Completados

### 1. Módulo de Verificadores
```javascript
// verifiers.management.component.vue
computed: {
  filteredVerifiers() {
    let filtered = [...this.verifiers];

    // Filtro por búsqueda global (nombre, apellido, email, teléfono)
    if (this.globalFilterValue) {
      const searchTerm = this.globalFilterValue.toLowerCase();
      filtered = filtered.filter(verifier =>
        verifier.name.toLowerCase().includes(searchTerm) ||
        verifier.lastname.toLowerCase().includes(searchTerm) ||
        verifier.email.toLowerCase().includes(searchTerm) ||
        verifier.phone.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por estado seleccionado
    if (this.selectedStatus) {
      filtered = filtered.filter(verifier => verifier.status === this.selectedStatus);
    }

    return filtered;
  }
}
```

### 2. Módulo de Órdenes de Servicio
```javascript
// service-order-management.component.vue
computed: {
  filteredOrders() {
    let filtered = [...this.orders];

    // Filtro por búsqueda global (ID, solicitante, verificador)
    if (this.globalFilterValue) {
      const searchTerm = this.globalFilterValue.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm) ||
        order.solicitante.toLowerCase().includes(searchTerm) ||
        order.verificador.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por estado seleccionado
    if (this.selectedStatus) {
      filtered = filtered.filter(order => order.estado === this.selectedStatus);
    }

    return filtered;
  }
}
```

### 3. Módulo de Reportes de Verificación
```javascript
// verification-reports-management.component.vue
computed: {
  filteredVerificationReports() {
    let filtered = [...this.verificationReports];

    // Filtro por búsqueda global (solicitante, ID reporte, ID orden)
    if (this.globalFilterValue) {
      const searchTerm = this.globalFilterValue.toLowerCase();
      filtered = filtered.filter(report =>
        report.petitioner.toLowerCase().includes(searchTerm) ||
        report.reportId.toLowerCase().includes(searchTerm) ||
        report.serviceOrderId.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por estado seleccionado
    if (this.selectedStatus) {
      filtered = filtered.filter(report => report.result === this.selectedStatus);
    }

    // Filtro por fecha seleccionada
    if (this.selectedDate) {
      const selectedDateStr = this.selectedDate.toISOString().split('T')[0];
      filtered = filtered.filter(report => report.resultDate === selectedDateStr);
    }

    return filtered;
  }
}
```

## Migración de Componentes Existentes

1. **Identificar filtros existentes** en computed properties
2. **Combinar filtros** en una sola computed property
3. **Añadir props necesarias** al data-manager
4. **Implementar manejadores** de eventos de filtros
5. **Actualizar template** con nuevas props y eventos

## Beneficios Comprobados

✅ **Reutilización Total**: El mismo data-manager funciona para verificadores, órdenes y reportes
✅ **Filtros Específicos**: Cada módulo implementa su lógica de filtrado particular
✅ **Rendimiento Optimizado**: Computed properties reactivas en cada componente
✅ **Mantenibilidad**: Separación clara de responsabilidades
✅ **Consistencia UI**: Misma interfaz de usuario en todos los módulos

Esta implementación hace que el data-manager sea verdaderamente genérico y reutilizable, mientras mantiene toda la funcionalidad específica en los componentes que la necesitan.