/**
 * Manejador centralizado de errores para el módulo de clientes.
 * Application Layer - Error handling strategy.
 * 
 * @class CustomerErrorHandler
 */
export class CustomerErrorHandler {
  constructor(notificationService) {
    this.showSuccess = notificationService.showSuccess;
    this.showError = notificationService.showError;
    this.showWarning = notificationService.showWarning;
  }

  handle(error, context = 'operación') {
    // Errores HTTP del servidor
    if (error.response) {
      return this.handleHttpError(error, context);
    }

    // Errores de red
    if (error.request) {
      this.showError(
        'No se pudo conectar con el servidor',
        'Error de conexión',
        5000
      );
      console.error(`[CustomerErrorHandler] Error al ${context}:`, error);
      return { success: false, message: 'Error de conexión', code: 'NETWORK_ERROR' };
    }

    // Error desconocido
    this.showError(
      `Error inesperado al ${context}`,
      'Error',
      4000
    );
    console.error(`[CustomerErrorHandler] Error al ${context}:`, error);
    return { success: false, message: 'Error inesperado', code: 'UNKNOWN_ERROR' };
  }

  handleHttpError(error, context) {
    const status = error.response.status;
    const data = error.response.data;

    console.log('🔍 [ErrorHandler] Detalles del error HTTP:', {
      status,
      data,
      message: data?.message,
      errors: data?.errors,
      context
    });

    if (status === 404) {
      this.showWarning('Recurso no encontrado', 'No encontrado', 4000);
      return { success: false, message: 'No encontrado', code: 'NOT_FOUND' };
    }

    if (status === 400) {
      // Error de validación - mostrar mensaje específico del backend
      const errorMessage = data?.message || data?.error || `Error de validación al ${context}`;
      
      // Si hay errores de validación específicos, mostrarlos
      if (data?.errors && Array.isArray(data.errors)) {
        const errorDetails = data.errors.map(e => e.message || e).join(', ');
        this.showError(errorDetails, 'Error de validación', 6000);
        return { success: false, message: errorDetails, code: 'VALIDATION_ERROR', details: data.errors };
      }
      
      this.showError(errorMessage, 'Error de validación', 5000);
      return { success: false, message: errorMessage, code: 'VALIDATION_ERROR' };
    }

    if (status >= 500) {
      this.showError('Error del servidor', 'Error', 5000);
      console.error(`[CustomerErrorHandler] Error al ${context}:`, error);
      return { success: false, message: 'Error del servidor', code: 'SERVER_ERROR' };
    }

    const message = data?.message || data?.error || `Error al ${context}`;
    this.showError(message, 'Error', 4000);
    return { success: false, message, code: 'HTTP_ERROR' };
  }
}
