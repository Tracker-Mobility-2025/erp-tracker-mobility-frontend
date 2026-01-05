// Create Customer Command Assembler
// Converts CreateCustomerCommand to API DTO

import { CreateCustomerCommand } from '../domain/commands/create-customer.command.js';

/**
 * Assembler para convertir CreateCustomerCommand a resource DTO.
 */
export class CreateCustomerCommandAssembler {
    /**
     * Convert CreateCustomerCommand to API DTO
     * @param {CreateCustomerCommand} command - Create customer command
     * @returns {Object} API request data
     */
    static toResource(command) {
        if (!command || !(command instanceof CreateCustomerCommand)) {
            throw new Error('Invalid CreateCustomerCommand');
        }

        return command.toDTO();
    }

    /**
     * Create command from raw data and convert to DTO
     * @param {Object} data - Raw customer data
     * @returns {Object} API request data
     */
    static fromDataToResource(data) {
        const command = new CreateCustomerCommand(data);
        return this.toResource(command);
    }
}

