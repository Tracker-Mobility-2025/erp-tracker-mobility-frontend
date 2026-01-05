// Update Customer Command Assembler
// Converts UpdateCustomerCommand to API DTO

import { UpdateCustomerCommand } from '../domain/commands/update-customer.command.js';

/**
 * Assembler para convertir UpdateCustomerCommand a resource DTO.
 */
export class UpdateCustomerCommandAssembler {
    /**
     * Convert UpdateCustomerCommand to API DTO
     * @param {UpdateCustomerCommand} command - Update customer command
     * @returns {Object} API request data
     */
    static toResource(command) {
        if (!command || !(command instanceof UpdateCustomerCommand)) {
            throw new Error('Invalid UpdateCustomerCommand');
        }

        return command.toDTO();
    }

    /**
     * Create command from raw data and convert to DTO
     * @param {Object} data - Raw customer data (must include id)
     * @returns {Object} API request data
     */
    static fromDataToResource(data) {
        const command = new UpdateCustomerCommand(data);
        return this.toResource(command);
    }
}

