import { VerifierErrorHandler } from '../error-handlers/verifier-error.handler.js';

/**
 * Caso de uso: Crear un nuevo verificador.
 * Orquesta la validación, persistencia y notificación de creación.
 * Application Layer - Use Case.
 * 
 * @class CreateVerifierUseCase
 */
export class CreateVerifierUseCase {
  /**
   * Crea una instancia del caso de uso.
   * @param {IVerifierRepository} repository - Repositorio de verificadores
   * @param {Object} notificationService - Servicio de notificaciones
   * @param {Object} authService - Servicio de autenticación
   */
  constructor(repository, notificationService, authService) {
    this.repository = repository;
    this.notificationService = notificationService;
    this.authService = authService;
    this.errorHandler = new VerifierErrorHandler(notificationService);
  }

  /**
   * Ejecuta el caso de uso de creación.
   * @param {CreateVerifierCommand} command - Command con datos del verificador
   * @returns {Promise<Object>} Resultado { success, data?, message, code }
   */
  async execute(command) {
    try {
      // 1. Validar permisos (opcional, dependiendo de tu lógica de negocio)
      if (!this.canCreateVerifier()) {
        return {
          success: false,
          message: 'No tiene permisos para crear verificadores',
          code: 'UNAUTHORIZED'
        };
      }

      // 2. Validar reglas de negocio adicionales
      // Ejemplo: Verificar si ya existe un verificador con ese email
      // const existingVerifier = await this.repository.findByEmail(command.email.value);
      // if (existingVerifier) {
      //   this.notificationService.showWarning(
      //     'Ya existe un verificador con ese email',
      //     'Email duplicado',
      //     4000
      //   );
      //   return {
      //     success: false,
      //     message: 'Ya existe un verificador con ese email',
      //     code: 'DUPLICATE_EMAIL'
      //   };
      // }

      // 3. Ejecutar operación de persistencia
      const verifier = await this.repository.save(command);

      // 4. Notificar éxito
      this.notificationService.showSuccess(
        `El verificador ${verifier.fullName} ha sido creado exitosamente`,
        'Verificador creado',
        4000
      );

      // 5. Retornar resultado estructurado
      return {
        success: true,
        data: verifier,
        message: 'Verificador creado exitosamente',
        code: 'CREATED'
      };
    } catch (error) {
      // Manejo centralizado de errores
      return this.errorHandler.handle(error, 'crear el verificador');
    }
  }

  /**
   * Verifica si el usuario actual puede crear verificadores.
   * @private
   * @returns {boolean} True si tiene permisos
   */
  canCreateVerifier() {
    // Implementar lógica de autorización según tu sistema
    return this.authService?.currentUserId !== null;
  }
}
