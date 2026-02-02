import { UpdateLandlordInterviewCommand } from '../../domain/commands/update-landlord-interview.command.js';

/**
 * Caso de uso para actualizar la entrevista con el arrendador.
 * Encapsula la lógica de negocio y orquesta el flujo.
 */
export class UpdateLandlordInterviewUseCase {
  #repository;
  #errorHandler;

  constructor(repository, errorHandler) {
    if (!repository) {
      throw new Error('Repository es requerido');
    }
    this.#repository = repository;
    this.#errorHandler = errorHandler;
  }

  /**
   * Ejecuta el caso de uso
   * @param {number} orderId - ID de la orden
   * @param {Object} data - Datos de la entrevista
   * @returns {Promise<Object>} { success, data?, message, code }
   */
  async execute(orderId, data) {
    try {
      // Validar ID de orden
      const parsedOrderId = parseInt(orderId, 10);
      if (!parsedOrderId || isNaN(parsedOrderId) || parsedOrderId <= 0) {
        return {
          success: false,
          message: 'ID de orden inválido',
          code: 'INVALID_PARAMS'
        };
      }

      // Crear Command (self-validating)
      const command = new UpdateLandlordInterviewCommand({
        orderId: parsedOrderId,
        ...data
      });

      // Ejecutar a través del repositorio
      const result = await this.#repository.updateLandlordInterview(command);

      return {
        success: true,
        data: result,
        message: 'Entrevista actualizada correctamente',
        code: 'SUCCESS'
      };
    } catch (error) {
      if (this.#errorHandler) {
        return this.#errorHandler.handle(error, 'actualizar la entrevista con el arrendador');
      }
      
      return {
        success: false,
        message: error.message || 'Error al actualizar la entrevista',
        code: 'ERROR'
      };
    }
  }
}
