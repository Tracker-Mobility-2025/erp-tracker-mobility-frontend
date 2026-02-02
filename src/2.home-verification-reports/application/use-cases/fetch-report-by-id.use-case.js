/**
 * Caso de uso para obtener un reporte por su ID.
 * Independiente del framework, testeable en aislamiento.
 */
export class FetchReportByIdUseCase {
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
   * @param {number|string} id - ID del reporte
   * @returns {Promise<Object>} { success, data?, message, code }
   */
  async execute(id) {
    try {
      const reportId = parseInt(id);
      
      if (!reportId || isNaN(reportId) || reportId <= 0) {
        return {
          success: false,
          message: 'ID de reporte inválido',
          code: 'INVALID_PARAMS'
        };
      }

      const report = await this.#repository.findById(reportId);

      if (!report) {
        return {
          success: false,
          message: 'Reporte no encontrado',
          code: 'NOT_FOUND'
        };
      }

      return {
        success: true,
        data: report,
        message: 'Reporte cargado correctamente',
        code: 'SUCCESS'
      };
    } catch (error) {
      if (this.#errorHandler) {
        return this.#errorHandler.handle(error, 'cargar el reporte');
      }
      
      return {
        success: false,
        message: error.message || 'Error al cargar el reporte',
        code: 'ERROR'
      };
    }
  }
}
