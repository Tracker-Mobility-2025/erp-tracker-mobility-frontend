import { 
  ObservationStatus, 
  ObservationType,
  DefaultObservationStatus,
  ObservationMessages 
} from '../constants/observation.constants.js';

/**
 * Entidad de dominio: Observation
 * Representa una observación en una orden de verificación.
 * Contiene lógica de negocio y reglas del dominio.
 */
export class Observation {
  #id;
  #orderId;
  #observationType;
  #description;
  #status;
  #createdDate;
  #resolvedDate;

  constructor({
    id = null,
    orderId = null,
    observationType = null,
    description = null,
    status = DefaultObservationStatus,
    createdDate = null,
    resolvedDate = null
  } = {}) {
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

    if (!status) {
      throw new Error(ObservationMessages.STATUS_REQUIRED);
    }

    if (!Object.values(ObservationStatus).includes(status)) {
      throw new Error(ObservationMessages.INVALID_STATUS);
    }

    this.#id = id;
    this.#orderId = orderId;
    this.#observationType = observationType;
    this.#description = description.trim();
    this.#status = status;
    this.#createdDate = createdDate ? new Date(createdDate) : new Date();
    this.#resolvedDate = resolvedDate ? new Date(resolvedDate) : null;

    Object.freeze(this);
  }

  // Getters
  get id() { return this.#id; }
  get orderId() { return this.#orderId; }
  get observationType() { return this.#observationType; }
  get description() { return this.#description; }
  get status() { return this.#status; }
  get createdDate() { return this.#createdDate; }
  get resolvedDate() { return this.#resolvedDate; }

  // Propiedades computadas
  get isPending() {
    return this.#status === ObservationStatus.PENDIENTE;
  }

  get isInReview() {
    return this.#status === ObservationStatus.EN_REVISION;
  }

  get isResolved() {
    return this.#status === ObservationStatus.SUBSANADA;
  }

  get isRejected() {
    return this.#status === ObservationStatus.RECHAZADA;
  }

  get canBeResolved() {
    return this.isPending || this.isInReview;
  }

  get canBeReopened() {
    return this.isResolved || this.isRejected;
  }

  get daysSinceCreated() {
    if (!this.#createdDate) return 0;
    const now = new Date();
    const diffTime = Math.abs(now - this.#createdDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get daysToResolve() {
    if (!this.#resolvedDate || !this.#createdDate) return null;
    const diffTime = Math.abs(this.#resolvedDate - this.#createdDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Métodos de dominio
  /**
   * Verifica si la observación puede cambiar a un nuevo estado
   * @param {string} newStatus - Nuevo estado
   * @returns {boolean}
   */
  canTransitionTo(newStatus) {
    const transitions = {
      [ObservationStatus.PENDIENTE]: [
        ObservationStatus.EN_REVISION,
        ObservationStatus.SUBSANADA,
        ObservationStatus.RECHAZADA
      ],
      [ObservationStatus.EN_REVISION]: [
        ObservationStatus.SUBSANADA,
        ObservationStatus.RECHAZADA,
        ObservationStatus.PENDIENTE
      ],
      [ObservationStatus.SUBSANADA]: [
        ObservationStatus.PENDIENTE
      ],
      [ObservationStatus.RECHAZADA]: [
        ObservationStatus.PENDIENTE
      ]
    };

    return transitions[this.#status]?.includes(newStatus) || false;
  }

  /**
   * Convierte la entidad a un objeto plano
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.#id,
      orderId: this.#orderId,
      observationType: this.#observationType,
      description: this.#description,
      status: this.#status,
      createdDate: this.#createdDate,
      resolvedDate: this.#resolvedDate
    };
  }
}
