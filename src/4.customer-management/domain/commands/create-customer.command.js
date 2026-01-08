/**
 * Command para crear un nuevo cliente.
 * Self-validating: garantiza que los datos sean válidos al momento de construcción.
 */
import { CustomerValidators } from '../validators/customer.validators.js';

export class CreateCustomerCommand {
    constructor({
        ruc,
        companyName,
        password,
        brands = []
    }) {
        // Validación obligatoria
        const rucValidation = CustomerValidators.validateRuc(ruc);
        if (!rucValidation.valid) {
            throw new Error(rucValidation.message);
        }

        const companyNameValidation = CustomerValidators.validateCompanyName(companyName);
        if (!companyNameValidation.valid) {
            throw new Error(companyNameValidation.message);
        }

        // Password validation
        if (!password || password.trim().length === 0) {
            throw new Error('La contraseña es requerida');
        }

        // Brands validation (opcional pero debe ser array)
        if (!Array.isArray(brands)) {
            throw new Error('Brands debe ser un array');
        }

        // Asignar propiedades validadas
        this.ruc = ruc.trim();
        this.companyName = companyName.trim();
        this.password = password.trim();
        this.brands = brands.filter(brand => brand && brand.trim().length > 0).map(brand => brand.trim());
    }

    /**
     * Convierte el command a un objeto plano para envío a la API
     * @returns {Object}
     */
    toDTO() {
        return {
            ruc: this.ruc,
            companyName: this.companyName,
            password: this.password,
            brands: this.brands
        };
    }
}
