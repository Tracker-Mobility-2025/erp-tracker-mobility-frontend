/**
 * Manejador centralizado de errores para el módulo de reportes.
 * Responsabilidad: Transformar errores técnicos en mensajes de usuario apropiados.
 * Application Layer - Error handling strategy.
 * 
 * @class ReportErrorHandler
 */
export class ReportErrorHandler {
  /**
   * Crea una instancia del manejador de errores.
   * @param {Object} notificationService - Servicio de notificaciones (useNotification)
   */
  constructor(notificationService) {
    this.notificationService = notificationService;
  }

  /**
   * Maneja errores de operaciones con reportes.
   * @param {Error} error - Error a manejar
   * @param {string} context - Contexto de la operación ('cargar los reportes', 'cargar el reporte')
   * @returns {Object} Resultado estructurado { success: false, message, code }
   */
  handle(error, context = 'operación') {
    // Errores de autorización
    if (this.isUnauthorizedError(error)) {
      this.notificationService.showError(
        'No tiene permisos para realizar esta acción',
        'Acceso denegado',
        4000
      );
      return {
        success: false,
        message: 'No autorizado',
        code: 'UNAUTHORIZED'
      };
    }

    // Errores HTTP del servidor
    if (error.response) {
      return this.handleHttpError(error, context);
    }

    // Errores de red
    if (error.request) {
      this.notificationService.showError(
        'No se pudo conectar con el servidor. Verifique su conexión a internet.',
        'Error de conexión',
        5000
      );
      this.logError(error, context);
      return {
        success: false,
        message: 'Error de conexión',
        code: 'NETWORK_ERROR'
      };
    }

    // Error desconocido
    this.notificationService.showError(
      `Ocurrió un error inesperado al ${context}. Por favor, intente nuevamente.`,
      'Error inesperado',
      4000
    );
    this.logError(error, context);
    return {
      success: false,
      message: 'Error inesperado',
      code: 'UNKNOWN_ERROR'
    };
  }

  /**
   * Maneja errores HTTP específicos.
   * @private
   * @param {Error} error - Error HTTP
   * @param {string} context - Contexto de la operación
   * @returns {Object} Resultado estructurado
   */
  handleHttpError(error, context) {
    const status = error.response.status;
    const data = error.response.data;

    // Error 400 - Bad Request
    if (status === 400) {
      const message = data.message || `Datos inválidos al ${context}`;
      this.notificationService.showError(message, 'Datos inválidos', 4000);
      return {
        success: false,
        message,
        code: 'BAD_REQUEST'
      };
    }

    // Error 404 - Not Found
    if (status === 404) {
      console.error('[ReportErrorHandler] 404 Error - Detalles completos:', {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        responseData: error.response?.data,
        responseStatus: error.response?.status,
        context
      });
      
      this.notificationService.showWarning(
        'El reporte solicitado no fue encontrado',
        'No encontrado',
        4000
      );
      return {
        success: false,
        message: 'Reporte no encontrado',
        code: 'NOT_FOUND'
      };
    }

    // Error 409 - Conflict
    if (status === 409) {
      const message = data.message || 'Ya existe un reporte con esos datos';
      this.notificationService.showWarning(message, 'Conflicto', 4000);
      return {
        success: false,
        message,
        code: 'CONFLICT'
      };
    }

    // Errores del servidor (5xx)
    if (status >= 500) {
      this.notificationService.showError(
        'Error en el servidor. Por favor, intente más tarde.',
        'Error del servidor',
        5000
      );
      this.logError(error, context);
      return {
        success: false,
        message: 'Error del servidor',
        code: 'SERVER_ERROR'
      };
    }

    // Error genérico HTTP
    const message = data.message || `Error al ${context}`;
    this.notificationService.showError(message, 'Error', 4000);
    return {
      success: false,
      message,
      code: 'HTTP_ERROR'
    };
  }

  /**
   * Verifica si el error es de autorización.
   * @private
   * @param {Error} error - Error a verificar
   * @returns {boolean} True si es error de autorización
   */
  isUnauthorizedError(error) {
    return error.response && (error.response.status === 401 || error.response.status === 403);
  }

  /**
   * Registra el error en la consola para debugging.
   * @private
   * @param {Error} error - Error a registrar
   * @param {string} context - Contexto de la operación
   */
  logError(error, context) {
    console.error(`[ReportErrorHandler] Error al ${context}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}
