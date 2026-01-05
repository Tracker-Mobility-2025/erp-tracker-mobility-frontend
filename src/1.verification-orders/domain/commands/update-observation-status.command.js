import { ObservationStatus, ObservationMessages } from '../constants/observation.constants.js';

/**
 * Comando para actualizar el estado de una observación.
 * Encapsula y valida los datos necesarios para actualizar.
 */
export class UpdateObservationStatusCommand {
  constructor({
    id,
    status,
    resolvedDate = null
  }) {
    // Validaciones
    if (!id) {
      throw new Error(ObservationMessages.ID_REQUIRED);
    }

    if (!status) {
      throw new Error(ObservationMessages.STATUS_REQUIRED);
    }

    if (!Object.values(ObservationStatus).includes(status)) {
      throw new Error(ObservationMessages.INVALID_STATUS);
    }

    this.id = id;
    this.status = status;
    this.resolvedDate = resolvedDate;

    Object.freeze(this);
  }
}
