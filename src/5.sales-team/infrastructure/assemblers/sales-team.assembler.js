/**
 * Assembler para transformar DTOs del API a entidades de dominio del equipo de ventas.
 * Mapea los datos crudos del backend a objetos estructurados.
 */
export class SalesTeamAssembler {
    /**
     * Convierte un DTO de empleado del API a un objeto de dominio.
     * @param {Object} dto - Datos del API
     * @returns {Object} Objeto de empleado estructurado
     */
    static toEmployeeDomain(dto) {
        if (!dto) return null;

        const name = dto.name || '';
        const lastName = dto.lastName || '';
        
        return {
            id: dto.id,
            userId: dto.userId,
            name,
            lastName,
            fullName: `${name} ${lastName}`.trim(), // Nombre completo para identificación
            email: dto.email || '',
            phoneNumber: dto.phoneNumber || '',
            status: dto.status || 'ACTIVE',
            roles: Array.isArray(dto.roles) ? dto.roles : [],
            
            // Brand information
            brandId: dto.brandId,
            brandName: dto.brandName || '',
            
            // Company information
            applicantCompanyId: dto.applicantCompanyId,
            applicantCompanyName: dto.applicantCompanyName || '',
            
            // Timestamps
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt
        };
    }

    /**
     * Convierte un array de DTOs de empleados a objetos de dominio.
     * @param {Array} dtos - Array de datos del API
     * @returns {Array} Array de objetos de empleado estructurados
     */
    static toEmployeeDomainCollection(dtos) {
        if (!Array.isArray(dtos)) {
            console.warn('[SalesTeamAssembler] Se esperaba un array de DTOs');
            return [];
        }
        return dtos.map(dto => this.toEmployeeDomain(dto));
    }
}
