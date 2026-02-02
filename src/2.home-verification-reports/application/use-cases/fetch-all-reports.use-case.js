/**
 * Caso de uso para obtener todos los reportes resumidos.
 * Independiente del framework, testeable en aislamiento.
 * Implementa el patrón Command/Use Case de Clean Architecture.
 */
export class FetchAllReportsUseCase {
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
   * @returns {Promise<Object>} { success, data?, message, code }
   */
  async execute() {
    try {
      const reports = await this.#repository.findAllSummaries();
      
      return {
        success: true,
        data: reports,
        message: `${reports.length} reporte${reports.length !== 1 ? 's' : ''} cargado${reports.length !== 1 ? 's' : ''}`,
        code: 'SUCCESS'
      };
    } catch (error) {
      if (this.#errorHandler) {
        return this.#errorHandler.handle(error, 'cargar los reportes');
      }
      
      // Fallback si no hay error handler
      return {
        success: false,
        message: error.message || 'Error al cargar los reportes',
        code: 'ERROR'
      };
    }
  }
}
