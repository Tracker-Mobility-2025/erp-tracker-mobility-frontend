import { VerifierStatus, VerifierRole, VerifierMessages } from '../constants/verifier.constants.js';

/**
 * Representa un verificador en el sistema de verificación domiciliaria.
 * @class Verifier
 */
export class Verifier {
  /**
   * Crea una instancia de Verifier.
   * @param {Object} params - Parámetros del verificador
   * @param {number} [params.id=null] - Identificador único del verificador
   * @param {string} [params.email=''] - Correo electrónico del verificador
   * @param {string} [params.role=''] - Rol del verificador (FIELD_VERIFIER, SENIOR_VERIFIER, SUPERVISOR)
   * @param {string} [params.status=''] - Estado del verificador (ACTIVE, INACTIVE, SUSPENDED)
   * @param {string} [params.name=''] - Nombre del verificador
   * @param {string} [params.lastName=''] - Apellido del verificador
   * @param {string} [params.phoneNumber=''] - Número telefónico del verificador
   * @param {string} [params.agenda=''] - Horario de trabajo del verificador
   * @param {number} [params.adminId=null] - ID del administrador asociado
   */
  constructor({
    id = null,
    email = '',
    role = '',
    status = '',
    name = '',
    lastName = '',
    phoneNumber = '',
    agenda = '',
    adminId = null
  } = {}) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.status = status;
    this.name = name;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.agenda = agenda;
    this.adminId = adminId;
  }

  /**
   * Verifica si el verificador está activo.
   * @returns {boolean} True si el estado es ACTIVE
   */
  get isActive() {
    return this.status?.toUpperCase() === VerifierStatus.ACTIVE;
  }

  /**
   * Obtiene el nombre completo del verificador.
   * @returns {string} Nombre completo concatenado
   */
  get fullName() {
    return `${this.name} ${this.lastName}`.trim() || VerifierMessages.NO_NAME;
  }

  /**
   * Obtiene el email del verificador o mensaje predeterminado.
   * @returns {string} Email
   */
  get emailDisplay() {
    return this.email || VerifierMessages.NO_EMAIL;
  }

  /**
   * Obtiene el teléfono del verificador o mensaje predeterminado.
   * @returns {string} Teléfono
   */
  get phoneDisplay() {
    return this.phoneNumber || VerifierMessages.NO_PHONE;
  }

  /**
   * Obtiene el horario de trabajo o mensaje predeterminado.
   * @returns {string} Horario de trabajo
   */
  get workSchedule() {
    return this.agenda || VerifierMessages.NO_SCHEDULE;
  }
}
