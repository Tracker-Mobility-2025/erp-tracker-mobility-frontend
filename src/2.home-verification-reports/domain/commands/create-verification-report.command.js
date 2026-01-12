import { DateValidator } from '../../../shared-v2/utils/date-validator.js';

/**
 * Command para crear un nuevo reporte de verificación.
 * Self-validating: garantiza que los datos sean válidos al momento de construcción.
 * 
 * @class CreateVerificationReportCommand
 */
export class CreateVerificationReportCommand {
  constructor({
    orderId,
    verifierName,
    addressLocation,
    visitDate,
    clientName,
    clientLastName,
    clientDocumentType,
    clientDocumentNumber,
    addressDepartment,
    addressProvince,
    addressDistrict,
    addressStreet
  }) {
    // Validaciones requeridas
    if (!orderId) {
      throw new Error('El ID de la orden es requerido');
    }
    if (!verifierName || verifierName.trim() === '') {
      throw new Error('El nombre del verificador es requerido');
    }
    if (!clientName || clientName.trim() === '') {
      throw new Error('El nombre del cliente es requerido');
    }
    if (!clientLastName || clientLastName.trim() === '') {
      throw new Error('El apellido del cliente es requerido');
    }
    if (!visitDate) {
      throw new Error('La fecha de visita es requerida');
    }
    if (!DateValidator.isValidDate(visitDate)) {
      throw new Error('La fecha de visita no es válida');
    }

    // Asignación de propiedades
    this.orderId = orderId;
    this.verifierName = verifierName.trim();
    this.addressLocation = addressLocation?.trim() || '';
    this.visitDate = visitDate;
    this.clientName = clientName.trim();
    this.clientLastName = clientLastName.trim();
    this.clientDocumentType = clientDocumentType?.trim() || '';
    this.clientDocumentNumber = clientDocumentNumber?.trim() || '';
    this.addressDepartment = addressDepartment?.trim() || '';
    this.addressProvince = addressProvince?.trim() || '';
    this.addressDistrict = addressDistrict?.trim() || '';
    this.addressStreet = addressStreet?.trim() || '';
  }
}
