/**
 * Configuración de rutas para el módulo de reportes de verificación
 * Bounded Context: 2.home-verification-reports
 */
export const verificationReportRoutes = [
  {
    path: '',
    name: 'verification-reports-list',
    component: () => import('./views/reports-management.vue'),
    meta: {
      title: 'Reportes de Verificación',
      roles: ['ADMIN', 'MASTER_ADMIN']
    }
  },
  {
    path: 'detail',
    name: 'verification-report-detail',
    component: () => import('./views/report-detail.vue'),
    meta: {
      title: 'Detalle de Reporte',
      roles: ['ADMIN', 'MASTER_ADMIN']
    }
  }
];

export default verificationReportRoutes;
