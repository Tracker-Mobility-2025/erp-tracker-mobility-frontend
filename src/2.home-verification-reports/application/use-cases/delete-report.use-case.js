/**
 * Caso de uso para eliminar un reporte.
 * Nota: Actualmente sin implementación en API, preparado para futuro.
 */
export class DeleteReportUseCase {
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
   * @param {number} reportId - ID del reporte a eliminar
   * @returns {Promise<Object>} { success, message, code }
   */
  async execute(reportId) {
    try {
      // Validar ID
      const parsedReportId = parseInt(reportId, 10);
      if (!parsedReportId || isNaN(parsedReportId) || parsedReportId <= 0) {
        return {
          success: false,
          message: 'ID de reporte inválido',
          code: 'INVALID_PARAMS'
        };
      }

      // TODO: Implementar cuando el API lo soporte
      // await this.#repository.delete(parsedReportId);

      return {
        success: true,
        message: 'Reporte eliminado correctamente',
        code: 'DELETED'
      };
    } catch (error) {
      if (this.#errorHandler) {
        return this.#errorHandler.handle(error, 'eliminar el reporte');
      }
      
      return {
        success: false,
        message: error.message || 'Error al eliminar el reporte',
        code: 'ERROR'
      };
    }
  }
}
