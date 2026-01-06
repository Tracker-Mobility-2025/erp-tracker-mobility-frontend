import { VerifierStatus, VerifierRoles, VerifierMessages } from '../constants/verifier.constants.js';
import { Email } from '../value-objects/email.vo.js';
import { PhoneNumber } from '../value-objects/phone-number.vo.js';
import { WorkSchedule } from '../value-objects/work-schedule.vo.js';

/**
 * Representa un verificador en el sistema de verificación domiciliaria.
 * Rich Domain Model con comportamiento de negocio encapsulado.
 * @class Verifier
 */
export class Verifier {
  /**
   * Crea una instancia de Verifier con validación obligatoria.
   * @param {Object} params - Parámetros del verificador
   * @param {number} params.id - Identificador único del verificador
   * @param {string} params.email - Correo electrónico del verificador
   * @param {string} params.phoneNumber - Número telefónico del verificador
   * @param {string} params.agenda - Horario de trabajo del verificador
   * @param {string} [params.role] - Rol del verificador
   * @param {string} [params.status] - Estado del verificador
   * @param {string} params.name - Nombre del verificador
   * @param {string} params.lastName - Apellido del verificador
   * @param {number} params.adminId - ID del administrador asociado
   * @throws {Error} Si los parámetros son inválidos
   */
  constructor({
    id,
    email,
    phoneNumber,
    agenda,
    role,
    status,
    name,
    lastName,
    adminId
  }) {
    // Validación obligatoria de campos requeridos
    if (!id) throw new Error(VerifierMessages.ID_REQUIRED);
    if (!name || name.trim().length < 2) {
      throw new Error(VerifierMessages.INVALID_NAME);
    }
    
    this.id = id;
    this.name = name.trim();
    this.lastName = lastName?.trim() || '';
    this.role = role || VerifierRoles.FIELD_VERIFIER;
    this.status = status || VerifierStatus.INACTIVE;
    this.adminId = adminId;
    
    // Usar Value Objects con validación automática
    this.email = new Email(email);
    this.phoneNumber = new PhoneNumber(phoneNumber);
    this.workSchedule = new WorkSchedule(agenda);
  }

  /**
   * Verifica si el verificador está activo.
   * @returns {boolean} True si el estado es ACTIVE
   */
  get isActive() {
    return this.status === VerifierStatus.ACTIVE;
  }

  /**
   * Obtiene el nombre completo del verificador.
   * @returns {string} Nombre completo concatenado
   */
  get fullName() {
    return `${this.name} ${this.lastName}`.trim();
  }

  /**
   * Obtiene el valor del email.
   * @returns {string} Email
   */
  get emailValue() {
    return this.email.value;
  }

  /**
   * Obtiene el valor del teléfono.
   * @returns {string} Teléfono
   */
  get phoneValue() {
    return this.phoneNumber.value;
  }

  /**
   * Obtiene el valor del horario de trabajo.
   * @returns {string} Horario de trabajo
   */
  get workScheduleValue() {
    return this.workSchedule.value;
  }
 
}
