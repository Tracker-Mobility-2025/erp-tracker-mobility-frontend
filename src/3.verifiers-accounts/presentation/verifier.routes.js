/**
 * Configuración de rutas para el módulo de verificadores
 * Bounded Context: 3.verifiers-accounts
 */
import VerifiersManagement from './views/verifiers-management.vue';
import VerifierDetail from './views/verifier-detail.vue';

export const verifierRoutes = [
  {
    path: '',
    name: 'verifiers',
    component: VerifiersManagement,
    meta: {
      title: 'Verificadores',
      roles: ['ADMIN', 'MASTER_ADMIN']
    }
  },
  {
    path: 'details',
    name: 'verifier-details',
    component: VerifierDetail,
    meta: {
      title: 'Detalles del verificador',
      roles: ['ADMIN', 'MASTER_ADMIN']
    }
  }
];

export default verifierRoutes;