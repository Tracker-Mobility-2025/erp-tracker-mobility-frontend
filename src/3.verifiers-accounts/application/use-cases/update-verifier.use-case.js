import { VerifierErrorHandler } from '../error-handlers/verifier-error.handler.js';

/**
 * Caso de uso: Actualizar un verificador existente.
 * Orquesta la validación, persistencia y notificación de actualización.
 * Application Layer - Use Case.
 * 
 * @class UpdateVerifierUseCase
 */
export class UpdateVerifierUseCase {
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
   * Ejecuta el caso de uso de actualización.
   * @param {UpdateVerifierCommand} command - Command con datos a actualizar
   * @returns {Promise<Object>} Resultado { success, data?, message, code }
   */
  async execute(command) {
    try {
      // 1. Validar que el verificador existe
      const existingVerifier = await this.repository.findById(command.id);
      if (!existingVerifier) {
        this.notificationService.showWarning(
          'El verificador que intenta actualizar no existe',
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
      // Ejemplo: Si está cambiando el email, verificar que no esté duplicado
      // if (command.email && command.email.value !== existingVerifier.emailValue) {
      //   const duplicateVerifier = await this.repository.findByEmail(command.email.value);
      //   if (duplicateVerifier && duplicateVerifier.id !== command.id) {
      //     this.notificationService.showWarning(
      //       'Ya existe otro verificador con ese email',
      //       'Email duplicado',
      //       4000
      //     );
      //     return {
      //       success: false,
      //       message: 'Email duplicado',
      //       code: 'DUPLICATE_EMAIL'
      //     };
      //   }
      // }

      // 3. Ejecutar operación de actualización
      const updatedVerifier = await this.repository.update(command);

      // 4. Notificar éxito
      this.notificationService.showSuccess(
        `El verificador ${updatedVerifier.fullName} ha sido actualizado exitosamente`,
        'Verificador actualizado',
        4000
      );

      // 5. Retornar resultado estructurado
      return {
        success: true,
        data: updatedVerifier,
        message: 'Verificador actualizado exitosamente',
        code: 'UPDATED'
      };
    } catch (error) {
      // Manejo centralizado de errores
      return this.errorHandler.handle(error, 'actualizar el verificador');
    }
  }
}
