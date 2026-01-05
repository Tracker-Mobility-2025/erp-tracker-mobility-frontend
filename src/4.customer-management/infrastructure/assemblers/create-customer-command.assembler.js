/**
 * Assembler para convertir CreateCustomerCommand a resource DTO.
 * Infrastructure layer - Data transformation
 * Responsabilidad: Serializar Commands del dominio al formato esperado por la API.
 * 
 * @class CreateCustomerCommandAssembler
 */
export class CreateCustomerCommandAssembler {
    
    /**
     * Convierte un CreateCustomerCommand a un objeto resource para la API.
     * @param {CreateCustomerCommand} command - El comando de creación de cliente.
     * @returns {Object} El objeto resource formateado para la API.
     */
    static toResource(command) {
        return {
            ruc: command.ruc,
            companyName: command.companyName,
            password: command.password
        };
    }
    
    /**
     * Alias para compatibilidad con código existente.
     * @deprecated Usar toResource() en su lugar
     */
    static toResourceFromCommand(command) {
        return this.toResource(command);
    }
}

