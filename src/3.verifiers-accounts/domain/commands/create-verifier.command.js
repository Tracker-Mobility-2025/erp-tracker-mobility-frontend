import { Email } from '../value-objects/email.vo.js';
import { PhoneNumber } from '../value-objects/phone-number.vo.js';
import { BusinessRules, VerifierRoles, VerifierStatus, VerifierMessages } from '../constants/verifier.constants.js';

/**
 * Command para crear un nuevo verificador.
 * Self-validating: garantiza que los datos sean válidos al momento de construcción.
 * 
 * @class CreateVerifierCommand
 */
export class CreateVerifierCommand {
  /**
   * Crea una instancia de CreateVerifierCommand con validación obligatoria.
   * @param {Object} params - Parámetros del comando
   * @param {string} params.email - Email del verificador
   * @param {string} params.password - Contraseña del verificador
   * @param {string} params.name - Nombre del verificador
   * @param {string} params.lastName - Apellido del verificador
   * @param {string} params.phoneNumber - Teléfono del verificador
   * @param {string} [params.agenda=''] - Horario de trabajo
   * @param {number} params.adminId - ID del administrador asociado
   * @param {string} [params.role] - Rol del verificador
   * @param {string} [params.status] - Estado inicial del verificador
   * @throws {Error} Si los parámetros son inválidos
   */
  constructor({
    email,
    password,
    name,
    lastName,
    phoneNumber,
    agenda = '',
    adminId,
    role = VerifierRoles.FIELD_VERIFIER,
    status = VerifierStatus.INACTIVE
  }) {
    // Validación obligatoria
    if (!email) throw new Error(VerifierMessages.EMAIL_REQUIRED);
    if (!password || password.length < BusinessRules.MIN_PASSWORD_LENGTH) {
      throw new Error(VerifierMessages.INVALID_PASSWORD);
    }
    if (!name || name.trim().length < BusinessRules.MIN_NAME_LENGTH) {
      throw new Error(VerifierMessages.INVALID_NAME);
    }
    if (!lastName || lastName.trim().length < BusinessRules.MIN_NAME_LENGTH) {
      throw new Error('Apellido debe tener al menos 2 caracteres');
    }
    if (!phoneNumber) throw new Error(VerifierMessages.PHONE_REQUIRED);
    if (!adminId) throw new Error(VerifierMessages.ADMIN_ID_REQUIRED);

    // Usar VOs para validar formato
    this.email = new Email(email);
    this.phoneNumber = new PhoneNumber(phoneNumber);
    this.password = password;
    this.name = name.trim();
    this.lastName = lastName.trim();
    this.agenda = agenda || '';
    this.adminId = adminId;
    this.role = role;
    this.status = status;
  }
}
