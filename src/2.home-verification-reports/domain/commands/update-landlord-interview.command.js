/**
 * Command para actualizar la entrevista con el arrendador.
 * Self-validating: garantiza que los datos sean válidos al momento de construcción.
 * 
 * @class UpdateLandlordInterviewCommand
 */
export class UpdateLandlordInterviewCommand {
  constructor({
    orderId,
    tenantName,
    ownHouse,
    serviceClientPays,
    clientPaysPunctual,
    clientRentalTime,
    clientFloorNumber,
    interviewObservation
  }) {
    // Validaciones requeridas
    if (!orderId) {
      throw new Error('El ID de la orden es requerido');
    }
    if (!tenantName || tenantName.trim() === '') {
      throw new Error('El nombre del inquilino es requerido');
    }
    if (!ownHouse || ownHouse.trim() === '') {
      throw new Error('El campo "Casa propia" es requerido');
    }
    if (!serviceClientPays || serviceClientPays.trim() === '') {
      throw new Error('El campo "Servicio que paga el cliente" es requerido');
    }
    if (!clientPaysPunctual || clientPaysPunctual.trim() === '') {
      throw new Error('El campo "¿El cliente paga puntual?" es requerido');
    }
    if (!clientRentalTime || clientRentalTime.trim() === '') {
      throw new Error('El tiempo de arrendamiento es requerido');
    }
    if (!clientFloorNumber || clientFloorNumber.trim() === '') {
      throw new Error('El piso ocupado por el cliente es requerido');
    }

    // Asignación de propiedades
    this.orderId = orderId;
    this.tenantName = tenantName.trim();
    this.ownHouse = ownHouse.trim();
    this.serviceClientPays = serviceClientPays.trim();
    this.clientPaysPunctual = clientPaysPunctual.trim();
    this.clientRentalTime = clientRentalTime.trim();
    this.clientFloorNumber = clientFloorNumber.trim();
    this.interviewObservation = interviewObservation?.trim() || '';
  }
}
