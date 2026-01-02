/**
 * Command para crear un nuevo verificador.
 * Encapsula los datos necesarios para la creación de un verificador.
 * 
 * @class CreateVerifierCommand
 */
export class CreateVerifierCommand {
  /**
   * Crea una instancia de CreateVerifierCommand.
   * @param {Object} params - Parámetros del comando
   * @param {string} params.email - Email del verificador
   * @param {string} [params.password=null] - Contraseña del verificador
   * @param {string} params.name - Nombre del verificador
   * @param {string} params.lastName - Apellido del verificador
   * @param {string} params.phoneNumber - Teléfono del verificador
   * @param {string} [params.agenda=''] - Horario de trabajo
   * @param {number} params.adminId - ID del administrador asociado
   * @param {string} [params.role='FIELD_VERIFIER'] - Rol del verificador
   * @param {string} [params.status='INACTIVE'] - Estado inicial del verificador
   */
  constructor({
    email = null,
    password = null,
    name = null,
    lastName = null,
    phoneNumber = null,
    agenda = '',
    adminId = null,
    role = 'FIELD_VERIFIER',
    status = 'INACTIVE'
  } = {}) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.agenda = agenda;
    this.adminId = adminId;
    this.role = role;
    this.status = status;
  }
}
