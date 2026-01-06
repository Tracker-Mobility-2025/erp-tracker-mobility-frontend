import { defineStore } from "pinia";
import { ref } from "vue";
import { VerificationOrderErrorHandler } from "./error-handlers/verification-order-error.handler.js";
import { useNotification } from "../../shared-v2/composables/use-notification.js";
import { OrderApi } from "../infrastructure/order.api.js";
import { ServiceOrderSummaryAssembler } from "../infrastructure/assemblers/service-order-summary.assembler.js";
import { OrderDetailAssembler } from "../infrastructure/assemblers/order-detail.assembler.js";

/**
 * Store de Pinia para funcionalidad de órdenes de verificación.
 * Arquitectura: Presentation → Store → Repository → API
 * Store único consolidado que maneja órdenes, observaciones y documentos.
 */
const useVerificationOrderStore = defineStore('verificationOrder', () => {
    // State
    const orderSummaries = ref([]);

    // Dependencies
    const orderApi = new OrderApi();
    const { showSuccess, showError, showWarning } = useNotification();
    const errorHandler = new VerificationOrderErrorHandler({ showSuccess, showError, showWarning });

    /**
     * Obtiene todas las órdenes en formato resumido
     * @returns {Promise<{success: boolean, data?, message?, code}>}
     */
    async function fetchAllSummaries() {
        try {
            const response = await orderApi.getAllSummary();
            const data = ServiceOrderSummaryAssembler.toEntities(response.data || []);
            orderSummaries.value = data;
            return {
                success: true,
                data,
                message: `${data.length} orden${data.length !== 1 ? 'es' : ''} cargada${data.length !== 1 ? 's' : ''}`,
                code: 'SUCCESS'
            };
        } catch (error) {
            return errorHandler.handle(error, 'cargar las órdenes');
        }
    }

    /**
     * Obtiene una orden completa por ID
     * @param {string|number} orderId - El ID de la orden
     * @returns {Promise<{success: boolean, data?, message?, code}>}
     */
    async function fetchById(orderId) {
        try {
            if (!orderId) {
                throw new Error('El ID de la orden es requerido');
            }
            const response = await orderApi.getById(orderId);
            const data = OrderDetailAssembler.toEntity(response.data);
            return {
                success: true,
                data,
                message: 'Orden cargada correctamente',
                code: 'SUCCESS'
            };
        } catch (error) {
            return errorHandler.handle(error, 'cargar la orden');
        }
    }

    return {
        // State
        orderSummaries,
        
        // Actions
        fetchAllSummaries,
        fetchById
    };
});

export default useVerificationOrderStore;
