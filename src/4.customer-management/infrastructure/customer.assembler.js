// Customer Assembler
// Infrastructure layer - DTO to Domain Entity mapper

import { Customer } from '../domain/models/customer.entity.js';
import { EmployeeCollaborator } from '../domain/models/employee-collaborator.entity.js';

export class CustomerAssembler {
    /**
     * Convert API DTO to Customer entity
     * @param {Object} dto - API response data
     * @returns {Customer} Customer entity
     */
    static toDomain(dto) {
        if (!dto) return null;
        
        return new Customer({
            id: dto.id,
            ruc: dto.ruc,
            companyName: dto.companyName,
            status: dto.status,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt
        });
    }

    /**
     * Convert array of DTOs to Customer entities
     * @param {Array} dtos - Array of API response data
     * @returns {Array<Customer>} Array of Customer entities
     */
    static toDomainCollection(dtos) {
        if (!Array.isArray(dtos)) return [];
        return dtos.map(dto => this.toDomain(dto));
    }

    /**
     * Convert Customer entity to API DTO
     * @param {Customer} entity - Customer entity
     * @returns {Object} API request data
     */
    static toDTO(entity) {
        if (!entity) return null;
        
        return {
            id: entity.id,
            ruc: entity.ruc,
            companyName: entity.companyName,
            status: entity.status
        };
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
            email: dto.email,
            name: dto.name,
            lastName: dto.lastName,
            phoneNumber: dto.phoneNumber,
            applicantCompanyId: dto.applicantCompanyId,
            status: dto.status,
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
        
        return {
            id: entity.id,
            email: entity.email,
            name: entity.name,
            lastName: entity.lastName,
            phoneNumber: entity.phoneNumber,
            applicantCompanyId: entity.applicantCompanyId,
            status: entity.status
        };
    }
}
