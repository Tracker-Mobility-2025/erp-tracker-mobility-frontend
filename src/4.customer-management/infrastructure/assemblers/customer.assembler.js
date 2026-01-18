// Customer Assembler
// Infrastructure layer - DTO to Domain Entity mapper

import { Customer } from '../../domain/models/customer.entity.js';
import { Brand } from '../../domain/models/brand.entity.js';
import { EmployeeCollaborator } from '../../domain/models/employee-collaborator.entity.js';

export class CustomerAssembler {
    /**
     * Convert API DTO to Customer entity
     * @param {Object} dto - API response data
     * @returns {Customer} Customer entity
     */
    static toDomain(dto) {
        if (!dto) return null;
        
        // Map brands array to Brand entities
        const brands = Array.isArray(dto.brands)
            ? dto.brands.map(brandDto => new Brand({
                id: brandDto.id,
                value: brandDto.value
            }))
            : [];
        
        return new Customer({
            id: dto.applicantCompanyId || dto.id, // Map applicantCompanyId -> id
            ruc: dto.ruc, // El VO se crea automáticamente en el constructor
            companyName: dto.companyName,
            status: dto.status,
            brands: brands,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt
        });
    }

    /**
     * Alias para compatibilidad con código existente.
     * @param {Object} resource - API response data
     * @returns {Customer} Customer entity
     */
    static toEntity(resource) {
        return this.toDomain(resource);
    }

    /**
     * Convert array of DTOs to Customer entities
     * @param {Array} dtos - Array of API response data
     * @returns {Array<Customer>} Array of Customer entities
     */
    static toDomainCollection(dtos) {
        if (!Array.isArray(dtos)) return [];
        return dtos.map(dto => this.toDomain(dto)).filter(entity => entity !== null);
    }

    /**
     * Alias para compatibilidad con código existente.
     * @param {Array} resources - Array of API response data
     * @returns {Array<Customer>} Array of Customer entities
     */
    static toEntities(resources) {
        return this.toDomainCollection(resources);
    }

    /**
     * Convert Customer entity to API DTO
     * @param {Customer} entity - Customer entity
     * @returns {Object} API request data
     */
    static toDTO(entity) {
        if (!entity) return null;
        
        const dto = {
            applicantCompanyId: entity.id, // Map id -> applicantCompanyId
            ruc: entity.ruc.toString(), // Convertir VO a string
            companyName: entity.companyName,
            status: entity.status
        };

        // Include brands if present
        if (entity.brands && entity.brands.length > 0) {
            dto.brands = entity.brands.map(brand => ({
                id: brand.id,
                value: brand.value
            }));
        }

        return dto;
    }
}

export class EmployeeCollaboratorAssembler {
    /**
     * Convert API DTO to EmployeeCollaborator entity
     * @param {Object} dto - API response data
     * @returns {EmployeeCollaborator} EmployeeCollaborator entity
     */
    static toDomain(dto) {
        if (!dto) return null;
        
        return new EmployeeCollaborator({
            id: dto.id,
            email: dto.email, // El VO se crea automáticamente en el constructor
            name: dto.name,
            lastName: dto.lastName,
            phoneNumber: dto.phoneNumber, // El VO se crea automáticamente en el constructor
            applicantCompanyId: dto.applicantCompanyId,
            applicantCompanyName: dto.applicantCompanyName,
            status: dto.status,
            brandId: dto.brandId,
            brandName: dto.brandName,
            roles: Array.isArray(dto.roles) ? dto.roles : [],
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt
        });
    }

    /**
     * Convert array of DTOs to EmployeeCollaborator entities
     * @param {Array} dtos - Array of API response data
     * @returns {Array<EmployeeCollaborator>} Array of EmployeeCollaborator entities
     */
    static toDomainCollection(dtos) {
        if (!Array.isArray(dtos)) return [];
        return dtos.map(dto => this.toDomain(dto));
    }

    /**
     * Convert EmployeeCollaborator entity to API DTO
     * @param {EmployeeCollaborator} entity - EmployeeCollaborator entity
     * @returns {Object} API request data
     */
    static toDTO(entity) {
        if (!entity) return null;
        
        const dto = {
            id: entity.id,
            email: entity.email.toString(), // Convertir VO a string
            name: entity.name,
            lastName: entity.lastName,
            phoneNumber: entity.phoneNumber.toString(), // Convertir VO a string
            applicantCompanyId: entity.applicantCompanyId,
            status: entity.status
        };

        // Include brandId if present
        if (entity.brandId !== null && entity.brandId !== undefined) {
            dto.brandId = entity.brandId;
        }

        // Include roles if present
        if (entity.roles && entity.roles.length > 0) {
            dto.roles = entity.roles;
        }

        return dto;
    }
}
