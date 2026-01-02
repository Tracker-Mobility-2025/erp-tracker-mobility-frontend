/**
 * Command para actualizar un verificador existente.
 * Encapsula los datos necesarios para la actualización de un verificador.
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
   */
  constructor({
    id = null,
    email = undefined,
    name = undefined,
    lastName = undefined,
    phoneNumber = undefined,
    agenda = undefined,
    role = undefined,
    status = undefined,
    adminId = undefined
  } = {}) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.agenda = agenda;
    this.role = role;
    this.status = status;
    this.adminId = adminId;
  }
}
