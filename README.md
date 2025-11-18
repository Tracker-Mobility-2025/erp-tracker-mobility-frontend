# 🚀 ERP Tracker Mobility - Sistema de Gestión de Verificaciones Domiciliarias

<div align="center">

![Tracker Mobility](src/assets/img/logo-toolbar-tracker-mobility.png)

**Una solución integral para la gestión de órdenes de servicio y verificaciones domiciliarias**

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5.18-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![PrimeVue](https://img.shields.io/badge/PrimeVue-4.3.9-41B883?style=for-the-badge)](https://primevue.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Descripción del Proyecto

**ERP Tracker Mobility** es una aplicación web empresarial de última generación diseñada para optimizar y automatizar la gestión de verificaciones domiciliarias, órdenes de servicio y reportes de verificación. 

El sistema proporciona una plataforma integral que conecta a empresas solicitantes con verificadores profesionales, facilitando todo el proceso de verificación desde la solicitud inicial hasta la generación de reportes finales.

### 🎯 Objetivos Principales

- 📊 **Optimización de Procesos**: Automatizar el flujo de trabajo de verificaciones domiciliarias
- 📋 **Gestión Centralizada**: Administrar todas las órdenes de servicio desde una única plataforma
- 👥 **Control de Verificadores**: Gestionar el personal verificador, asignaciones y rendimiento
- 🔐 **Seguridad Empresarial**: Sistema robusto de autenticación y control de acceso por roles
- 📱 **Accesibilidad Total**: Diseño responsive optimizado para cualquier dispositivo
- 📈 **Trazabilidad Completa**: Seguimiento detallado de cada etapa del proceso

### ✨ Características Principales

- ✅ **Gestión de Órdenes de Servicio**: Creación, asignación, seguimiento y cierre de órdenes
- ✅ **Portal de Clientes**: Módulo dedicado para empresas solicitantes (COMPANY_EMPLOYEE)
- ✅ **Panel Administrativo**: Herramientas avanzadas para administradores (ADMIN)
- ✅ **Gestión de Verificadores**: Administración completa del personal de campo
- ✅ **Reportes de Verificación**: Generación y visualización de reportes detallados
- ✅ **Sistema de Notificaciones**: Alertas y notificaciones en tiempo real
- ✅ **Carga de Documentos**: Gestión de archivos y documentos de soporte
- ✅ **Dashboard Analítico**: Métricas y estadísticas del sistema
- ✅ **Gestión de Clientes**: Administración de empresas y empleados solicitantes

---

## 🛠️ Stack Tecnológico

### Frontend Framework
- **Vue.js 3.5.18** - Framework progresivo de JavaScript con Composition API
- **Vue Router 4.5.1** - Navegación SPA (Single Page Application)
- **Pinia 3.0.3** - State Management moderno para Vue 3

### Build Tools & Development
- **Vite 7.1.6** - Build tool de nueva generación ultra rápido
- **Node.js** - Entorno de ejecución JavaScript

### UI/UX Framework
- **PrimeVue 4.3.9** - Biblioteca completa de componentes UI empresariales
- **PrimeFlex 4.0.0** - Framework CSS utilitario para layouts responsive
- **PrimeIcons 7.0.0** - Conjunto completo de iconos profesionales
- **@primevue/themes 4.3.9** - Sistema de temas personalizable

### HTTP & API
- **Axios 1.12.2** - Cliente HTTP para comunicación con backend REST API
- **JSON Server 1.0.0** - Mock server para desarrollo y pruebas

### Utilidades
- **@iconify/vue 5.0.0** - Framework de iconos flexible
- **vite-plugin-banner 0.8.1** - Plugin para banners de build

### Despliegue
- **Vercel** - Plataforma de despliegue continuo y hosting

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
erp-tracker-mobility-frontend/
│
├── 📁 public/                              # Recursos públicos estáticos
│   ├── favicon.svg
│   └── vite.svg
│
├── 📁 server/                              # Mock server para desarrollo
│   └── db.json
│
├── 📁 src/                                 # Código fuente principal
│   ├── 📁 assets/                          # Recursos estáticos
│   │   └── 📁 img/                         # Imágenes y logos
│   │
│   ├── 📁 client-tracker-mobility/         # Módulo de clientes
│   │   ├── 📁 order-request/               # Solicitud de órdenes
│   │   │   ├── 📁 components/              # Componentes del formulario
│   │   │   │   ├── 1-customer-data.component.vue
│   │   │   │   ├── 2-address-data.component.vue
│   │   │   │   ├── 3-support-docs-and-landlord-form.component.vue
│   │   │   │   └── 4-resumen-service-order.component.vue
│   │   │   ├── 📁 models/                  # Entidades de dominio
│   │   │   ├── 📁 pages/                   # Páginas del módulo
│   │   │   └── 📁 services/                # Servicios API
│   │   │
│   │   └── 📁 request-management/          # Gestión de solicitudes
│   │       ├── 📁 components/
│   │       ├── 📁 models/
│   │       ├── 📁 pages/
│   │       └── 📁 services/
│   │
│   ├── 📁 tracker-mobility/                # Módulos principales del sistema
│   │   ├── 📁 security/                    # 🔐 Módulo de seguridad
│   │   │   ├── 📁 components/
│   │   │   ├── 📁 models/
│   │   │   ├── 📁 pages/
│   │   │   │   └── sign-in.component.vue   # Vista de login
│   │   │   └── 📁 services/
│   │   │       ├── authentication.store.js
│   │   │       ├── authentication.guard.js
│   │   │       └── authentication.interceptor.js
│   │   │
│   │   ├── 📁 service-orders/              # 📋 Gestión de órdenes
│   │   │   ├── 📁 components/
│   │   │   ├── 📁 models/
│   │   │   ├── 📁 pages/
│   │   │   └── 📁 services/
│   │   │
│   │   ├── 📁 verification-reports/        # 📊 Reportes de verificación
│   │   │   ├── 📁 components/
│   │   │   ├── 📁 models/
│   │   │   ├── 📁 pages/
│   │   │   └── 📁 services/
│   │   │
│   │   ├── 📁 verifier-management/         # 👥 Gestión de verificadores
│   │   │   ├── 📁 components/
│   │   │   ├── 📁 models/
│   │   │   ├── 📁 pages/
│   │   │   └── 📁 services/
│   │   │
│   │   ├── 📁 client-management/           # 🏢 Gestión de clientes
│   │   │   ├── 📁 components/
│   │   │   ├── 📁 models/
│   │   │   ├── 📁 pages/
│   │   │   └── 📁 services/
│   │   │
│   │   └── 📁 dashboard/                   # 📈 Dashboard analítico
│   │       ├── 📁 components/
│   │       ├── 📁 models/
│   │       ├── 📁 pages/
│   │       └── 📁 services/
│   │
│   ├── 📁 public/                          # Componentes públicos
│   │   ├── 📁 components/                  # Componentes de layout
│   │   │   ├── sidebar-tracker-mobility.component.vue
│   │   │   ├── toolbar-tracker-mobility.component.vue
│   │   │   └── module-under-development.component.vue
│   │   └── 📁 pages/
│   │       └── layout-tracker-mobility.component.vue
│   │
│   ├── 📁 shared/                          # Recursos compartidos
│   │   ├── 📁 components/                  # Componentes reutilizables
│   │   │   ├── data-manager.component.vue  # Gestor genérico de datos
│   │   │   ├── create-and-edit.component.vue
│   │   │   └── file-uploader.component.vue
│   │   ├── 📁 services/
│   │   │   └── http-common.js              # Configuración Axios
│   │   └── 📁 utils/
│   │       └── notification.utils.js       # Sistema de notificaciones
│   │
│   ├── 📁 router/                          # Configuración de rutas
│   │   └── index.js                        # Definición de rutas
│   │
│   ├── 📁 documentation/                   # Documentación interna
│   │   ├── data-manager.component.md
│   │   └── data-manager-generic-filters.md
│   │
│   ├── App.vue                             # Componente raíz
│   ├── main.js                             # Punto de entrada
│   └── style.css                           # Estilos globales
│
├── 📄 index.html                           # HTML principal
├── 📄 package.json                         # Dependencias del proyecto
├── 📄 vite.config.js                       # Configuración de Vite
├── 📄 vercel.json                          # Configuración de Vercel
│
└── 📁 Documentación/                       # Documentación del proyecto
    ├── DEPLOYMENT.md                       # Guía de despliegue
    ├── FLUJO_LOGIN.md                      # Flujo de autenticación
    ├── CONFIGURACION_ACTUAL.md             # Estado actual del sistema
    ├── CONFIRMACION_FLUJO_LOGIN.md         # Confirmación del flujo
    ├── REFACTOR_ROUTES.md                  # Refactorización de rutas
    └── CHECKLIST_REFACTOR.md               # Checklist de verificación
```

### Patrón de Arquitectura

El proyecto sigue una **arquitectura modular basada en dominios** con separación clara de responsabilidades:

- **Components**: Componentes Vue reutilizables
- **Models**: Entidades de dominio y DTOs
- **Pages**: Vistas/páginas de la aplicación
- **Services**: Lógica de negocio y comunicación con API

---

## 🔐 Sistema de Autenticación y Roles

### Flujo de Autenticación

```
1. Usuario accede a /sign-in
2. Ingresa credenciales (username + password)
3. Sistema valida con backend y genera token JWT
4. Token se almacena en localStorage
5. Redirección automática a /admin/service-orders
```

### Roles del Sistema

#### 👨‍💼 ADMIN (Administrador)
**Acceso completo al sistema:**
- ✅ Gestión de órdenes de servicio
- ✅ Administración de verificadores
- ✅ Gestión de clientes empresariales
- ✅ Reportes y estadísticas
- ✅ Dashboard analítico
- ✅ Configuración del sistema

#### 🏢 COMPANY_EMPLOYEE (Empleado de Empresa)
**Acceso limitado para solicitudes:**
- ✅ Crear nuevas solicitudes de verificación
- ✅ Ver órdenes de servicio
- ✅ Ver detalles de órdenes
- ✅ Mis solicitudes
- ❌ No accede a: Dashboard, Verificadores, Reportes, Clientes

### Protección de Rutas

- **Authentication Guard**: Protege todas las rutas privadas
- **Role-based Access Control**: Validación de permisos por rol
- **JWT Token Validation**: Verificación de tokens en cada petición
- **Automatic Redirects**: Redirecciones automáticas según permisos

---

## 📦 Instalación y Configuración

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **yarn** >= 1.22.0
- **Git** para control de versiones

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-organizacion/erp-tracker-mobility-frontend.git
cd erp-tracker-mobility-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (crear archivo .env)
cp .env.example .env

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:5173
```

### Variables de Entorno

```env
VITE_API_BASE_URL=https://tu-api-backend.com
VITE_APP_TITLE=ERP Tracker Mobility
VITE_APP_VERSION=2.0.0
```

---

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo (Vite)

# Producción
npm run build            # Genera build optimizado para producción
npm run preview          # Preview del build de producción

# Mock Server (Desarrollo)
npm run server           # Inicia JSON Server en puerto 3000
```

---

## 🎨 Características de UI/UX

### Componentes Reutilizables

- **DataManager**: Gestor genérico de datos con CRUD completo
- **FileUploader**: Componente de carga de archivos con validación
- **CreateAndEdit**: Modal genérico para crear/editar entidades
- **Notification System**: Sistema de notificaciones toast modular

### Sistema de Diseño

- **Diseño Responsive**: Optimizado para móvil, tablet y desktop
- **Tema Personalizable**: Sistema de temas de PrimeVue
- **PrimeFlex Grid**: Sistema de grid flexible y responsive
- **Iconografía Consistente**: PrimeIcons + Iconify

### Experiencia de Usuario

- **Loading States**: Indicadores de carga en todas las operaciones
- **Error Handling**: Manejo elegante de errores con mensajes claros
- **Form Validation**: Validación en tiempo real de formularios
- **Confirmaciones**: Diálogos de confirmación para acciones críticas

---

## 📱 Módulos del Sistema

### 1. 🔐 Security (Seguridad)
**Funcionalidades:**
- Login con autenticación JWT
- Gestión de sesiones
- Control de acceso por roles
- Interceptor HTTP para tokens
- Guards de navegación

### 2. 📋 Service Orders (Órdenes de Servicio)
**Funcionalidades:**
- Listado paginado de órdenes
- Creación de nuevas órdenes
- Edición de órdenes existentes
- Asignación de verificadores
- Cambio de estados
- Historial de cambios
- Búsqueda y filtros avanzados

### 3. 👥 Verifier Management (Gestión de Verificadores)
**Funcionalidades:**
- CRUD completo de verificadores
- Gestión de disponibilidad
- Asignación de órdenes
- Control de carga de trabajo
- Evaluación de desempeño

### 4. 📊 Verification Reports (Reportes)
**Funcionalidades:**
- Visualización de reportes
- Filtros y búsqueda
- Exportación de datos
- Métricas y estadísticas
- Validación de reportes

### 5. 🏢 Client Management (Gestión de Clientes)
**Funcionalidades:**
- Administración de empresas
- Gestión de empleados
- Historial de solicitudes
- Información de contacto

### 6. 📈 Dashboard
**Funcionalidades:**
- Métricas en tiempo real
- Gráficos y estadísticas
- KPIs principales
- Resumen de actividad

### 7. 🎯 Order Request (Solicitud de Órdenes)
**Funcionalidades:**
- Formulario multi-paso
- Datos del cliente
- Dirección de verificación
- Documentos de soporte
- Información del propietario
- Resumen de solicitud

---

## 🌐 Despliegue

### Vercel (Recomendado)

El proyecto está configurado para despliegue automático en Vercel.

```bash
# Usando Vercel CLI
npm i -g vercel
vercel --prod
```

**Configuración automática:**
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Framework: Vite
- ✅ SPA Rewrites configurados

### Otras Plataformas

- **Netlify**: Compatible con configuración de SPA
- **GitHub Pages**: Requiere configuración adicional de rutas
- **AWS S3 + CloudFront**: Para despliegues empresariales

---

## 🏢 Empresa

<div align="center">

### **MetaSoft Solutions SAC**

*Soluciones Tecnológicas Empresariales*

📍 **Ubicación**: Perú  
🌐 **Website**: [www.metasoft.com.pe](https://www.metasoft.com.pe)  
📧 **Email**: contacto@metasoft.com.pe  
📱 **Teléfono**: +51 XXX XXX XXX

---

**Especialidades:**
- ✨ Desarrollo de Software a Medida
- ☁️ Soluciones Cloud
- 📱 Aplicaciones Web y Móviles
- 🔧 Consultoría Tecnológica
- 🎯 Transformación Digital

</div>

---

## 👨‍💻 Desarrolladores

<table>
  <tr>
    <td align="center">
      <img src="https://via.placeholder.com/150" width="100px;" alt="Janover Saldaña"/><br />
      <sub><b>Janover Gonzalo Saldaña Vela</b></sub><br />
      <sub>Full Stack Developer</sub><br />
      <a href="https://github.com/janover-saldana">GitHub</a> •
      <a href="https://linkedin.com/in/janover-saldana">LinkedIn</a>
    </td>
    <td align="center">
      <img src="https://via.placeholder.com/150" width="100px;" alt="Claudio Moreno"/><br />
      <sub><b>Claudio Jesús Moreno Rosales</b></sub><br />
      <sub>Full Stack Developer</sub><br />
      <a href="https://github.com/claudio-moreno">GitHub</a> •
      <a href="https://linkedin.com/in/claudio-moreno">LinkedIn</a>
    </td>
  </tr>
</table>

### Contribuciones

- **Janover Gonzalo Saldaña Vela**
  - Arquitectura del sistema
  - Implementación de módulos principales
  - Sistema de autenticación y seguridad
  - Integración con backend API
  - Optimización de rendimiento

- **Claudio Jesús Moreno Rosales**
  - Diseño de UI/UX
  - Desarrollo de componentes reutilizables
  - Implementación de módulos de gestión
  - Sistema de notificaciones
  - Testing y documentación

---

## 📄 Licencia

Copyright © 2025 **MetaSoft Solutions SAC**. Todos los derechos reservados.

Este software es propiedad de MetaSoft Solutions SAC y está protegido por las leyes de derechos de autor. 
El uso no autorizado, la reproducción o distribución de este software está estrictamente prohibido.

---

## 📞 Soporte y Contacto

### Soporte Técnico
- 📧 **Email**: soporte@metasoft.com.pe
- 📱 **Teléfono**: +51 XXX XXX XXX
- 💬 **Horario**: Lunes a Viernes, 9:00 AM - 6:00 PM (GMT-5)

### Reportar Problemas
Para reportar bugs o solicitar nuevas funcionalidades, por favor contacte a través del email de soporte.

---

## 🙏 Agradecimientos

Agradecemos a todos los que han contribuido al desarrollo de este proyecto:

- Equipo de MetaSoft Solutions SAC
- Clientes que han confiado en nuestras soluciones
- Comunidad open source por las herramientas utilizadas

---

<div align="center">

**🚀 ERP Tracker Mobility**

*Optimizando la verificación domiciliaria con tecnología de vanguardia*

**Desarrollado con ❤️ por MetaSoft Solutions SAC**

[![Vue.js](https://img.shields.io/badge/Made%20with-Vue.js-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![PrimeVue](https://img.shields.io/badge/UI-PrimeVue-41B883?style=flat-square)](https://primevue.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

---

**© 2025 MetaSoft Solutions SAC - Todos los derechos reservados**

*Versión 1.0.0 | Última actualización: 17 de Noviembre de 2025*

</div>

