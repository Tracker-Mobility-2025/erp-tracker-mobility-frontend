import { AssignedOrder } from '../../domain/models/assigned-order.entity.js';

/**
 * Assembler para transformar DTOs de órdenes asignadas a entidades de dominio
 */
export class AssignedOrderAssembler {
    /**
     * Convierte un DTO de API a una entidad AssignedOrder
     * @param {Object} dto - Objeto del API
     * @returns {AssignedOrder}
     */
    static toEntity(dto) {
        if (!dto) return null;

        return new AssignedOrder(
            dto.id,
            dto.orderCode,
            dto.addressStreet,
            dto.visitDate,
            dto.status,
            dto.addressLocation
        );
    }

    /**
     * Convierte un array de DTOs a entidades AssignedOrder
     * @param {Array} dtos - Array de objetos del API
     * @returns {Array<AssignedOrder>}
     */
    static toEntities(dtos) {
        if (!Array.isArray(dtos)) return [];
        return dtos.map(dto => this.toEntity(dto)).filter(entity => entity !== null);
    }

    /**
     * Convierte una entidad AssignedOrder a DTO para API
     * @param {AssignedOrder} entity - Entidad de dominio
     * @returns {Object}
     */
    static toDto(entity) {
        if (!entity) return null;

        return {
            id: entity.id,
            orderCode: entity.orderCode,
            addressStreet: entity.addressStreet,
            visitDate: entity.visitDate,
            status: entity.status,
            addressLocation: entity.addressLocation
        };
    }
}
