/**
 * Command para actualizar un cliente existente.
 */
import { CustomerValidators } from '../validators/customer.validators.js';

export class UpdateCustomerCommand {
    constructor({
        id,
        ruc,
        companyName,
        status
    }) {
        if (!id) {
            throw new Error('ID es requerido para actualizar');
        }

        // Validación de campos
        if (ruc !== undefined) {
            const rucValidation = CustomerValidators.validateRuc(ruc);
            if (!rucValidation.valid) {
                throw new Error(rucValidation.message);
            }
            this.ruc = ruc.trim();
        }

        if (companyName !== undefined) {
            const companyNameValidation = CustomerValidators.validateCompanyName(companyName);
            if (!companyNameValidation.valid) {
                throw new Error(companyNameValidation.message);
            }
            this.companyName = companyName.trim();
        }

        if (status !== undefined) {
            const statusValidation = CustomerValidators.validateStatus(status);
            if (!statusValidation.valid) {
                throw new Error(statusValidation.message);
            }
            this.status = status;
        }

        this.id = id;
    }

    /**
     * Convierte el command a un objeto plano para envío a la API
     * @returns {Object}
     */
    toDTO() {
        const dto = { id: this.id };
        
        if (this.ruc !== undefined) dto.ruc = this.ruc;
        if (this.companyName !== undefined) dto.companyName = this.companyName;
        if (this.status !== undefined) dto.status = this.status;
        
        return dto;
    }
}
