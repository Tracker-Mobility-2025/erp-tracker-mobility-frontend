/**
 * Command para actualizar un cliente existente.
 * 
 * @class UpdateCustomerCommand
 */
export class UpdateCustomerCommand {
  constructor({
    id,
    // TODO: Agregar parámetros del comando
  }) {
    if (!id) throw new Error('ID es requerido para actualizar');
    this.id = id;
    // TODO: Validación y asignación de propiedades
  }
}
