/**
 * ============================================================================
 * 🍞 UTILIDADES MODULARES PARA NOTIFICACIONES
 * ============================================================================
 * 
 * Este archivo contiene métodos reutilizables para manejar toast notifications
 * y diálogos de confirmación de manera consistente en toda la aplicación.
 * 
 * Uso:
 * import { useNotifications } from '@/shared/utils/notification.utils.js'
 * 
 * export default {
 *   setup() {
 *     const { showToast, showConfirmDialog, toastPresets, confirmPresets } = useNotifications()
 *     return { showToast, showConfirmDialog, toastPresets, confirmPresets }
 *   }
 * }
 */

import { getCurrentInstance } from 'vue'

/**
 * Composable para usar las utilidades de notificación
 * @returns {Object} Métodos y presets para notificaciones
 */
export function useNotifications() {
  const instance = getCurrentInstance()
  
  if (!instance) {
    throw new Error('useNotifications debe ser usado dentro de un componente Vue')
  }

  const { $toast, $confirm } = instance.appContext.config.globalProperties

  // ============================================================================
  // 🍞 MÉTODOS PARA TOAST NOTIFICATIONS
  // ============================================================================

  /**
   * Método genérico para mostrar toast notifications
   * @param {Object} config - Configuración del toast
   * @param {string} config.severity - Tipo: 'success', 'error', 'warn', 'info'
   * @param {string} config.summary - Título del toast
   * @param {string} config.detail - Mensaje del toast
   * @param {number} [config.life=3000] - Duración en ms
   * @param {boolean} [config.sticky=false] - Si el toast permanece hasta cerrarse manualmente
   * @param {string} [config.group=''] - Grupo del toast para organización
   */
  const showToast = ({ 
    severity, 
    summary, 
    detail, 
    life = 3000, 
    sticky = false,
    group = '' 
  }) => {
    if (!$toast) {
      console.warn('⚠️ Toast service no está disponible')
      return
    }

    $toast.add({
      severity,
      summary,
      detail,
      life: sticky ? 0 : life,
      sticky,
      group
    })
  }

  /**
   * Presets de toast para casos comunes
   */
  const toastPresets = {
    // ✅ Éxito
    success: {
      save: (itemName = 'elemento') => ({
        severity: 'success',
        summary: 'Guardado exitoso',
        detail: `${itemName} se ha guardado correctamente.`,
        life: 3000
      }),
      
      create: (itemName = 'elemento') => ({
        severity: 'success',
        summary: 'Creado exitosamente',
        detail: `${itemName} se ha creado correctamente.`,
        life: 3000
      }),
      
      update: (itemName = 'elemento') => ({
        severity: 'success',
        summary: 'Actualizado exitosamente',
        detail: `${itemName} se ha actualizado correctamente.`,
        life: 3000
      }),
      
      delete: (itemName = 'elemento') => ({
        severity: 'success',
        summary: 'Eliminado exitosamente',
        detail: `${itemName} se ha eliminado correctamente.`,
        life: 3000
      }),
      
      login: (username) => ({
        severity: 'success',
        summary: 'Inicio de sesión exitoso',
        detail: `¡Bienvenido de nuevo, ${username}!`,
        life: 3000
      }),

      logout: () => ({
        severity: 'info',
        summary: 'Cerrando sesión',
        detail: 'Hasta pronto. Redirigiendo al login...',
        life: 2000
      })
    },

    // ❌ Error
    error: {
      generic: (action = 'realizar la acción') => ({
        severity: 'error',
        summary: 'Error',
        detail: `No se pudo ${action}. Intente nuevamente.`,
        life: 5000
      }),
      
      validation: (fields = 'campos requeridos') => ({
        severity: 'error',
        summary: 'Error de validación',
        detail: `Por favor, complete correctamente: ${fields}.`,
        life: 4000
      }),
      
      network: () => ({
        severity: 'error',
        summary: 'Error de conexión',
        detail: 'No se pudo conectar con el servidor. Verifique su conexión a internet.',
        life: 6000
      }),
      
      unauthorized: () => ({
        severity: 'error',
        summary: 'Acceso denegado',
        detail: 'No tiene permisos para realizar esta acción.',
        life: 5000
      }),
      
      logout: () => ({
        severity: 'error',
        summary: 'Error al cerrar sesión',
        detail: 'Ocurrió un problema. Intente nuevamente.',
        life: 5000
      })
    },

    // ⚠️ Advertencia
    warning: {
      unsavedChanges: () => ({
        severity: 'warn',
        summary: 'Cambios sin guardar',
        detail: 'Tiene cambios sin guardar que se perderán si continúa.',
        life: 4000
      }),
      
      requiredFields: () => ({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Por favor, complete todos los campos obligatorios.',
        life: 4000
      }),
      
      timeout: () => ({
        severity: 'warn',
        summary: 'Sesión expirando',
        detail: 'Su sesión expirará pronto. Guarde su trabajo.',
        life: 5000
      })
    },

    // ℹ️ Información
    info: {
      loading: (action = 'cargando') => ({
        severity: 'info',
        summary: 'Procesando',
        detail: `${action}...`,
        life: 2000
      }),
      
      noData: (type = 'datos') => ({
        severity: 'info',
        summary: 'Sin resultados',
        detail: `No se encontraron ${type} para mostrar.`,
        life: 3000
      }),
      
      maintenance: () => ({
        severity: 'info',
        summary: 'Mantenimiento programado',
        detail: 'El sistema estará en mantenimiento por unos minutos.',
        life: 0,
        sticky: true
      })
    }
  }

  // ============================================================================
  // 📋 MÉTODOS PARA CONFIRM DIALOGS
  // ============================================================================

  /**
   * Método genérico para mostrar diálogos de confirmación
   * @param {Object} config - Configuración del diálogo
   * @param {string} config.message - Mensaje de confirmación
   * @param {string} [config.header='Confirmar acción'] - Título del diálogo
   * @param {string} [config.icon='pi pi-question-circle'] - Icono del diálogo
   * @param {string} [config.acceptLabel='Sí'] - Texto del botón aceptar
   * @param {string} [config.rejectLabel='Cancelar'] - Texto del botón cancelar
   * @param {string} [config.acceptClass='p-button-danger'] - Clase CSS del botón aceptar
   * @param {string} [config.rejectClass='p-button-text'] - Clase CSS del botón cancelar
   * @param {Function} config.onAccept - Callback al aceptar
   * @param {Function} [config.onReject] - Callback al rechazar
   * @param {string} [config.group=''] - Grupo del diálogo
   */
  const showConfirmDialog = ({
    message,
    header = 'Confirmar acción',
    icon = 'pi pi-question-circle',
    acceptLabel = 'Sí',
    rejectLabel = 'Cancelar',
    acceptClass = 'p-button-danger',
    rejectClass = 'p-button-text',
    onAccept,
    onReject = null,
    group = ''
  }) => {
    if (!$confirm) {
      console.warn('⚠️ Confirm service no está disponible')
      return
    }

    $confirm.require({
      message,
      header,
      icon,
      acceptLabel,
      rejectLabel,
      acceptClass,
      rejectClass,
      group,
      accept: onAccept,
      reject: onReject || (() => {
        console.log(`🔄 [CONFIRM] Acción cancelada: ${header}`)
      })
    })
  }

  /**
   * Presets de confirmación para casos comunes
   */
  const confirmPresets = {
    // 🗑️ Eliminación
    delete: {
      single: (itemName, onConfirm) => ({
        message: `¿Está seguro que desea eliminar "${itemName}"?\n\nEsta acción no se puede deshacer.`,
        header: 'Confirmar eliminación',
        icon: 'pi pi-trash',
        acceptLabel: 'Sí, eliminar',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger',
        onAccept: onConfirm
      }),
      
      multiple: (count, onConfirm) => ({
        message: `¿Está seguro que desea eliminar ${count} elementos seleccionados?\n\nEsta acción no se puede deshacer.`,
        header: 'Confirmar eliminación múltiple',
        icon: 'pi pi-trash',
        acceptLabel: `Sí, eliminar ${count}`,
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger',
        onAccept: onConfirm
      })
    },

    // 🚪 Navegación y sesión
    navigation: {
      logout: (onConfirm) => ({
        message: '¿Está seguro que desea cerrar sesión?',
        header: 'Confirmar cierre de sesión',
        icon: 'pi pi-sign-out',
        acceptLabel: 'Sí, cerrar sesión',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger p-button-text',
        onAccept: onConfirm
      }),
      
      leave: (onConfirm) => ({
        message: '¿Está seguro que desea salir?\n\nSe perderán los cambios no guardados.',
        header: 'Confirmar salida',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, salir',
        rejectLabel: 'Permanecer aquí',
        acceptClass: 'p-button-warning',
        onAccept: onConfirm
      })
    },

    // 💾 Guardado y cambios
    save: {
      changes: (onConfirm) => ({
        message: '¿Desea guardar los cambios realizados?',
        header: 'Guardar cambios',
        icon: 'pi pi-save',
        acceptLabel: 'Sí, guardar',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-success',
        onAccept: onConfirm
      }),
      
      discard: (onConfirm) => ({
        message: '¿Está seguro que desea descartar los cambios?\n\nSe perderán todos los datos no guardados.',
        header: 'Descartar cambios',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, descartar',
        rejectLabel: 'Continuar editando',
        acceptClass: 'p-button-warning',
        onAccept: onConfirm
      })
    },

    // 🔄 Acciones de sistema
    system: {
      reset: (onConfirm) => ({
        message: '¿Está seguro que desea restablecer la configuración?\n\nEsto restaurará los valores por defecto.',
        header: 'Restablecer configuración',
        icon: 'pi pi-refresh',
        acceptLabel: 'Sí, restablecer',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-warning',
        onAccept: onConfirm
      }),
      
      reload: (onConfirm) => ({
        message: '¿Desea recargar la página?\n\nSe perderán los cambios no guardados.',
        header: 'Recargar página',
        icon: 'pi pi-refresh',
        acceptLabel: 'Sí, recargar',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-info',
        onAccept: onConfirm
      })
    }
  }

  return {
    showToast,
    showConfirmDialog,
    toastPresets,
    confirmPresets
  }
}

// ============================================================================
// 🔧 UTILIDADES ADICIONALES
// ============================================================================

/**
 * Función helper para crear toast notifications rápidos
 * @param {Object} $toast - Instancia del servicio Toast
 * @param {string} type - Tipo: 'success', 'error', 'warn', 'info'
 * @param {string} message - Mensaje principal
 * @param {string} [detail=''] - Mensaje detallado
 * @param {number} [life=3000] - Duración en ms
 */
export const quickToast = ($toast, type, message, detail = '', life = 3000) => {
  if (!$toast) {
    console.warn('⚠️ Toast service no está disponible')
    return
  }

  $toast.add({
    severity: type,
    summary: message,
    detail,
    life
  })
}

/**
 * Función helper para confirmaciones rápidas
 * @param {Object} $confirm - Instancia del servicio Confirm
 * @param {string} message - Mensaje de confirmación
 * @param {Function} onAccept - Callback al aceptar
 * @param {string} [header='Confirmar'] - Título del diálogo
 */
export const quickConfirm = ($confirm, message, onAccept, header = 'Confirmar') => {
  if (!$confirm) {
    console.warn('⚠️ Confirm service no está disponible')
    return
  }

  $confirm.require({
    message,
    header,
    icon: 'pi pi-question-circle',
    acceptLabel: 'Sí',
    rejectLabel: 'Cancelar',
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-text',
    accept: onAccept
  })
}

/**
 * Mixin para componentes que usan Options API
 */
export const NotificationMixin = {
  methods: {
    /**
     * Mostrar toast usando el mixin
     */
    showToast(config) {
      if (!this.$toast) {
        console.warn('⚠️ Toast service no está disponible')
        return
      }

      this.$toast.add({
        life: 3000,
        ...config
      })
    },

    /**
     * Mostrar confirmación usando el mixin
     */
    showConfirm(config) {
      if (!this.$confirm) {
        console.warn('⚠️ Confirm service no está disponible')
        return
      }

      // Extraer los callbacks antes de pasarlos a require
      const { accept, reject, ...dialogConfig } = config

      this.$confirm.require({
        group: 'default', // Especificar grupo para evitar conflictos
        acceptClass: 'p-button-danger',
        rejectClass: 'p-button-text',
        acceptLabel: 'Sí',
        rejectLabel: 'Cancelar',
        icon: 'pi pi-question-circle',
        ...dialogConfig,
        // Asegurar que los callbacks se pasen correctamente
        accept: accept || (() => {}),
        reject: reject || (() => {
          console.log('🔄 [CONFIRM] Acción cancelada por el usuario')
        })
      })
    }
  }
}