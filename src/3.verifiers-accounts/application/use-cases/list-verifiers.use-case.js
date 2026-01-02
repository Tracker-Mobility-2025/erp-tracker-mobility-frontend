import { VerifierErrorHandler } from '../error-handlers/verifier-error.handler.js';

/**
 * Caso de uso: Listar todos los verificadores.
 * Orquesta la carga y manejo de errores.
 * Application Layer - Use Case.
 * 
 * @class ListVerifiersUseCase
 */
export class ListVerifiersUseCase {
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
   * Ejecuta el caso de uso de listado.
   * @returns {Promise<Object>} Resultado { success, data?, message, code }
   */
  async execute() {
    try {
      const verifiers = await this.repository.findAll();

      return {
        success: true,
        data: verifiers,
        message: `${verifiers.length} verificador${verifiers.length !== 1 ? 'es' : ''} cargado${verifiers.length !== 1 ? 's' : ''}`,
        code: 'SUCCESS'
      };
    } catch (error) {
      return this.errorHandler.handle(error, 'cargar los verificadores');
    }
  }

  /**
   * Obtiene verificadores por ID de administrador.
   * @param {number} adminId - ID del administrador
   * @returns {Promise<Object>} Resultado { success, data?, message, code }
   */
  async executeByAdminId(adminId) {
    try {
      if (!adminId) {
        return {
          success: false,
          message: 'ID de administrador requerido',
          code: 'INVALID_PARAMS'
        };
      }

      const verifiers = await this.repository.findByAdminId(adminId);

      return {
        success: true,
        data: verifiers,
        message: `${verifiers.length} verificador${verifiers.length !== 1 ? 'es' : ''} cargado${verifiers.length !== 1 ? 's' : ''}`,
        code: 'SUCCESS'
      };
    } catch (error) {
      return this.errorHandler.handle(error, 'cargar los verificadores del administrador');
    }
  }

  /**
   * Obtiene un verificador por su ID.
   * @param {number} verifierId - ID del verificador
   * @returns {Promise<Object>} Resultado { success, data?, message, code }
   */
  async executeById(verifierId) {
    try {
      if (!verifierId) {
        return {
          success: false,
          message: 'ID de verificador requerido',
          code: 'INVALID_PARAMS'
        };
      }

      const verifier = await this.repository.findById(verifierId);

      if (!verifier) {
        this.notificationService.showWarning(
          'Verificador no encontrado',
          'No encontrado',
          3000
        );
        return {
          success: false,
          message: 'Verificador no encontrado',
          code: 'NOT_FOUND'
        };
      }

      return {
        success: true,
        data: verifier,
        message: 'Verificador cargado',
        code: 'SUCCESS'
      };
    } catch (error) {
      return this.errorHandler.handle(error, 'cargar el verificador');
    }
  }
}
