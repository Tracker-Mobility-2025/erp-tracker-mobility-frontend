import { OrderRequestValidators } from '../validators/order-request.validators.js';

/**
 * Command para actualizar una solicitud de orden existente.
 * Solo valida y actualiza los campos proporcionados.
 * 
 * @class UpdateOrderRequestCommand
 */
export class UpdateOrderRequestCommand {
  constructor({
    id,
    // Campos opcionales para actualización
    clientName,
    clientLastName,
    clientDocumentType,
    clientDocumentNumber,
    clientPhoneNumber,
    clientHomeAddress,
    clientDepartment,
    clientProvince,
    clientDistrict,
    clientMapLocation,
    clientIsTenant,
    clientLandlordName,
    clientLandlordPhoneNumber,
    status
  }) {
    // ID es obligatorio para actualización
    OrderRequestValidators.validateRequiredField(id, 'ID de solicitud');
    this.id = id;
    
    // Validar y asignar solo campos proporcionados
    if (clientName !== undefined) {
      OrderRequestValidators.validateName(clientName, 'Nombre del cliente');
      this.clientName = clientName.trim();
    }
    
    if (clientLastName !== undefined) {
      OrderRequestValidators.validateName(clientLastName, 'Apellido del cliente');
      this.clientLastName = clientLastName.trim();
    }
    
    if (clientDocumentType !== undefined) {
      OrderRequestValidators.validateDocumentType(clientDocumentType);
      this.clientDocumentType = clientDocumentType;
    }
    
    if (clientDocumentNumber !== undefined && clientDocumentType !== undefined) {
      OrderRequestValidators.validateDocumentNumber(clientDocumentNumber, clientDocumentType);
      this.clientDocumentNumber = clientDocumentNumber.toString().replace(/\s/g, '');
    }
    
    if (clientPhoneNumber !== undefined) {
      OrderRequestValidators.validatePhoneNumber(clientPhoneNumber, 'Teléfono del cliente');
      this.clientPhoneNumber = clientPhoneNumber.toString().replace(/[\s-]/g, '');
    }
    
    if (clientHomeAddress !== undefined) {
      OrderRequestValidators.validateAddress(clientHomeAddress);
      this.clientHomeAddress = clientHomeAddress.trim().substring(0, 300);
    }
    
    if (clientDepartment !== undefined) {
      OrderRequestValidators.validateRequiredField(clientDepartment, 'Departamento');
      this.clientDepartment = clientDepartment.trim();
    }
    
    if (clientProvince !== undefined) {
      OrderRequestValidators.validateRequiredField(clientProvince, 'Provincia');
      this.clientProvince = clientProvince.trim();
    }
    
    if (clientDistrict !== undefined) {
      OrderRequestValidators.validateRequiredField(clientDistrict, 'Distrito');
      this.clientDistrict = clientDistrict.trim();
    }
    
    if (clientMapLocation !== undefined) {
      this.clientMapLocation = clientMapLocation;
    }
    
    if (clientIsTenant !== undefined) {
      this.clientIsTenant = Boolean(clientIsTenant);
    }
    
    if (clientLandlordName !== undefined) {
      if (clientLandlordName) {
        OrderRequestValidators.validateName(clientLandlordName, 'Nombre del arrendador');
        this.clientLandlordName = clientLandlordName.trim();
      } else {
        this.clientLandlordName = null;
      }
    }
    
    if (clientLandlordPhoneNumber !== undefined) {
      if (clientLandlordPhoneNumber) {
        OrderRequestValidators.validatePhoneNumber(clientLandlordPhoneNumber, 'Teléfono del arrendador');
        this.clientLandlordPhoneNumber = clientLandlordPhoneNumber.toString().replace(/[\s-]/g, '');
      } else {
        this.clientLandlordPhoneNumber = null;
      }
    }
    
    if (status !== undefined) {
      this.status = status;
    }
  }
}
