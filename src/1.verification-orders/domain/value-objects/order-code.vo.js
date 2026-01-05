import { BusinessRules, OrderMessages } from '../constants/verification-order.constants.js';

/**
 * Value Object para código de orden.
 * Encapsula validación y formato del código de orden.
 * Inmutable.
 */
export class OrderCode {
    /**
     * @param {string} value - Código de la orden
     * @throws {Error} Si el código es inválido
     */
    constructor(value) {
        if (!value || typeof value !== 'string') {
            throw new Error(OrderMessages.ORDER_CODE_REQUIRED);
        }

        const trimmed = value.trim();
        
        if (trimmed.length < BusinessRules.MIN_ORDER_CODE_LENGTH || 
            trimmed.length > BusinessRules.MAX_ORDER_CODE_LENGTH) {
            throw new Error(`Código de orden debe tener entre ${BusinessRules.MIN_ORDER_CODE_LENGTH} y ${BusinessRules.MAX_ORDER_CODE_LENGTH} caracteres`);
        }

        this._value = trimmed.toUpperCase();
        Object.freeze(this);
    }

    get value() {
        return this._value;
    }

    toString() {
        return this._value;
    }

    equals(other) {
        return other instanceof OrderCode && other._value === this._value;
    }
}
