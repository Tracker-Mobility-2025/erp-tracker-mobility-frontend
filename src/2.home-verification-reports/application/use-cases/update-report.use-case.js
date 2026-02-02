import { UpdateReportCommand } from '../../domain/commands/update-report.command.js';

/**
 * Caso de uso para actualizar un reporte de verificación.
 * Encapsula reglas de negocio para la actualización del resultado y validación.
 */
export class UpdateReportUseCase {
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
   * @param {number} reportId - ID del reporte
   * @param {Object} data - Datos actualizados
   * @returns {Promise<Object>} { success, data?, message, code }
   */
  async execute(reportId, data) {
    try {
      // Validar ID de reporte
      const parsedReportId = parseInt(reportId);
      if (!parsedReportId || isNaN(parsedReportId) || parsedReportId <= 0) {
        return {
          success: false,
          message: 'ID de reporte inválido',
          code: 'INVALID_PARAMS'
        };
      }

      // Crear Command (self-validating)
      const command = new UpdateReportCommand({
        reportId: parsedReportId,
        ...data
      });

      // Ejecutar a través del repositorio
      const result = await this.#repository.updateReport(command);

      return {
        success: true,
        data: result,
        message: 'Reporte actualizado correctamente',
        code: 'SUCCESS'
      };
    } catch (error) {
      if (this.#errorHandler) {
        return this.#errorHandler.handle(error, 'actualizar el reporte');
      }
      
      return {
        success: false,
        message: error.message || 'Error al actualizar el reporte',
        code: 'ERROR'
      };
    }
  }
}
