import { VerifierErrorHandler } from '../error-handlers/verifier-error.handler.js';

/**
 * Caso de uso: Eliminar un verificador.
 * Orquesta la validación, eliminación y notificación.
 * Application Layer - Use Case.
 * 
 * @class DeleteVerifierUseCase
 */
export class DeleteVerifierUseCase {
  /**
   * Crea una instancia del caso de uso.
   * @param {IVerifierRepository} repository - Repositorio de verificadores
   * @param {Object} notificationService - Servicio de notificaciones
   */
  constructor(repository, notificationService) {
    this.repository = repository;
    this.notificationService = notificationService;
    this.errorHandler = new VerifierErrorHandler(notificationService);
  }

  /**
   * Ejecuta el caso de uso de eliminación.
   * @param {number} verifierId - ID del verificador a eliminar
   * @param {string} verifierName - Nombre del verificador (para notificación)
   * @returns {Promise<Object>} Resultado { success, message, code }
   */
  async execute(verifierId, verifierName = '') {
    try {
      // 1. Validar que el verificador existe
      const existingVerifier = await this.repository.findById(verifierId);
      if (!existingVerifier) {
        this.notificationService.showWarning(
          'El verificador que intenta eliminar no existe',
          'Verificador no encontrado',
          4000
        );
        return {
          success: false,
          message: 'Verificador no encontrado',
          code: 'NOT_FOUND'
        };
      }

      // 2. Validar reglas de negocio adicionales
      // Ejemplo: No permitir eliminar verificadores con órdenes asignadas
      // const assignedOrders = await this.repository.findAssignedOrders(verifierId);
      // if (assignedOrders && assignedOrders.length > 0) {
      //   this.notificationService.showWarning(
      //     `No se puede eliminar el verificador porque tiene ${assignedOrders.length} órdenes asignadas`,
      //     'Verificador con órdenes activas',
      //     4000
      //   );
      //   return {
      //     success: false,
      //     message: 'Verificador tiene órdenes asignadas',
      //     code: 'HAS_ASSIGNED_ORDERS'
      //   };
      // }

      // 3. Ejecutar operación de eliminación
      await this.repository.delete(verifierId);

      // 4. Notificar éxito
      const displayName = verifierName || existingVerifier.fullName;
      this.notificationService.showSuccess(
        `El verificador ${displayName} ha sido eliminado exitosamente`,
        'Verificador eliminado',
        4000
      );

      // 5. Retornar resultado estructurado
      return {
        success: true,
        message: 'Verificador eliminado exitosamente',
        code: 'DELETED'
      };
    } catch (error) {
      // Manejo centralizado de errores
      return this.errorHandler.handle(error, 'eliminar el verificador');
    }
  }

  /**
   * Elimina múltiples verificadores.
   * @param {Array<Object>} verifiers - Array de objetos { id, name }
   * @returns {Promise<Object>} Resultado con conteo de éxitos/fallos
   */
  async executeMultiple(verifiers) {
    const results = [];
    
    for (const verifier of verifiers) {
      const result = await this.execute(verifier.id, verifier.name);
      results.push({ verifier, result });
    }

    const successCount = results.filter(r => r.result.success).length;
    const failureCount = results.filter(r => !r.result.success).length;

    if (successCount > 0 && failureCount === 0) {
      this.notificationService.showSuccess(
        `${successCount} verificador${successCount > 1 ? 'es' : ''} eliminado${successCount > 1 ? 's' : ''} exitosamente`,
        'Verificadores eliminados',
        4000
      );
    } else if (failureCount > 0) {
      this.notificationService.showWarning(
        `${successCount} de ${verifiers.length} verificadores eliminados. ${failureCount} fallaron.`,
        'Operación parcial',
        4000
      );
    }

    return {
      success: failureCount === 0,
      successCount,
      failureCount,
      results
    };
  }
}
