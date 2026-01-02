import { BusinessRules } from '../constants/verifier.constants.js';

/**
 * Servicio de dominio para lógica de asignación de verificadores.
 * Encapsula reglas de negocio que involucran múltiples entidades o lógica compleja.
 * 
 * @class VerifierAssignmentService
 */
export class VerifierAssignmentService {
  /**
   * Determina si un verificador puede ser asignado a una orden.
   * @param {Verifier} verifier - El verificador a evaluar
   * @param {Object} order - La orden a asignar
   * @returns {Object} { allowed: boolean, reason: string }
   */
  canAssignOrder(verifier, order) {
    if (!verifier.isActive) {
      return { 
        allowed: false, 
        reason: 'Verificador inactivo' 
      };
    }

    if (order.scheduledDate && !verifier.canWorkAt(order.scheduledDate)) {
      return { 
        allowed: false, 
        reason: 'Fuera de horario laboral' 
      };
    }

    // TODO: Verificar carga de trabajo actual cuando esté disponible
    // if (verifier.currentOrders >= BusinessRules.MAX_DAILY_ORDERS) {
    //   return { 
    //     allowed: false, 
    //     reason: `Carga máxima alcanzada (${BusinessRules.MAX_DAILY_ORDERS} órdenes)` 
    //   };
    // }

    return { allowed: true, reason: 'Verificador disponible' };
  }

  /**
   * Encuentra el mejor verificador para una orden específica.
   * Algoritmo: Prioriza verificadores con menor carga de trabajo.
   * 
   * @param {Object} order - La orden a asignar
   * @param {Array<Verifier>} availableVerifiers - Lista de verificadores disponibles
   * @returns {Verifier|null} El mejor verificador o null si ninguno está disponible
   */
  findBestVerifierFor(order, availableVerifiers) {
    // Filtrar verificadores que pueden tomar la orden
    const candidates = availableVerifiers.filter(verifier => 
      this.canAssignOrder(verifier, order).allowed
    );

    if (candidates.length === 0) {
      return null;
    }

    // Algoritmo simple: seleccionar el con menos carga
    // TODO: Mejorar algoritmo considerando zona geográfica, experiencia, etc.
    return candidates.sort((a, b) => 
      (a.currentOrders || 0) - (b.currentOrders || 0)
    )[0];
  }

  /**
   * Verifica si un verificador puede trabajar en múltiples órdenes simultáneas.
   * @param {Verifier} verifier - El verificador a evaluar
   * @param {Array<Object>} orders - Lista de órdenes
   * @returns {Object} { canHandle: boolean, maxOrders: number, reason: string }
   */
  canHandleMultipleOrders(verifier, orders) {
    if (!verifier.isActive) {
      return {
        canHandle: false,
        maxOrders: 0,
        reason: 'Verificador inactivo'
      };
    }

    const validOrders = orders.filter(order => 
      this.canAssignOrder(verifier, order).allowed
    );

    const canHandle = validOrders.length <= BusinessRules.MAX_DAILY_ORDERS;

    return {
      canHandle,
      maxOrders: BusinessRules.MAX_DAILY_ORDERS,
      validOrders: validOrders.length,
      reason: canHandle 
        ? `Puede manejar ${validOrders.length} de ${orders.length} órdenes`
        : `Excede límite de ${BusinessRules.MAX_DAILY_ORDERS} órdenes diarias`
    };
  }
}
