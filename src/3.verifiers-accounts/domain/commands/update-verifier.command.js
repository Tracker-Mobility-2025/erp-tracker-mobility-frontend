import { Email } from '../value-objects/email.vo.js';
import { PhoneNumber } from '../value-objects/phone-number.vo.js';
import { BusinessRules, VerifierMessages } from '../constants/verifier.constants.js';

/**
 * Command para actualizar un verificador existente.
 * Self-validating: valida los campos proporcionados.
 * 
 * @class UpdateVerifierCommand
 */
export class UpdateVerifierCommand {
  /**
   * Crea una instancia de UpdateVerifierCommand.
   * @param {Object} params - Parámetros del comando
   * @param {number} params.id - ID del verificador a actualizar
   * @param {string} [params.email] - Email del verificador
   * @param {string} [params.name] - Nombre del verificador
   * @param {string} [params.lastName] - Apellido del verificador
   * @param {string} [params.phoneNumber] - Teléfono del verificador
   * @param {string} [params.agenda] - Horario de trabajo
   * @param {string} [params.role] - Rol del verificador
   * @param {string} [params.status] - Estado del verificador
   * @param {number} [params.adminId] - ID del administrador asociado
   * @throws {Error} Si los parámetros son inválidos
   */
  constructor({
    id,
    email = undefined,
    name = undefined,
    lastName = undefined,
    phoneNumber = undefined,
    agenda = undefined,
    role = undefined,
    status = undefined,
    adminId = undefined
  }) {
    // ID es obligatorio
    if (!id) throw new Error(VerifierMessages.ID_REQUIRED);
    
    this.id = id;
    
    // Validar y usar VOs solo si los campos están presentes
    if (email !== undefined) {
      this.email = new Email(email);
    }
    
    if (phoneNumber !== undefined) {
      this.phoneNumber = new PhoneNumber(phoneNumber);
    }
    
    if (name !== undefined) {
      if (name.trim().length < BusinessRules.MIN_NAME_LENGTH) {
        throw new Error(VerifierMessages.INVALID_NAME);
      }
      this.name = name.trim();
    }
    
    if (lastName !== undefined) {
      if (lastName.trim().length < BusinessRules.MIN_NAME_LENGTH) {
        throw new Error('Apellido debe tener al menos 2 caracteres');
      }
      this.lastName = lastName.trim();
    }
    
    if (agenda !== undefined) this.agenda = agenda;
    if (role !== undefined) this.role = role;
    if (status !== undefined) this.status = status;
    if (adminId !== undefined) this.adminId = adminId;
  }
}
