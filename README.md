# 🚀 ERP Tracker Mobility Frontend

Una aplicación web moderna para la gestión de reportes, órdenes de servicio y verificaciones de movilidad empresarial. Construida con **Vue.js 3**, **PrimeVue** y **PrimeFlex** para ofrecer una experiencia de usuario intuitiva y profesional.

## 📋 Descripción del Proyecto

**ERP Tracker Mobility Frontend** es la interfaz de usuario de un sistema integral de gestión empresarial especializado en:

- 📊 **Gestión de Reportes**: Creación, edición y seguimiento de reportes de verificación
- 📋 **Órdenes de Servicio**: Administración completa del ciclo de vida de órdenes
- 👥 **Gestión de Verificadores**: Control de personal verificador y asignaciones
- 🔐 **Sistema de Seguridad**: Autenticación y autorización de usuarios
- 📱 **Diseño Responsive**: Optimizado para dispositivos móviles y de escritorio

## 🛠️ Tecnologías Utilizadas

### Frontend Core
- **Vue.js 3** - Framework principal de JavaScript
- **Vue Router** - Navegación SPA (Single Page Application)
- **Vite** - Herramienta de construcción y desarrollo rápido

### UI/UX
- **PrimeVue** - Biblioteca de componentes UI empresariales
- **PrimeFlex** - Framework CSS utilitario para layouts responsive
- **PrimeIcons** - Iconografía consistente y profesional

### Características del Código
- **Composition API** - API moderna de Vue.js 3
- **Componentes Reutilizables** - Arquitectura modular y escalable
- **TypeScript Ready** - Preparado para migración a TypeScript

## 🏗️ Arquitectura del Proyecto

```
src/
├── 📁 assets/                    # Recursos estáticos
├── 📁 public/                    # Componentes públicos
│   ├── 📁 components/            # Componentes de layout
│   └── 📁 pages/                 # Páginas principales
├── 📁 router/                    # Configuración de rutas
├── 📁 shared/                    # Recursos compartidos
│   ├── 📁 components/            # Componentes reutilizables
│   └── 📁 services/              # Servicios compartidos
└── 📁 tracker-mobility/          # Módulos principales
    ├── 📁 security/              # Módulo de seguridad
    ├── 📁 service-orders/        # Órdenes de servicio
    ├── 📁 verification-reports/  # Reportes de verificación
    └── 📁 verifier-management/   # Gestión de verificadores
```

### Módulos Principales

#### 🔐 **Security (Seguridad)**
- Autenticación de usuarios
- Gestión de sesiones
- Control de acceso y permisos
- Perfiles de usuario

#### 📋 **Service Orders (Órdenes de Servicio)**
- Creación y edición de órdenes
- Seguimiento de estado
- Asignación de verificadores
- Historial de cambios

#### 📊 **Verification Reports (Reportes de Verificación)**
- Generación de reportes
- Validación de datos
- Exportación en múltiples formatos
- Dashboard de métricas

#### 👥 **Verifier Management (Gestión de Verificadores)**
- Administración de verificadores
- Asignación de tareas
- Control de disponibilidad
- Evaluación de desempeño

