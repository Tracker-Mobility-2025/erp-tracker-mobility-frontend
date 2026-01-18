/**
 * Constantes del dominio Sales Team
 */

/**
 * Estados de órdenes
 */
export const OrderStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};

/**
 * Mensajes de validación y errores
 */
export const SalesTeamMessages = {
    UNAUTHORIZED: 'No tiene permisos para acceder a esta sección',
    EMPLOYEE_NOT_FOUND: 'Vendedor no encontrado',
    ORDER_NOT_FOUND: 'Orden no encontrada',
    FETCH_ERROR: 'Error al obtener los datos'
};

/**
 * Roles permitidos para acceder al módulo
 */
export const AllowedRoles = {
    SALES_MANAGER: 'GERENTE_VENTAS'
};
