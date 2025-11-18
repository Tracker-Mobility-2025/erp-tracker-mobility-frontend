# 🚀 ERP Tracker Mobility - Sistema de Gestión de Verificaciones Domiciliarias

<div align="center">

![Tracker Mobility](src/assets/img/logo-toolbar-tracker-mobility.png)

**Plataforma empresarial integral para la gestión de órdenes de servicio y verificaciones domiciliarias**

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5.18-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![PrimeVue](https://img.shields.io/badge/PrimeVue-4.3.9-41B883?style=for-the-badge)](https://primevue.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-3.0.3-FFD859?style=for-the-badge&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](LICENSE)

**Desarrollado por MetaSoft Solutions SAC para Tracker Mobility**

</div>

---

## 📋 Acerca del Proyecto

### 🤝 Cliente

**Tracker Mobility** es una empresa especializada en servicios de verificación domiciliaria y validación de datos, que confió en **MetaSoft Solutions SAC** para el desarrollo de su plataforma tecnológica integral.

### 💡 La Solución

**ERP Tracker Mobility** es una aplicación web empresarial de última generación diseñada para optimizar y automatizar la gestión completa de verificaciones domiciliarias, órdenes de servicio y reportes de verificación. 

El sistema proporciona una plataforma integral que conecta a empresas solicitantes con verificadores profesionales, facilitando todo el proceso de verificación desde la solicitud inicial hasta la generación de reportes finales con total trazabilidad.

### 🎯 Objetivos del Sistema

- 🎯 **Automatización de Procesos**: Optimizar el flujo de trabajo completo de verificaciones domiciliarias
- 📊 **Centralización de Datos**: Administrar todas las órdenes de servicio desde una única plataforma integrada
- 👥 **Gestión de Personal**: Control completo de verificadores, asignaciones y evaluación de rendimiento
- 🔐 **Seguridad Empresarial**: Sistema robusto de autenticación JWT y control de acceso basado en roles
- 📱 **Accesibilidad Universal**: Interfaz responsive optimizada para escritorio, tablet y dispositivos móviles
- 📈 **Trazabilidad Total**: Seguimiento detallado de cada etapa del proceso con historial completo de cambios
- 📊 **Business Intelligence**: Dashboard analítico con métricas y KPIs en tiempo real

### ✨ Características Destacadas

#### 🏢 **Para Administradores**
- ✅ Gestión completa de órdenes de servicio (CRUD)
- ✅ Administración de verificadores y asignación de tareas
- ✅ Dashboard analítico con métricas y KPIs
- ✅ Gestión de clientes empresariales y empleados
- ✅ Generación y visualización de reportes detallados
- ✅ Sistema de notificaciones en tiempo real
- ✅ Exportación de datos en múltiples formatos
- ✅ Control de acceso y permisos granulares

#### 👔 **Para Empresas Solicitantes (Clientes)**
- ✅ Portal dedicado para solicitudes de verificación
- ✅ Seguimiento en tiempo real del estado de órdenes
- ✅ Visualización de reportes de verificación
- ✅ Gestión de documentos y archivos de soporte
- ✅ Historial completo de solicitudes

#### 🎯 **Para Verificadores**
- ✅ Panel de órdenes asignadas
- ✅ Carga de evidencias y documentación
- ✅ Generación de reportes de campo
- ✅ Actualización de estados en tiempo real

---

## 🛠️ Stack Tecnológico

<table>
<tr>
<td valign="top" width="50%">

### 🎨 Frontend Core

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Vue.js** | 3.5.18 | Framework JavaScript progresivo con Composition API |
| **Vue Router** | 4.5.1 | Sistema de navegación SPA |
| **Pinia** | 3.0.3 | State Management moderno |
| **Vite** | 7.1.6 | Build tool ultra rápido |
| **Axios** | 1.12.2 | Cliente HTTP para API REST |

</td>
<td valign="top" width="50%">

### 🎨 UI/UX Framework

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **PrimeVue** | 4.3.9 | Biblioteca de componentes UI |
| **PrimeFlex** | 4.0.0 | Framework CSS utilitario |
| **PrimeIcons** | 7.0.0 | Conjunto de iconos |
| **@primevue/themes** | 4.3.9 | Sistema de temas |
| **Iconify** | 5.0.0 | Framework de iconos |

</td>
</tr>
</table>

### 🔧 Herramientas de Desarrollo

- **JSON Server 1.0.0** - Mock server para desarrollo y pruebas
- **vite-plugin-banner** - Plugin para banners de build
- **Node.js** - Entorno de ejecución JavaScript

### 🚀 Despliegue

- **Vercel** - Plataforma de CI/CD y hosting cloud

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

### 🔄 Flujo de Autenticación

**Proceso de autenticación:**
1. Usuario accede a `/sign-in`
2. Ingresa credenciales (username + password)
3. Sistema valida con backend y genera token JWT
4. Token se almacena en localStorage
5. Redirección automática según rol:
   - **ADMIN** → `/admin/service-orders`
   - **COMPANY_EMPLOYEE** → `/client/my-requests`

### 👥 Roles del Sistema

<table>
<tr>
<td valign="top" width="50%">

#### 👨‍💼 ADMIN (Administrador)

**Acceso total al sistema:**

- ✅ Gestión completa de órdenes de servicio
- ✅ Administración de verificadores
- ✅ Gestión de clientes empresariales
- ✅ Generación de reportes y estadísticas
- ✅ Dashboard analítico completo
- ✅ Configuración del sistema
- ✅ Gestión de usuarios y permisos
- ✅ Auditoría y logs del sistema

**Módulos disponibles:**
- Service Orders
- Verifier Management
- Client Management
- Verification Reports
- Dashboard
- Security & Settings

</td>
<td valign="top" width="50%">

#### 🏢 COMPANY_EMPLOYEE (Empleado)

**Acceso limitado a solicitudes:**

- ✅ Crear nuevas solicitudes de verificación
- ✅ Ver estado de órdenes propias
- ✅ Consultar detalles de órdenes
- ✅ Historial de mis solicitudes
- ✅ Descargar reportes finales
- ❌ **Sin acceso a:** Dashboard, Verificadores, Gestión de Clientes

**Módulos disponibles:**
- Order Request
- My Requests
- Request Details
- Download Reports

</td>
</tr>
</table>

### 🛡️ Seguridad y Protección

| Característica | Descripción |
|---------------|-------------|
| **Authentication Guard** | Protección de rutas privadas con validación de sesión |
| **Role-based Access** | Control de permisos granular por rol |
| **JWT Validation** | Verificación de tokens en cada petición HTTP |
| **Auto Redirects** | Redirecciones automáticas según permisos |
| **Token Refresh** | Renovación automática de tokens antes de expiración |
| **Session Timeout** | Cierre automático de sesión por inactividad |

---

## 📦 Instalación y Configuración

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **yarn** >= 1.22.0
- **Git** para control de versiones

### Pasos de Instalación

**1. Clonar el repositorio**
```bash
git clone https://github.com/Tracker-Mobility-2025/erp-tracker-mobility-frontend.git
cd erp-tracker-mobility-frontend
```

**2. Instalar dependencias**
```bash
npm install
```

**3. Configurar variables de entorno** _(opcional)_
```bash
cp .env.example .env
# Editar .env con tus valores
```

**4. Iniciar servidor de desarrollo**
```bash
npm run dev
```

**5. Abrir en el navegador**
- URL: `http://localhost:5173`

### Variables de Entorno

```env
VITE_API_BASE_URL=https://tu-api-backend.com
VITE_APP_TITLE=ERP Tracker Mobility
VITE_APP_VERSION=2.0.0
```

---

## 🚀 Scripts Disponibles

```bash
# 🔥 Desarrollo
npm run dev              # Inicia servidor de desarrollo con Vite (hot-reload)
                         # URL: http://localhost:5173

# 📦 Producción
npm run build            # Genera build optimizado para producción
                         # Output: /dist

npm run preview          # Preview local del build de producción
                         # URL: http://localhost:4173

# 🧪 Testing y Mock Server
npm run server           # Inicia JSON Server en puerto 3000
                         # Mock API para desarrollo sin backend
```

### 🔧 Comandos Útiles

```bash
# Instalación limpia
npm ci                   # Instalación exacta según package-lock.json

# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install

# Análisis del bundle
npm run build -- --mode analyze
```

---

## 🎨 Características de UI/UX

<table>
<tr>
<td valign="top" width="50%">

### 🧩 Componentes Reutilizables

**DataManager**
- Gestor genérico de datos con CRUD
- Tabla con paginación y filtros
- Exportación a CSV
- Acciones por fila configurables

**FileUploader**
- Carga de archivos con drag & drop
- Validación de tipos y tamaños
- Preview de imágenes
- Progress bar integrado

**CreateAndEdit**
- Modal genérico CRUD
- Validación de formularios
- Estados de loading
- Manejo de errores

**Notification System**
- Toasts de éxito/error/warning
- Confirmaciones personalizables
- Presets predefinidos
- Sistema modular y extensible

</td>
<td valign="top" width="50%">

### 🎨 Sistema de Diseño

**Responsive Design**
- Mobile-first approach
- Breakpoints: 576px, 768px, 992px, 1200px
- Grid system flexible
- Componentes adaptativos

**Theming**
- Sistema de temas PrimeVue
- Variables CSS personalizables
- Dark mode ready
- Paleta de colores corporativa

**Iconografía**
- PrimeIcons (principal)
- Iconify (complementario)
- Iconos SVG optimizados
- Consistencia visual

**Tipografía**
- Fuentes optimizadas
- Jerarquía clara
- Escalado responsive
- Legibilidad óptima

</td>
</tr>
</table>

### ✨ Experiencia de Usuario

| Característica | Descripción |
|---------------|-------------|
| **Loading States** | Skeletons y spinners en todas las operaciones asíncronas |
| **Error Handling** | Mensajes claros con sugerencias de solución |
| **Form Validation** | Validación en tiempo real con feedback visual |
| **Confirmaciones** | Diálogos de confirmación para acciones destructivas |
| **Feedback Visual** | Animaciones sutiles y transiciones suaves |
| **Accesibilidad** | ARIA labels, navegación por teclado, contraste WCAG AA |

---

## 📱 Módulos del Sistema

<table>
<tr>
<td valign="top" width="50%">

### 🔐 Security (Seguridad)
- Login con autenticación JWT
- Gestión de sesiones
- Control de acceso basado en roles
- Interceptor HTTP para tokens
- Guards de navegación
- Recuperación de contraseña

### 📋 Service Orders (Órdenes)
- Listado paginado con filtros
- Creación de nuevas órdenes
- Edición de órdenes existentes
- Asignación de verificadores
- Gestión de estados
- Historial de cambios
- Búsqueda avanzada

### 👥 Verifier Management (Verificadores)
- CRUD completo de verificadores
- Gestión de disponibilidad
- Asignación automática de órdenes
- Control de carga de trabajo
- Evaluación de desempeño
- Historial de asignaciones

</td>
<td valign="top" width="50%">

### 📊 Verification Reports (Reportes)
- Visualización de reportes
- Filtros y búsqueda avanzada
- Exportación de datos
- Métricas y estadísticas
- Validación de reportes
- Aprobación/Rechazo

### 🏢 Client Management (Clientes)
- Administración de empresas
- Gestión de empleados
- Historial de solicitudes
- Información de contacto
- Gestión de contratos

### 📈 Dashboard
- Métricas en tiempo real
- Gráficos interactivos
- KPIs principales
- Resumen de actividad
- Alertas y notificaciones

### 🎯 Order Request (Solicitudes)
- Formulario multi-paso
- Validación en tiempo real
- Carga de documentos
- Resumen de solicitud
- Confirmación automática

</td>
</tr>
</table>

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

## 🏢 Cliente y Proveedor de Servicios

<div align="center">

<table>
<tr>
<td align="center" width="50%">

### 🎯 Cliente

<img src="https://via.placeholder.com/200x80/4CAF50/FFFFFF?text=Tracker+Mobility" alt="Tracker Mobility" width="200"/>

**Tracker Mobility**

Empresa líder en servicios de verificación domiciliaria y validación de datos empresariales en Perú.

**Especialidades:**
- 🏠 Verificación Domiciliaria
- 📋 Validación de Datos
- 🔍 Investigación de Campo
- 📊 Reportes de Verificación
- ✅ Due Diligence

📍 Lima, Perú  
🌐 [www.trackermobility.com.pe](#)

</td>
<td align="center" width="50%">

### 💻 Desarrollado por

<img src="https://via.placeholder.com/200x80/2196F3/FFFFFF?text=MetaSoft" alt="MetaSoft Solutions" width="200"/>

**MetaSoft Solutions SAC**

Empresa de desarrollo de software y soluciones tecnológicas empresariales.

**Servicios:**
- 💼 Desarrollo de Software a Medida
- ☁️ Soluciones Cloud Empresariales
- 📱 Aplicaciones Web y Móviles
- 🔧 Consultoría Tecnológica
- 🎯 Transformación Digital

📍 Lima, Perú  
🌐 [www.metasoft.com.pe](https://www.metasoft.pe)  
📧 contacto@metasoft.pe

</td>
</tr>
</table>

---

**🤝 Alianza Estratégica**

MetaSoft Solutions SAC desarrolló esta plataforma tecnológica integral para potenciar las operaciones de Tracker Mobility, optimizando sus procesos de verificación y gestión de servicios mediante tecnología de vanguardia.

</div>

---

## 👨‍💻 Equipo de Desarrollo

<div align="center">

<table>
  <tr>
    <td align="center" width="50%">
      <img src="https://via.placeholder.com/150/2196F3/FFFFFF?text=JS" width="120px;" alt="Janover Saldaña"/><br />
      <sub><b>Janover Gonzalo Saldaña Vela</b></sub><br />
      <sub>🚀 Full Stack Developer</sub><br />
      <sub>Lead Developer & Arquitectura</sub><br /><br />
      <a href="https://github.com/janover-saldana">
        <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
      </a>
      <a href="https://linkedin.com/in/janover-saldana">
        <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
      </a>
      <br /><br />
      <details>
      <summary>📋 Contribuciones principales</summary>
      <br />
      <ul align="left">
        <li>Arquitectura del sistema y estructura del proyecto</li>
        <li>Implementación de módulos principales</li>
        <li>Sistema de autenticación y seguridad JWT</li>
        <li>Integración con backend API REST</li>
        <li>Optimización de rendimiento y bundle</li>
        <li>Configuración de Vite y build process</li>
      </ul>
      </details>
    </td>
    <td align="center" width="50%">
      <img src="https://via.placeholder.com/150/4CAF50/FFFFFF?text=CM" width="120px;" alt="Claudio Moreno"/><br />
      <sub><b>Claudio Jesús Moreno Rosales</b></sub><br />
      <sub>🎨 Full Stack Developer</sub><br />
      <sub>UI/UX & Components</sub><br /><br />
      <a href="https://github.com/claudio-moreno">
        <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
      </a>
      <a href="https://linkedin.com/in/claudio-moreno">
        <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
      </a>
      <br /><br />
      <details>
      <summary>📋 Contribuciones principales</summary>
      <br />
      <ul align="left">
        <li>Diseño de interfaz y experiencia de usuario</li>
        <li>Desarrollo de componentes reutilizables</li>
        <li>Implementación de módulos de gestión</li>
        <li>Sistema de notificaciones y feedback</li>
        <li>Testing y documentación técnica</li>
        <li>Integración de PrimeVue y theming</li>
      </ul>
      </details>
    </td>
  </tr>
</table>

### 🌟 Stack de Competencias del Equipo

```javascript
const teamSkills = {
  frontend: ['Vue.js 3', 'JavaScript ES6+', 'HTML5', 'CSS3', 'PrimeVue', 'Pinia'],
  backend: ['Node.js', 'Express', 'RESTful APIs', 'JWT Authentication'],
  database: ['MySQL', 'MongoDB', 'PostgreSQL'],
  tools: ['Git', 'Vite', 'Webpack', 'npm/yarn', 'VS Code'],
  methodologies: ['Scrum', 'Agile', 'Git Flow', 'Code Review'],
  deployment: ['Vercel', 'AWS', 'Docker', 'CI/CD']
};
```

</div>

---

## 📞 Soporte y Contacto

<table>
<tr>
<td valign="top" width="50%">

### 🎯 Cliente - Tracker Mobility

**Consultas sobre el servicio de verificación:**

📧 **Email:** contacto@trackermobility.com.pe  
📱 **Teléfono:** +51 XXX XXX XXX  
🕐 **Horario:** Lunes a Viernes, 9:00 AM - 6:00 PM  
📍 **Ubicación:** Lima, Perú

**Para solicitudes de servicio:**
- Portal web de clientes
- Email de soporte
- Línea directa de atención

</td>
<td valign="top" width="50%">

### 💻 Soporte Técnico - MetaSoft Solutions

**Soporte técnico del sistema:**

📧 **Email:** soporte@metasoft.pe  
📧 **Email técnico:** dev@metasoft.pe  
📱 **Teléfono:** +51 XXX XXX XXX  
🕐 **Horario:** Lunes a Viernes, 9:00 AM - 6:00 PM (GMT-5)

**Para reportar problemas técnicos:**
- Bugs o errores del sistema
- Solicitudes de nuevas funcionalidades
- Consultas de implementación
- Soporte de integración

</td>
</tr>
</table>

### 🐛 Reportar Problemas

Para reportar bugs o solicitar nuevas funcionalidades:

1. **Email:** Enviar detalles a `soporte@metasoft.pe`
2. **Incluir:**
   - Descripción detallada del problema
   - Pasos para reproducir el error
   - Screenshots o videos (si aplica)
   - Información del navegador/dispositivo
   - Usuario y rol afectado

3. **Respuesta:** 24-48 horas hábiles

---

## 🙏 Agradecimientos

<div align="center">

Este proyecto fue posible gracias a la colaboración entre **Tracker Mobility** y **MetaSoft Solutions SAC**.

**Agradecimientos especiales a:**

- 🎯 **Tracker Mobility** - Por confiar en MetaSoft Solutions para desarrollar su plataforma tecnológica
- 👥 **Equipo de Desarrollo** - Por su dedicación y expertise técnico
- 🌟 **Comunidad Open Source** - Por las herramientas y librerías utilizadas:
  - Vue.js Team
  - PrimeVue/PrimeTek
  - Vite Team
  - Toda la comunidad de contribuidores

**Tecnologías Open Source utilizadas:**

[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)

</div>

---

<div align="center">

## 📄 Licencia

**Código Propietario - Todos los Derechos Reservados**

```
Copyright © 2025 MetaSoft Solutions SAC
Desarrollado para Tracker Mobility
```

Este software es propiedad de **MetaSoft Solutions SAC** y fue desarrollado bajo contrato para **Tracker Mobility**.  
El uso, reproducción o distribución no autorizada de este software está estrictamente prohibido y puede resultar en acciones legales.

**Términos de Uso:**
- ✅ Uso autorizado exclusivamente por Tracker Mobility y personal autorizado
- ❌ Prohibida la redistribución, modificación o venta sin autorización
- ❌ Prohibida la ingeniería inversa o decompilación
- ✅ MetaSoft Solutions SAC retiene todos los derechos de propiedad intelectual

Para consultas sobre licenciamiento, contactar: **legal@metasoft.pe**

---

## 🚀 Estado del Proyecto

<table>
<tr>
<td align="center">

**Versión Actual**

[![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)](package.json)

</td>
<td align="center">

**Estado**

[![Status](https://img.shields.io/badge/status-Producción-success?style=for-the-badge)](README.md)

</td>
<td align="center">

**Última Actualización**

[![Updated](https://img.shields.io/badge/updated-Nov_2025-orange?style=for-the-badge)](CHANGELOG.md)

</td>
</tr>
</table>

### 📈 Roadmap Futuro

- [ ] **v1.1.0** - Notificaciones por email
- [ ] **v1.2.0** - Exportación de reportes en PDF
- [ ] **v1.3.0** - Dashboard de métricas avanzado
- [ ] **v2.0.0** - App móvil nativa para verificadores
- [ ] **v2.1.0** - Integración con servicios externos
- [ ] **v2.2.0** - Sistema de geolocalización en tiempo real

---

## 🏆 Logros del Proyecto

<div align="center">

| Métrica | Valor |
|---------|-------|
| 📦 **Componentes Reutilizables** | 30+ |
| 📄 **Páginas/Vistas** | 25+ |
| 🎨 **Temas Personalizables** | 3 |
| 🔐 **Roles de Usuario** | 2 |
| 📊 **Módulos Principales** | 7 |
| ⚡ **Tiempo de Carga** | < 2s |
| 📱 **Responsive** | 100% |
| ♿ **Accesibilidad** | WCAG AA |

</div>

---

<br />

**🚀 ERP Tracker Mobility**

*Optimizando la verificación domiciliaria con tecnología de vanguardia*

<br />

**Proyecto desarrollado con ❤️ por MetaSoft Solutions SAC para Tracker Mobility**

<br />

[![Made with Vue.js](https://img.shields.io/badge/Made%20with-Vue.js%203-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![UI Framework](https://img.shields.io/badge/UI-PrimeVue-41B883?style=for-the-badge)](https://primevue.org/)
[![Deployed on](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Built with](https://img.shields.io/badge/Built%20with-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

<br />

---

<sub>**© 2025 MetaSoft Solutions SAC** - Todos los derechos reservados | **Cliente:** Tracker Mobility</sub>

<sub>Versión 1.0.0 | Última actualización: 17 de Noviembre de 2025</sub>

</div>

