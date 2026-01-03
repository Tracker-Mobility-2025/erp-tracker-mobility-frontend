/**
 * Rutas del módulo de reportes de verificación.
 */
export const verificationReportRoutes = [
  {
    path: '/verification-reports',
    name: 'verification-reports',
    component: () => import('./views/verification-reports-management.vue'),
    meta: {
      title: 'Reportes de Verificación',
      requiresAuth: true
    }
  },
  {
    path: '/verification-reports/:id',
    name: 'verification-report-details',
    component: () => import('./views/verification-report-detail.vue'),
    meta: {
      title: 'Detalle de Reporte',
      requiresAuth: true
    }
  }
];
