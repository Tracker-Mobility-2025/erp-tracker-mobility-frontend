import { ObservationType, DefaultObservationStatus, ObservationMessages } from '../constants/observation.constants.js';

/**
 * Comando para crear una nueva observación.
 * Encapsula y valida los datos necesarios para crear una observación.
 */
export class CreateObservationCommand {
  constructor({
    orderId,
    observationType,
    description,
    status = DefaultObservationStatus
  }) {
    // Validaciones
    if (!orderId) {
      throw new Error(ObservationMessages.ORDER_ID_REQUIRED);
    }

    if (!observationType) {
      throw new Error(ObservationMessages.TYPE_REQUIRED);
    }

    if (!Object.values(ObservationType).includes(observationType)) {
      throw new Error(ObservationMessages.INVALID_TYPE);
    }

    if (!description || description.trim() === '') {
      throw new Error(ObservationMessages.DESCRIPTION_REQUIRED);
    }

    if (description.trim().length < 10) {
      throw new Error(ObservationMessages.DESCRIPTION_TOO_SHORT);
    }

    if (description.trim().length > 500) {
      throw new Error(ObservationMessages.DESCRIPTION_TOO_LONG);
    }

    this.orderId = orderId;
    this.observationType = observationType;
    this.description = description.trim();
    this.status = status;

    Object.freeze(this);
  }
}
