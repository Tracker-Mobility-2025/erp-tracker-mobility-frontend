/**
 * Command para crear un nuevo cliente.
 * Self-validating: garantiza que los datos sean válidos al momento de construcción.
 */
import { CustomerValidators } from '../validators/customer.validators.js';

export class CreateCustomerCommand {
    constructor({
        ruc,
        companyName,
        password
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

        // Asignar propiedades validadas
        this.ruc = ruc.trim();
        this.companyName = companyName.trim();
        this.password = password.trim();
    }

    /**
     * Convierte el command a un objeto plano para envío a la API
     * @returns {Object}
     */
    toDTO() {
        return {
            ruc: this.ruc,
            companyName: this.companyName,
            password: this.password
        };
    }
}
