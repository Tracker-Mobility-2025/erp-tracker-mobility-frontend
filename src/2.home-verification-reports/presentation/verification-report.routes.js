/**
 * Configuración de rutas para el módulo de reportes de verificación
 * Bounded Context: 2.home-verification-reports
 */
import ReportsManagement from './views/reports-management.vue';
import ReportDetail from './views/report-detail.vue';

export const verificationReportRoutes = [
  {
    path: '',
    name: 'verification-reports-list',
    component: ReportsManagement,
    meta: {
      title: 'Reportes de Verificación',
      roles: ['ADMIN', 'MASTER_ADMIN']
    }
  },
  {
    path: 'detail/:reportId',
    name: 'verification-report-detail',
    component: ReportDetail,
    meta: {
      title: 'Detalle de Reporte',
      roles: ['ADMIN', 'MASTER_ADMIN']
    }
  }
];

export default verificationReportRoutes;
