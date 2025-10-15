# 🍞 Documentación: Sistema Modular de Notificaciones

Este sistema proporciona una forma consistente y reutilizable de manejar notificaciones toast y diálogos de confirmación en toda la aplicación.

## 📁 Archivos del Sistema

### 1. `notification.utils.js`
Contiene todas las utilidades modulares:
- **Composable `useNotifications()`** para Composition API
- **Mixin `NotificationMixin`** para Options API  
- **Funciones helper** para casos rápidos
- **Presets predefinidos** para casos comunes

### 2. Implementación en componentes
Los componentes pueden usar cualquiera de estos enfoques según su arquitectura.

---

## 🚀 Formas de Uso

### **Opción 1: Composition API con Composable**

```vue
<script setup>
import { useNotifications } from '@/shared/utils/notification.utils.js'

// Obtener métodos y presets
const { showToast, showConfirmDialog, toastPresets, confirmPresets } = useNotifications()

// Ejemplos de uso
const handleSave = () => {
  // Toast de éxito usando preset
  showToast(toastPresets.success.save('Documento'))
}

const handleDelete = (itemName) => {
  // Confirmación usando preset
  showConfirmDialog(confirmPresets.delete.single(itemName, () => {
    // Lógica de eliminación aquí
    console.log('Elemento eliminado')
    showToast(toastPresets.success.delete(itemName))
  }))
}
</script>
```

### **Opción 2: Options API con Mixin**

```vue
<script>
import { NotificationMixin } from '@/shared/utils/notification.utils.js'

export default {
  name: 'MyComponent',
  
  // Incluir el mixin
  mixins: [NotificationMixin],
  
  methods: {
    handleSave() {
      // Toast personalizado
      this.showToast({
        severity: 'success',
        summary: 'Guardado exitoso',
        detail: 'Los cambios se han guardado correctamente.',
        life: 3000
      })
    },
    
    confirmDelete(itemName) {
      // Confirmación personalizada
      this.showConfirm({
        message: `¿Eliminar "${itemName}"?`,
        header: 'Confirmar eliminación',
        icon: 'pi pi-trash',
        acceptLabel: 'Eliminar',
        acceptClass: 'p-button-danger',
        accept: () => {
          this.deleteItem(itemName)
        }
      })
    }
  }
}
</script>
```

### **Opción 3: Funciones Helper Rápidas**

```vue
<script>
import { quickToast, quickConfirm } from '@/shared/utils/notification.utils.js'

export default {
  methods: {
    quickSave() {
      // Toast rápido
      quickToast(this.$toast, 'success', 'Guardado', 'Datos guardados correctamente')
    },
    
    quickDelete() {
      // Confirmación rápida
      quickConfirm(this.$confirm, '¿Eliminar este elemento?', () => {
        console.log('Eliminado')
      })
    }
  }
}
</script>
```

---

## 📋 Presets Disponibles

### **Toast Presets**

#### ✅ Success
```javascript
toastPresets.success.save('Documento')      // "Documento se ha guardado correctamente"
toastPresets.success.create('Usuario')      // "Usuario se ha creado correctamente"  
toastPresets.success.update('Perfil')       // "Perfil se ha actualizado correctamente"
toastPresets.success.delete('Archivo')      // "Archivo se ha eliminado correctamente"
toastPresets.success.login('Juan')          // "¡Bienvenido de nuevo, Juan!"
toastPresets.success.logout()               // "Hasta pronto. Redirigiendo al login..."
```

#### ❌ Error
```javascript
toastPresets.error.generic('guardar el archivo')     // "No se pudo guardar el archivo"
toastPresets.error.validation('email y contraseña')  // "Complete correctamente: email y contraseña"
toastPresets.error.network()                         // Error de conexión
toastPresets.error.unauthorized()                    // Acceso denegado
toastPresets.error.logout()                          // Error al cerrar sesión
```

#### ⚠️ Warning
```javascript
toastPresets.warning.unsavedChanges()      // Cambios sin guardar
toastPresets.warning.requiredFields()      // Campos requeridos
toastPresets.warning.timeout()             // Sesión expirando
```

#### ℹ️ Info
```javascript
toastPresets.info.loading('Cargando datos')    // "Cargando datos..."
toastPresets.info.noData('resultados')         // "No se encontraron resultados"
toastPresets.info.maintenance()                // Mantenimiento programado (sticky)
```

### **Confirm Presets**

#### 🗑️ Delete
```javascript
confirmPresets.delete.single('archivo.pdf', () => deleteFile())
confirmPresets.delete.multiple(5, () => deleteMultiple())
```

#### 🚪 Navigation
```javascript
confirmPresets.navigation.logout(() => performLogout())
confirmPresets.navigation.leave(() => leavePage())
```

#### 💾 Save
```javascript
confirmPresets.save.changes(() => saveChanges())
confirmPresets.save.discard(() => discardChanges())
```

#### 🔄 System
```javascript
confirmPresets.system.reset(() => resetSettings())
confirmPresets.system.reload(() => reloadPage())
```

---

## 🎨 Personalización Avanzada

### Toast con Configuraciones Especiales

```javascript
// Toast sticky (permanece hasta cerrarse manualmente)
showToast({
  severity: 'warn',
  summary: 'Mantenimiento',
  detail: 'El sistema estará en mantenimiento.',
  sticky: true
})

// Toast con grupo específico
showToast({
  severity: 'info',
  summary: 'Notificación',
  detail: 'Mensaje agrupado',
  group: 'notifications',
  life: 5000
})
```

### Confirmación con Callbacks Personalizados

```javascript
showConfirmDialog({
  message: '¿Proceder con la operación compleja?',
  header: 'Confirmar Operación',
  icon: 'pi pi-cog',
  acceptLabel: 'Proceder',
  rejectLabel: 'Cancelar',
  acceptClass: 'p-button-success',
  onAccept: () => {
    console.log('Operación confirmada')
    // Mostrar toast de progreso
    showToast(toastPresets.info.loading('Procesando operación'))
  },
  onReject: () => {
    console.log('Operación cancelada')
    showToast(toastPresets.info.generic('Operación cancelada'))
  }
})
```

---

## 🔧 Implementación en el Proyecto

### 1. En `sidebar-tracker-mobility.component.vue`
```vue
<script>
import { NotificationMixin } from '../../shared/utils/notification.utils.js';

export default {
  mixins: [NotificationMixin],
  
  methods: {
    confirmLogout() {
      this.showConfirm({
        message: '¿Está seguro que desea cerrar sesión?',
        header: 'Confirmar cierre de sesión',
        icon: 'pi pi-sign-out',
        acceptLabel: 'Sí, cerrar sesión',
        acceptClass: 'p-button-danger p-button-text',
        accept: () => this.logout()
      });
    }
  }
}
</script>
```

### 2. En otros componentes del proyecto
El mismo patrón se puede aplicar a cualquier componente:

- **Formularios**: Confirmar guardado/descarte de cambios
- **Tablas**: Confirmar eliminación de registros
- **Navegación**: Advertir sobre cambios sin guardar
- **Operaciones**: Mostrar progreso y resultados

---

## 🚀 Beneficios del Sistema

### ✅ **Consistencia**
- Misma apariencia y comportamiento en toda la app
- Mensajes estandarizados
- Iconografía y colores consistentes

### ✅ **Reutilización**
- Presets para casos comunes
- Métodos modulares reutilizables
- Menos código duplicado

### ✅ **Mantenibilidad**
- Un solo lugar para modificar comportamientos
- Fácil actualización de mensajes
- Documentación centralizada

### ✅ **Flexibilidad**
- Compatible con Composition API y Options API
- Personización completa cuando se necesita
- Helpers rápidos para casos simples

### ✅ **Escalabilidad**
- Fácil agregar nuevos presets
- Sistema extensible
- Soporte para grupos y categorías

---

## 📝 Notas de Desarrollo

- **Dependencias**: Requiere PrimeVue con ToastService y ConfirmationService
- **Compatibilidad**: Vue 3+ (usa getCurrentInstance para Composition API)
- **Extensibilidad**: Fácil agregar nuevos presets o modificar existentes
- **Performance**: Los helpers son funciones puras, sin overhead significativo

### ⚠️ **IMPORTANTE: ConfirmDialog único**

**SOLO debe haber UN componente `<pv-confirm-dialog />` en toda la aplicación**. 

✅ **Correcto**: En `App.vue` (nivel raíz)
```vue
<template>
  <router-view></router-view>
  <pv-toast />
  <pv-confirm-dialog />  <!-- ✅ Solo aquí -->
</template>
```

❌ **Incorrecto**: Múltiples componentes ConfirmDialog
```vue
<!-- ❌ NO hacer esto en componentes individuales -->
<template>
  <div>
    <!-- contenido del componente -->
  </div>
  <pv-confirm-dialog />  <!-- ❌ Esto causa diálogos duplicados -->
</template>
```

**Razón**: PrimeVue usa un servicio global (`$confirm`) que registra todos los componentes ConfirmDialog disponibles. Si hay múltiples, se ejecutarán todos simultáneamente, causando diálogos duplicados.

### 🔧 **Solución de Problemas**

Si ves **confirmaciones duplicadas**:

1. Buscar componentes `<pv-confirm-dialog />` duplicados:
   ```bash
   grep -r "pv-confirm-dialog" src/
   ```

2. Remover todos excepto el del `App.vue`

3. Verificar que no haya registros duplicados en `main.js`

Este sistema modular hace que el manejo de notificaciones sea **consistente, mantenible y escalable** en toda la aplicación Tracker Mobility.