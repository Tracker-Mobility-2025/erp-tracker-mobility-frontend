/**
 * Manejador centralizado de errores para el módulo de solicitudes de orden.
 * Application Layer - Error handling strategy.
 * 
 * @class OrderRequestErrorHandler
 */
export class OrderRequestErrorHandler {
  constructor(notificationService) {
    this.notificationService = notificationService;
  }

  handle(error, context = 'operación') {
    // Errores HTTP del servidor
    if (error.response) {
      return this.handleHttpError(error, context);
    }

    // Errores de red
    if (error.request) {
      this.notificationService.showError(
        'No se pudo conectar con el servidor',
        'Error de conexión',
        5000
      );
      console.error(`[OrderRequestErrorHandler] Error al ${context}:`, error);
      return { success: false, message: 'Error de conexión', code: 'NETWORK_ERROR' };
    }

    // Error desconocido
    this.notificationService.showError(
      `Error inesperado al ${context}`,
      'Error',
      4000
    );
    console.error(`[OrderRequestErrorHandler] Error al ${context}:`, error);
    return { success: false, message: 'Error inesperado', code: 'UNKNOWN_ERROR' };
  }

  handleHttpError(error, context) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 404) {
      this.notificationService.showWarning('Recurso no encontrado', 'No encontrado', 4000);
      return { success: false, message: 'No encontrado', code: 'NOT_FOUND' };
    }

    if (status >= 500) {
      this.notificationService.showError('Error del servidor', 'Error', 5000);
      console.error(`[OrderRequestErrorHandler] Error al ${context}:`, error);
      return { success: false, message: 'Error del servidor', code: 'SERVER_ERROR' };
    }

    const message = data.message || `Error al ${context}`;
    this.notificationService.showError(message, 'Error', 4000);
    return { success: false, message, code: 'HTTP_ERROR' };
  }
}
