/**
 * Command para actualizar un cliente existente.
 */
import { CustomerValidators } from '../validators/customer.validators.js';

export class UpdateCustomerCommand {
    constructor({
        id,
        ruc,
        companyName,
        password,
        status,
        brands
    }) {
        if (!id) {
            throw new Error('ID es requerido para actualizar');
        }

        // Validación de campos
        if (ruc !== undefined) {
            // Extraer valor si es un objeto Ruc (value object)
            const rucValue = typeof ruc === 'object' && ruc?.value ? ruc.value : ruc;
            const rucValidation = CustomerValidators.validateRuc(rucValue);
            if (!rucValidation.valid) {
                throw new Error(rucValidation.message);
            }
            this.ruc = typeof rucValue === 'string' ? rucValue.trim() : rucValue;
        }

        if (companyName !== undefined) {
            const companyNameValidation = CustomerValidators.validateCompanyName(companyName);
            if (!companyNameValidation.valid) {
                throw new Error(companyNameValidation.message);
            }
            this.companyName = companyName.trim();
        }

        // Password is optional for updates
        if (password !== undefined && password !== null && password.trim().length > 0) {
            this.password = password.trim();
        }

        if (status !== undefined) {
            const statusValidation = CustomerValidators.validateStatus(status);
            if (!statusValidation.valid) {
                throw new Error(statusValidation.message);
            }
            this.status = status;
        }

        // Brands is optional, defaults to empty array
        // Expects array of strings (brand names/values)
        if (brands !== undefined) {
            if (!Array.isArray(brands)) {
                throw new Error('Brands debe ser un array');
            }
            // Validate each brand is a string
            brands.forEach((brand, index) => {
                if (typeof brand !== 'string') {
                    throw new Error(`Brand en índice ${index} debe ser un string`);
                }
            });
            this.brands = brands;
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
        if (this.password !== undefined) dto.password = this.password;
        if (this.status !== undefined) dto.status = this.status;
        if (this.brands !== undefined) dto.brands = this.brands;
        
        return dto;
    }
}
