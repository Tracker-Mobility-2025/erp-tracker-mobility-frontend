# Data Manager Component

El componente `data-manager` es un componente reutilizable que proporciona funcionalidad completa de gestión de datos con tabla, filtros, paginación y botones de acción configurables. Está diseñado para ser altamente flexible y personalizable, permitiendo diferentes configuraciones según las necesidades específicas de cada vista.

## ⚡ Implementación Rápida (Ejemplo Básico)

```vue
<template>
  <!-- CRUD COMPLETO en 3 líneas -->
  <data-manager
    :items="clients"
    :columns="clientColumns"
    :title="{ singular: 'Cliente', plural: 'Clientes' }"
    :dynamic="true"
    
    <!-- ✅ Habilitar botones de editar y eliminar individual -->
    :show-edit-action="true"
    :show-delete-action="true"
    
    @new-item-requested-manager="createClient"
    @edit-item-requested-manager="editClient"
    @delete-item-requested-manager="deleteClient"
    @view-item-requested-manager="viewClient"
  />
</template>

<script>
export default {
  data() {
    return {
      clients: [
        { id: 1, name: 'Juan Pérez', email: 'juan@email.com', status: 'active' },
        { id: 2, name: 'María García', email: 'maria@email.com', status: 'inactive' }
      ],
      clientColumns: [
        { field: 'id', header: 'ID' },
        { field: 'name', header: 'Nombre' },
        { field: 'email', header: 'Email' },
        { field: 'status', header: 'Estado' }
      ]
    };
  },
  methods: {
    createClient() { /* Lógica crear */ },
    editClient(client) { /* Lógica editar */ },
    deleteClient(client) { /* Lógica eliminar */ },
    viewClient(client) { /* Lógica ver */ }
  }
};
</script>
```

## Características Principales

- **Tabla de datos responsive** con PrimeVue DataTable
- **Sistema de filtros** global y personalizable
- **Paginación** configurable
- **Selección múltiple** con checkboxes
- **Botones de acción** configurables (Agregar, Eliminar, Exportar)
- **✅ Columna de acciones NATIVA** con Ver/Editar/Eliminar individual
- **Estados de carga y vacío**
- **Exportación a CSV**
- **Slots personalizables** para filtros y columnas

## Props Principales

### Props Obligatorios

| Prop | Tipo | Descripción |
|------|------|-------------|
| `items` | Array | **Requerido**. Array de objetos que representan los datos a mostrar |
| `title` | Object | **Requerido**. Objeto con `singular` y `plural` para títulos (ej: `{ singular: 'Cliente', plural: 'Clientes' }`) |

### Props de Datos y Configuración

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `dynamic` | Boolean | `false` | Si es `true`, genera columnas automáticamente basadas en el prop `columns` |
| `columns` | Array | `[]` | Configuración de columnas para modo dinámico |
| `loading` | Boolean | `false` | Muestra estado de carga |
| `searchPlaceholder` | String | `'Busca por ID reporte, ID orden, verificador...'` | Texto del placeholder para el campo de búsqueda |

### Props de Filtros

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `filteredItems` | Array | `null` | Items ya filtrados desde el componente padre (anula filtros internos) |
| `globalFilterValue` | String | `''` | Valor del filtro global controlado desde el padre |

## Props de Configuración de Botones

### Botones de Acción Principales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `showActionButtons` | Boolean | `true` | Muestra/oculta toda la sección de botones de acción |
| `showNew` | Boolean | `true` | Muestra/oculta el botón "Agregar" |
| `showDelete` | Boolean | `true` | Muestra/oculta el botón "Eliminar" |
| `showExport` | Boolean | `true` | Muestra/oculta el botón "Exportar" |

### Configuración de Acciones Individuales (Nueva Funcionalidad)

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `showEditAction` | Boolean | `false` | **NUEVO**: Muestra/oculta el botón "Editar" en la columna de acciones |
| `showDeleteAction` | Boolean | `false` | **NUEVO**: Muestra/oculta el botón "Eliminar" en la columna de acciones |
| `editButtonLabel` | String | `'Editar'` | **NUEVO**: Texto personalizable para el botón de editar individual |
| `deleteActionLabel` | String | `'Eliminar'` | **NUEVO**: Texto personalizable para el botón de eliminar individual |

### Labels Personalizables

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `newButtonLabel` | String | `'Agregar'` | Texto personalizable para el botón de agregar |
| `deleteButtonLabel` | String | `'Eliminar'` | Texto personalizable para el botón de eliminar múltiple |
| `exportButtonLabel` | String | `'Exportar'` | Texto personalizable para el botón de exportar |

### Configuración de Tabla

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `showActions` | Boolean | `true` | Muestra/oculta la columna de acciones en la tabla |
| `showSelection` | Boolean | `true` | Muestra/oculta los checkboxes de selección |

## Ejemplos de Uso

### 1. Vista Solo de Lectura (Sin botones de acción)
```vue
<data-manager
  :items="items"
  :columns="columns"
  :title="title"
  :show-action-buttons="false"
  :show-selection="false"
/>
```

### 2. Vista Solo con Exportar
```vue
<data-manager
  :items="items"
  :columns="columns"
  :title="title"
  :show-new="false"
  :show-delete="false"
  :show-export="true"
/>
```

### 3. Vista Solo con Agregar (Sin eliminar)
```vue
<data-manager
  :items="items"
  :columns="columns"
  :title="title"
  :show-new="true"
  :show-delete="false"
  :show-export="true"
/>
```

### 4. Vista de Administrador Completa
```vue
<data-manager
  :items="items"
  :columns="columns"
  :title="title"
  :show-new="true"
  :show-delete="true"
  :show-export="true"
  :show-selection="true"
  :show-actions="true"
/>
```

### 5. Vista con Labels Personalizados
```vue
<data-manager
  :items="items"
  :columns="columns"
  :title="title"
  new-button-label="Crear Nuevo"
  delete-button-label="Remover Seleccionados"
  export-button-label="Descargar CSV"
/>
```

### Props de Configuración de Tabla

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `tableHeight` | String | `'400px'` | Altura de la tabla |
| `rows` | Number | `10` | Número de filas por página |
| `rowsPerPageOptions` | Array | `[5, 10, 15, 20]` | Opciones de filas por página |

## Configuración de Columnas (Modo Dinámico)

Cuando `dynamic` es `true`, el componente genera columnas automáticamente basadas en el prop `columns`. Cada objeto en el array debe tener:

```javascript
{
  field: 'nombre_campo',           // Campo del objeto de datos
  header: 'Título de Columna',     // Título a mostrar
  sortable: true,                  // Si la columna es ordenable (default: true)
  style: 'min-width: 150px;',      // Estilos CSS de la columna
  headerStyle: 'text-align: left;', // Estilos CSS del header
  bodyStyle: 'text-align: left;',   // Estilos CSS del contenido
  template: 'nombre-slot'          // Nombre del slot para contenido personalizado
}
```

### Ejemplo de Configuración de Columnas

```javascript
const columns = [
  {
    field: 'id',
    header: 'ID',
    style: 'width: 80px;',
    headerStyle: 'text-align: center;',
    bodyStyle: 'text-align: center;'
  },
  {
    field: 'name',
    header: 'Nombre',
    sortable: true
  },
  {
    field: 'status',
    header: 'Estado',
    template: 'status-badge',  // Usará el slot 'status-badge'
    style: 'width: 120px;'
  }
];
```

## Slots Disponibles

### Slot `filters`
Permite agregar filtros personalizados junto al campo de búsqueda global.

```vue
<data-manager :items="items" :columns="columns" :title="title">
  <template #filters="{ clearFilters }">
    <pv-dropdown
      v-model="selectedStatus"
      :options="statusOptions"
      placeholder="Estado"
      @change="filterByStatus"
    />
    <pv-button @click="clearFilters" label="Limpiar" />
  </template>
</data-manager>
```

### Slot `custom-columns-manager`
Permite agregar columnas completamente personalizadas antes de las columnas dinámicas.

```vue
<data-manager :items="items" :dynamic="true" :columns="columns" :title="title">
  <template #custom-columns-manager>
    <pv-column field="priority" header="Prioridad">
      <template #body="slotProps">
        <pv-badge :value="slotProps.data.priority" :severity="getPrioritySeverity(slotProps.data.priority)" />
      </template>
    </pv-column>
  </template>
</data-manager>
```

### Slots de Columnas Dinámicas
Cuando usas `template` en la configuración de columnas, puedes crear un slot con ese nombre:

```vue
<data-manager :items="items" :dynamic="true" :columns="columns" :title="title">
  <template #status-badge="{ data, value }">
    <pv-badge :value="value" :severity="getStatusSeverity(data)" />
  </template>
</data-manager>
```

## Eventos

| Evento | Descripción | Parámetros |
|--------|-------------|------------|
| `new-item-requested-manager` | Se emite cuando se hace clic en "Agregar" | - |
| `delete-selected-items-requested-manager` | Se emite cuando se hace clic en "Eliminar" (múltiple) | `selectedItems: Array` |
| `view-item-requested-manager` | Se emite cuando se hace clic en "Ver detalles" en la columna de acciones | `item: Object` |
| `edit-item-requested-manager` | **NUEVO**: Se emite cuando se hace clic en "Editar" en la columna de acciones | `item: Object` |
| `delete-item-requested-manager` | **NUEVO**: Se emite cuando se hace clic en "Eliminar" individual en la columna de acciones | `item: Object` |
| `global-filter-change` | Se emite cuando cambia el filtro global | `filterValue: String` |
| `clear-filters` | Se emite cuando se limpian los filtros | - |
| `row-select` | Se emite cuando se selecciona una fila | `event: Object` |
| `row-unselect` | Se emite cuando se deselecciona una fila | `event: Object` |

## Personalización de la Columna de Acciones

### Botones Nativos Disponibles ✅

**¡ACTUALIZACIÓN!**: El componente **YA INCLUYE** botones de **Editar** y **Eliminar individual** nativamente. Solo necesitas habilitar los props correspondientes:

```vue
<data-manager
  :items="items"
  :columns="columns"
  :title="title"
  :show-edit-action="true"     <!-- ✅ Habilita botón Editar -->
  :show-delete-action="true"   <!-- ✅ Habilita botón Eliminar individual -->
  edit-button-label="Modificar" <!-- Personalizar label (opcional) -->
  delete-action-label="Borrar" <!-- Personalizar label (opcional) -->
  @edit-item-requested-manager="onEditItem"
  @delete-item-requested-manager="onDeleteItem"
/>
```

### Configuración Nativa (Recomendada) ⭐

**¡Ya está implementado!** Solo habilita los props:

```vue
<template>
  <data-manager
    :items="clients"
    :columns="clientColumns"
    :title="{ singular: 'Cliente', plural: 'Clientes' }"
    :dynamic="true"
    
    <!-- ✅ Habilitar acciones individuales -->
    :show-edit-action="true"
    :show-delete-action="true"
    
    <!-- 📝 Labels personalizados (opcional) -->
    edit-button-label="Modificar"
    delete-action-label="Borrar"
    
    <!-- 🎯 Eventos -->
    @view-item-requested-manager="viewClient"
    @edit-item-requested-manager="editClient"
    @delete-item-requested-manager="confirmDeleteClient"
    @new-item-requested-manager="createNewClient"
    @delete-selected-items-requested-manager="deleteSelectedClients"
  />
</template>

<script>
export default {
  methods: {
    viewClient(client) {
      this.$router.push(`/clients/${client.id}`);
    },
    
    editClient(client) {
      // Abrir modal de edición o navegar a página de edición
      this.selectedClient = { ...client };
      this.showEditDialog = true;
    },
    
    confirmDeleteClient(client) {
      this.$confirm.require({
        message: `¿Está seguro de que desea eliminar el cliente "${client.name}"?`,
        header: 'Confirmación de Eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: () => this.deleteClient(client.id)
      });
    },
    
    async deleteClient(clientId) {
      try {
        await this.clientService.deleteClient(clientId);
        this.clients = this.clients.filter(c => c.id !== clientId);
        this.$toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Cliente eliminado correctamente'
        });
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el cliente'
        });
      }
    }
  }
};
</script>
```

### Personalización Avanzada con Slots (Opcional)

Si necesitas botones adicionales o layouts diferentes, puedes usar slots:

```vue
<data-manager 
  :items="items" 
  :columns="columns" 
  :title="title"
  :show-actions="false"
>
  <template #custom-columns-manager>
    <pv-column 
      header="Acciones" 
      :exportable="false"
      header-style="width: 15rem; text-align: center"
      body-style="text-align: center"
    >
      <template #body="slotProps">
        <div class="flex gap-1 justify-content-center">
          <pv-button 
            icon="pi pi-eye"
            severity="info"
            text 
            size="small"
            v-tooltip="'Ver detalles'"
            @click="viewItem(slotProps.data)"
          />
          <pv-button 
            icon="pi pi-pencil"
            severity="warning"
            text 
            size="small"
            v-tooltip="'Editar'"
            @click="editItem(slotProps.data)"
          />
          <pv-button 
            icon="pi pi-trash"
            severity="danger"
            text 
            size="small"
            v-tooltip="'Eliminar'"
            @click="deleteItem(slotProps.data)"
          />
        </div>
      </template>
    </pv-column>
  </template>
</data-manager>
```

### Ejemplo de Implementación Completa con Funcionalidad Nativa

```vue
<template>
  <data-manager 
    :items="clients" 
    :columns="clientColumns" 
    :title="{ singular: 'Cliente', plural: 'Clientes' }"
    :dynamic="true"
    
    <!-- ✅ Habilitar todas las acciones -->
    :show-edit-action="true"
    :show-delete-action="true"
    
    <!-- 🎯 Eventos -->
    @new-item-requested-manager="openCreateDialog"
    @delete-selected-items-requested-manager="deleteSelectedClients"
    @view-item-requested-manager="viewClient"
    @edit-item-requested-manager="editClient"
    @delete-item-requested-manager="confirmDeleteClient"
  >
    <!-- Filtros personalizados -->
    <template #filters="{ clearFilters }">
      <pv-dropdown
        v-model="selectedStatus"
        :options="statusOptions"
        placeholder="Estado"
        @change="filterByStatus"
        class="w-full md:w-auto"
      />
      <pv-button 
        @click="clearAllFilters(clearFilters)" 
        label="Limpiar" 
        severity="secondary"
        outlined
        size="small"
      />
    </template>

    <!-- Badge para estado -->
    <template #status="{ data, value }">
      <pv-badge 
        :value="value" 
        :severity="getStatusSeverity(value)" 
      />
    </template>
  </data-manager>
</template>

<script>
export default {
  data() {
    return {
      clients: [],
      selectedStatus: null,
      statusOptions: [
        { label: 'Activo', value: 'active' },
        { label: 'Inactivo', value: 'inactive' }
      ],
      clientColumns: [
        { field: 'id', header: 'ID', style: 'width: 80px;' },
        { field: 'name', header: 'Nombre' },
        { field: 'email', header: 'Email' },
        { field: 'status', header: 'Estado', template: 'status' }
      ]
    };
  },
  methods: {
    viewClient(client) {
      // Lógica para ver detalles
      this.$router.push(`/clients/${client.id}`);
    },
    
    editClient(client) {
      // Lógica para editar
      this.selectedClient = { ...client };
      this.showEditDialog = true;
    },
    
    confirmDeleteClient(client) {
      this.$confirm.require({
        message: `¿Está seguro de que desea eliminar el cliente "${client.name}"?`,
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => this.deleteClient(client.id)
      });
    },
    
    deleteClient(clientId) {
      // Lógica para eliminar
      this.clients = this.clients.filter(c => c.id !== clientId);
      this.$toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Cliente eliminado correctamente'
      });
    },
    
    getStatusSeverity(status) {
      return status === 'active' ? 'success' : 'danger';
    }
  }
};
</script>
```

## Casos de Uso Comunes

### 1. Diferentes Roles de Usuario ✅ CON NUEVA FUNCIONALIDAD

```vue
<!-- Administrador: TODOS los permisos (CRUD completo) -->
<data-manager
  v-if="userRole === 'admin'"
  :items="items"
  :columns="columns"
  :title="title"
  :dynamic="true"
  
  <!-- Botones principales -->
  :show-new="true"
  :show-delete="true" 
  :show-export="true"
  
  <!-- ✅ NUEVO: Acciones individuales habilitadas -->
  :show-edit-action="true"
  :show-delete-action="true"
  
  <!-- Eventos -->
  @new-item-requested-manager="createNew"
  @delete-selected-items-requested-manager="deleteMultiple"
  @view-item-requested-manager="viewItem"
  @edit-item-requested-manager="editItem"          <!-- ✅ NUEVO -->
  @delete-item-requested-manager="deleteIndividual" <!-- ✅ NUEVO -->
/>

<!-- Editor: Crear, ver y editar (sin eliminar) -->
<data-manager
  v-else-if="userRole === 'editor'"
  :items="items"
  :columns="columns"
  :title="title"
  :dynamic="true"
  
  <!-- Botones principales -->
  :show-new="true"
  :show-delete="false"    <!-- Sin eliminación múltiple -->
  :show-export="true"
  
  <!-- ✅ NUEVO: Solo editar, no eliminar individual -->
  :show-edit-action="true"
  :show-delete-action="false"
  
  <!-- Eventos -->
  @new-item-requested-manager="createNew"
  @view-item-requested-manager="viewItem"
  @edit-item-requested-manager="editItem"  <!-- ✅ NUEVO -->
/>

<!-- Viewer: Solo lectura (sin acciones) -->
<data-manager
  v-else
  :items="items"
  :columns="columns"
  :title="title"
  :dynamic="true"
  
  <!-- Sin botones principales -->
  :show-action-buttons="false"
  :show-selection="false"
  
  <!-- ✅ NUEVO: Solo ver detalles -->
  :show-edit-action="false"
  :show-delete-action="false"
  
  <!-- Solo evento de visualización -->
  @view-item-requested-manager="viewItem"
/>
```

### 2. Por Tipo de Vista

```vue
<!-- Vista de reportes (solo exportar) -->
<data-manager
  :items="reports"
  :columns="reportColumns"
  :title="{ singular: 'Reporte', plural: 'Reportes' }"
  :dynamic="true"
  :show-new="false"
  :show-delete="false"
  :show-export="true"
  search-placeholder="Buscar por ID, tipo de reporte, fecha..."
/>

<!-- Vista de gestión de clientes (CRUD completo) -->
<data-manager
  :items="clients"
  :columns="clientColumns"
  :title="{ singular: 'Cliente', plural: 'Clientes' }"
  :dynamic="true"
  :show-new="true"
  :show-delete="true"
  :show-export="true"
  :show-actions="false"
  new-button-label="Agregar Cliente"
  delete-button-label="Eliminar Seleccionados"
>
  <template #custom-columns-manager>
    <!-- Acciones: Ver, Editar, Eliminar -->
  </template>
</data-manager>

<!-- Vista de auditoría (solo lectura) -->
<data-manager
  :items="auditLogs"
  :columns="auditColumns"
  :title="{ singular: 'Log', plural: 'Logs de Auditoría' }"
  :dynamic="true"
  :show-action-buttons="false"
  :show-selection="false"
  :show-actions="false"
  search-placeholder="Buscar por usuario, acción, fecha..."
/>
```

### 3. Configuración Avanzada con Filtros Personalizados

```vue
<template>
  <data-manager
    :items="filteredOrders"
    :columns="orderColumns"
    :title="{ singular: 'Orden', plural: 'Órdenes de Servicio' }"
    :dynamic="true"
    :loading="loading"
    :global-filter-value="globalFilter"
    @global-filter-change="onGlobalFilterChange"
    @clear-filters="onClearFilters"
  >
    <!-- Filtros avanzados -->
    <template #filters="{ clearFilters }">
      <pv-dropdown
        v-model="statusFilter"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        placeholder="Estado"
        @change="applyFilters"
        class="w-full md:w-auto"
      />
      
      <pv-calendar
        v-model="dateRange"
        selection-mode="range"
        placeholder="Rango de fechas"
        @date-select="applyFilters"
        class="w-full md:w-auto"
      />
      
      <pv-dropdown
        v-model="priorityFilter"
        :options="priorityOptions"
        option-label="label"
        option-value="value"
        placeholder="Prioridad"
        @change="applyFilters"
        class="w-full md:w-auto"
      />
      
      <pv-button 
        @click="resetAllFilters(clearFilters)"
        icon="pi pi-filter-slash"
        label="Limpiar Filtros"
        severity="secondary"
        outlined
        size="small"
      />
    </template>

    <!-- Columnas personalizadas con badges y estados -->
    <template #status="{ data, value }">
      <pv-badge 
        :value="getStatusLabel(value)" 
        :severity="getStatusSeverity(value)"
      />
    </template>

    <template #priority="{ data, value }">
      <pv-chip 
        :label="getPriorityLabel(value)" 
        :class="getPriorityClass(value)"
      />
    </template>
  </data-manager>
</template>
```

## Patrones de Implementación Recomendados

### 1. Estructura del Componente Padre

```javascript
export default {
  name: 'OrderManagement',
  data() {
    return {
      // Datos principales
      orders: [],
      loading: false,
      
      // Configuración de tabla
      orderColumns: [
        { field: 'id', header: 'ID', style: 'width: 100px;' },
        { field: 'customerName', header: 'Cliente' },
        { field: 'serviceType', header: 'Tipo de Servicio' },
        { field: 'status', header: 'Estado', template: 'status' },
        { field: 'priority', header: 'Prioridad', template: 'priority' },
        { field: 'createdAt', header: 'Fecha Creación' }
      ],
      
      // Filtros
      globalFilter: '',
      statusFilter: null,
      priorityFilter: null,
      dateRange: null,
      
      // Opciones de filtros
      statusOptions: [
        { label: 'Pendiente', value: 'pending' },
        { label: 'En Proceso', value: 'in-progress' },
        { label: 'Completado', value: 'completed' }
      ],
      
      priorityOptions: [
        { label: 'Baja', value: 'low' },
        { label: 'Media', value: 'medium' },
        { label: 'Alta', value: 'high' },
        { label: 'Crítica', value: 'critical' }
      ]
    };
  },
  
  computed: {
    filteredOrders() {
      let filtered = [...this.orders];
      
      // Aplicar filtros específicos
      if (this.statusFilter) {
        filtered = filtered.filter(order => order.status === this.statusFilter);
      }
      
      if (this.priorityFilter) {
        filtered = filtered.filter(order => order.priority === this.priorityFilter);
      }
      
      if (this.dateRange && this.dateRange.length === 2) {
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= this.dateRange[0] && orderDate <= this.dateRange[1];
        });
      }
      
      return filtered;
    }
  },
  
  methods: {
    // Eventos del data-manager
    onNewOrder() {
      this.$router.push('/orders/new');
    },
    
    onDeleteSelectedOrders(selectedOrders) {
      // Lógica de eliminación múltiple
      this.deleteMultipleOrders(selectedOrders.map(order => order.id));
    },
    
    onViewOrder(order) {
      this.$router.push(`/orders/${order.id}`);
    },
    
    // Filtros
    onGlobalFilterChange(value) {
      this.globalFilter = value;
    },
    
    onClearFilters() {
      this.resetAllFilters();
    },
    
    applyFilters() {
      // Los computed se encargan de la lógica de filtrado
    },
    
    resetAllFilters(dataManagerClearFn) {
      this.statusFilter = null;
      this.priorityFilter = null;
      this.dateRange = null;
      this.globalFilter = '';
      
      // Limpiar también los filtros internos del data-manager
      if (dataManagerClearFn) {
        dataManagerClearFn();
      }
    },
    
    // Helpers para templates
    getStatusSeverity(status) {
      const severities = {
        'pending': 'warning',
        'in-progress': 'info',
        'completed': 'success',
        'cancelled': 'danger'
      };
      return severities[status] || 'secondary';
    },
    
    getStatusLabel(status) {
      const labels = {
        'pending': 'Pendiente',
        'in-progress': 'En Proceso',
        'completed': 'Completado',
        'cancelled': 'Cancelado'
      };
      return labels[status] || status;
    }
  }
};
```

### 2. Mejores Prácticas

#### Gestión de Estado
- Usa `computed` properties para filtros complejos
- Mantén el estado de filtros en el componente padre
- Utiliza `filteredItems` prop cuando necesites control total sobre el filtrado

#### Performance
- Implementa paginación del lado del servidor para conjuntos grandes de datos
- Usa `loading` prop durante operaciones asíncronas
- Considera usar `v-memo` en templates complejos

#### UX/UI
- Proporciona mensajes claros en estados vacíos
- Usa confirmaciones para operaciones destructivas
- Implementa tooltips para botones de acción
- Mantén consistencia en los labels y severities

#### Accesibilidad
- Usa `aria-label` en botones de acción
- Proporciona texto alternativo para badges y chips
- Asegúrate de que los contrastes cumplan estándares WCAG

## Troubleshooting

### Problemas Comunes

1. **Las columnas no se muestran en modo dinámico**
   - Verifica que `dynamic="true"`
   - Asegúrate de que el array `columns` esté correctamente formateado

2. **Los filtros no funcionan**
   - Revisa que `global-filter-fields` incluya los campos correctos
   - Verifica que los datos tengan las propiedades esperadas

3. **La selección múltiple no funciona**
   - Asegúrate de que cada item tenga un `id` único
   - Verifica que `show-selection="true"`

4. **Los slots no se renderizan**
   - Confirma que el nombre del slot coincida exactamente
   - Verifica que el template esté dentro del componente data-manager

### Limitaciones Actuales

- ✅ ~~La columna de acciones por defecto solo incluye "Ver detalles"~~ **RESUELTO**
- ✅ ~~Para botones de editar/eliminar individuales, requiere personalización~~ **RESUELTO**  
- El filtrado avanzado debe implementarse en el componente padre
- La exportación está limitada a CSV

### Roadmap de Mejoras

1. ✅ ~~**Props adicionales para botones de acción individuales**~~ **COMPLETADO**
2. **Soporte nativo para filtros de columna**
3. **Múltiples formatos de exportación** 
4. **Modo de edición inline**
5. **Integración con APIs REST automática**
6. **Slot personalizable para columna de acciones**
7. **Confirmación automática para eliminaciones**