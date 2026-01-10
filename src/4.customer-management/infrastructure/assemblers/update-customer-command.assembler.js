/**
 * Assembler para convertir UpdateCustomerCommand a resource DTO.
 * Infrastructure layer - Data transformation
 * Responsabilidad: Serializar Commands del dominio al formato esperado por la API.
 * 
 * @class UpdateCustomerCommandAssembler
 */
export class UpdateCustomerCommandAssembler {
    
    /**
     * Convierte un UpdateCustomerCommand a un objeto resource para la API.
     * @param {UpdateCustomerCommand} command - El comando de actualización de cliente.
     * @returns {Object} El objeto resource formateado para la API.
     */
    static toResource(command) {
        const resource = {};

        // Solo incluir campos que están presentes en el comando
        // NO incluir applicantCompanyId en el body (solo va en la URL)
        if (command.ruc !== undefined) resource.ruc = command.ruc;
        if (command.companyName !== undefined) resource.companyName = command.companyName;
        if (command.password !== undefined) resource.password = command.password;
        if (command.status !== undefined) resource.status = command.status;
        if (command.brands !== undefined) resource.brands = command.brands;

        return resource;
    }
    
    /**
     * Alias para compatibilidad con código existente.
     * @deprecated Usar toResource() en su lugar
     */
    static toResourceFromCommand(command) {
        return this.toResource(command);
    }
}

