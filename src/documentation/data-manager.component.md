# Data Manager Component

El componente `data-manager` es un componente reutilizable que proporciona funcionalidad completa de gestión de datos con tabla, filtros, paginación y botones de acción configurables.

## Props de Configuración de Botones

### Botones de Acción Principales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `showActionButtons` | Boolean | `true` | Muestra/oculta toda la sección de botones de acción |
| `showNew` | Boolean | `true` | Muestra/oculta el botón "Agregar" |
| `showDelete` | Boolean | `true` | Muestra/oculta el botón "Eliminar" |
| `showExport` | Boolean | `true` | Muestra/oculta el botón "Exportar" |

### Labels Personalizables

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `newButtonLabel` | String | `'Agregar'` | Texto personalizable para el botón de agregar |
| `deleteButtonLabel` | String | `'Eliminar'` | Texto personalizable para el botón de eliminar |
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

## Eventos

| Evento | Descripción | Parámetros |
|--------|-------------|------------|
| `new-item-requested-manager` | Se emite cuando se hace clic en "Agregar" | - |
| `delete-selected-items-requested-manager` | Se emite cuando se hace clic en "Eliminar" | `selectedItems: Array` |
| `view-item-requested-manager` | Se emite cuando se hace clic en "Ver detalles" | `item: Object` |

## Casos de Uso Comunes

### Diferentes Roles de Usuario

```vue
<!-- Administrador: Todos los permisos -->
<data-manager
  v-if="userRole === 'admin'"
  :show-new="true"
  :show-delete="true"
  :show-export="true"
/>

<!-- Editor: Solo agregar y exportar -->
<data-manager
  v-else-if="userRole === 'editor'"
  :show-new="true"
  :show-delete="false"
  :show-export="true"
/>

<!-- Viewer: Solo lectura -->
<data-manager
  v-else
  :show-action-buttons="false"
  :show-selection="false"
/>
```

### Por Tipo de Vista

```vue
<!-- Vista de reportes (solo exportar) -->
<data-manager
  :show-new="false"
  :show-delete="false"
  :show-export="true"
/>

<!-- Vista de configuración (CRUD completo) -->
<data-manager
  :show-new="true"
  :show-delete="true"
  :show-export="true"
/>

<!-- Vista de auditoría (solo lectura) -->
<data-manager
  :show-action-buttons="false"
  :show-selection="false"
  :show-actions="false"
/>
```