# Módulo: Solicitudes de Órdenes de Verificación (0.verification-order-requests)

## Descripción
Módulo implementado con Clean Architecture + DDD + Hexagonal Architecture para gestionar solicitudes de órdenes de verificación domiciliaria por parte de empresas solicitantes.

## Arquitectura

### Capas Implementadas

```
0.verification-order-requests/
├── domain/              # Lógica de negocio pura
│   ├── models/         # Entidades del dominio
│   └── ...
├── application/        # Casos de uso y orquestación
│   └── order-request.store.js
├── infrastructure/     # Implementaciones técnicas
│   ├── order-request.api.js
│   ├── order-request.assembler.js
│   └── ...
└── presentation/       # UI y componentes Vue
    ├── components/
    ├── composables/
    ├── views/
    └── order-request.routes.js
```

## Flujo de la Solicitud

### Paso 1: Datos del Cliente (1-customer-data.vue)
- **Campos:**
  - Nombre, apellido
  - Tipo y número de documento (DNI, PTP, CARNET_EXTRANJERIA)
  - Teléfono
  
- **Validaciones:**
  - DNI: 8 dígitos
  - PTP/CARNET_EXTRANJERIA: 9-12 dígitos
  - Teléfono: 9 dígitos, inicia con 9

### Paso 2: Datos de Domicilio (2-address-data.vue)
- **Campos:**
  - Departamento, provincia, distrito
  - Dirección completa (máx 300 caracteres)
  - URL de Google Maps
  - Foto de fachada
  
- **Validaciones:**
  - URL debe ser de Google Maps válida
  - Foto de fachada obligatoria (máx 5MB)
  - Dirección con límite de caracteres y toast de advertencia

### Paso 3: Documentación y Arrendador (3-support-docs-landlord.vue)
- **Documentación obligatoria:**
  - Recibo de servicio (Luz o Agua)
  - Documento de identidad
  
- **Sección condicional - Datos del arrendador (si es inquilino):**
  - Nombre completo
  - Teléfono (9 dígitos, inicia con 9)
  
- **Acciones:**
  - Botón "Cancelar" con diálogo de confirmación
  - Botón "Regresar" al paso anterior
  - Botón "Enviar solicitud" con diálogo de confirmación
  - Creación de orden con loading state

### Paso 4: Resumen (4-resumen.vue)
- **Muestra:**
  - Código de orden generado
  - Fecha de solicitud
  - Datos del solicitante (empresa)
  - Datos del cliente
  - Fotografía de fachada
  
- **Acciones:**
  - Imprimir resumen
  - Finalizar (reinicia formulario)

## Store (Pinia)

### Estado
```javascript
{
  currentStep: 1,
  totalSteps: 4,
  client: ClientFormData,
  applicantCompany: ApplicantCompanyData,
  orderResponse: null,
  loading: false,
  error: null
}
```

### Computed
- `progressPercentage`: Porcentaje de avance
- `stepTitle`: Título del paso actual

### Actions
- `fetchApplicantCompanyData(username)`: Carga datos de empresa
- `createOrder()`: Crea la orden con FormData
- `goToNextStep()`: Avanza al siguiente paso
- `goToPreviousStep()`: Retrocede un paso
- `goToStep(step)`: Va a un paso específico
- `resetForm()`: Reinicia formulario y localStorage
- `updateClientData(data)`: Actualiza datos del cliente

## Composable: use-order-request-form.js

Encapsula la lógica de navegación y manejo de eventos:

```javascript
const {
  initForm,        // Inicializa cargando datos de empresa
  handleNext,      // Avanza al siguiente paso
  handleBack,      // Retrocede un paso
  handleCancel,    // Cancela y reinicia
  handleComplete,  // Maneja orden completada
  handleFinish     // Finaliza desde resumen
} = useOrderRequestForm();
```

## API Service

### OrderRequestApi
```javascript
class OrderRequestApi {
  create(applicantCompany, client)      // Crea orden con FormData
  getAll()                              // Lista órdenes
  getById(id)                          // Obtiene orden por ID
  getApplicantCompanyByUsername(username) // Obtiene empresa
}
```

## Estilos

### PrimeFlex
Utiliza clases de utilidad de PrimeFlex para layout:
- `flex`, `grid`
- `gap-*`, `p-*`, `m-*`
- `justify-content-*`, `align-items-*`
- `col-*`, `md:col-*`, `lg:col-*`
- `text-*`, `font-*`
- `surface-*`, `border-*`, `shadow-*`

### Estilos Corporativos
Aplica variables CSS de `src/styles/theme-variables.css`:
- `--primary-*`: Colores primarios
- `--surface-*`: Fondos
- `--text-color-*`: Colores de texto

## Rutas

### Router Principal
```javascript
{
  path: 'applicant-company/order-requests',
  name: 'order-requests-module',
  children: orderRequestRoutes,
  meta: {
    title: 'Solicitudes de Orden',
    roles: ['COMPANY_EMPLOYEE']
  }
}
```

### Ruta del Formulario
```javascript
{
  path: 'new',
  name: 'order-request-form',
  component: OrderRequestForm,
  meta: {
    title: 'Nueva Solicitud de Orden',
    roles: ['COMPANY_EMPLOYEE']
  }
}
```

**URL completa:** `/app/applicant-company/order-requests/new`

## Persistencia

### LocalStorage
El store persiste automáticamente:
- `orderData`: Datos de la orden
- `orderNumber`: Código de orden generado
- `orderCreated`: Flag de orden creada exitosamente

## Componentes Compartidos Utilizados

- `FileUploader` (shared/components): Subida de archivos con validación
- PrimeVue components:
  - `InputText`, `InputMask`, `Textarea`
  - `Select`, `InputSwitch`
  - `Button`, `ProgressBar`, `Dialog`
  - `IconField`, `InputIcon`
  - `Toast` para notificaciones

## Migración desde Módulo Legacy

### Cambios Principales
1. **Options API → Composition API**
   - `data()` → `ref()` / `reactive()`
   - `computed` → `computed()`
   - `methods` → funciones normales
   - `inject/provide` → Pinia store

2. **Validaciones**
   - Sistema reactivo con `touched` states
   - `showValidation` flag para mostrar errores
   - Validaciones inline en computed properties

3. **Manejo de Archivos**
   - Computed properties con getter/setter
   - Integración con FileUploader component
   - Documentos en array con tipo y file/url

4. **Navegación**
   - Eventos `@next`, `@back`, `@cancel`, `@complete`, `@finish`
   - Composable centralizado para lógica
   - Scroll automático al cambiar de paso

5. **Estado Global**
   - Pinia store en lugar de provide/inject
   - Persistencia automática en localStorage
   - Loading states centralizados

## Testing

### Checklist de Pruebas
- [ ] Paso 1: Validaciones de documento y teléfono
- [ ] Paso 2: Validación de URL de Google Maps y límite de caracteres
- [ ] Paso 3: Toggle de inquilino y validaciones condicionales
- [ ] Paso 3: Carga de archivos y tipos MIME
- [ ] Paso 3: Diálogos de confirmación (cancelar/enviar)
- [ ] Paso 4: Muestra correcta de datos y foto
- [ ] Navegación: Avance/retroceso entre pasos
- [ ] Store: Persistencia y restauración desde localStorage
- [ ] API: Creación de orden con FormData
- [ ] Responsive: Diseño en móvil/tablet/desktop
- [ ] Impresión: Vista de impresión del resumen

## Mantenimiento

### Agregar un Nuevo Paso
1. Crear componente en `presentation/components/`
2. Agregar caso en `order-request-form.vue` template
3. Actualizar `totalSteps` en el store
4. Agregar título en `stepTitle` computed
5. Implementar emit de eventos (@next, @back)

### Agregar un Nuevo Campo
1. Agregar propiedad en `ClientFormData` (domain/models)
2. Actualizar assembler si es necesario
3. Agregar campo en componente de paso correspondiente
4. Implementar validación en `fieldErrors` computed
5. Actualizar touched states

### Modificar Validaciones
1. Actualizar computed `fieldErrors` en componente
2. Agregar/modificar validators en domain si es lógica de negocio
3. Actualizar mensajes de error para el usuario

## Recursos Externos

### Documentación Relevante
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia Store](https://pinia.vuejs.org/)
- [PrimeVue](https://primevue.org/)
- [PrimeFlex](https://primeflex.org/)

### Estilos Corporativos
- `src/styles/theme-variables.css`: Variables CSS
- `src/styles/ui-components.css`: Estilos de componentes
- `src/styles/primevue-overrides.css`: Overrides de PrimeVue

## Notas Técnicas

### FormData para Archivos
La API usa `FormData` para subir archivos:
```javascript
const formData = new FormData();
formData.append('applicantCompanyId', company.id);
formData.append('name', client.name);
client.documents.forEach((doc, index) => {
  formData.append(`documents[${index}].type`, doc.type);
  formData.append(`documents[${index}].file`, doc.file);
});
```

### Tipos de Documento
- `FOTO_FACHADA_VIVIENDA`: Foto de fachada
- `RECIBO_SERVICIO`: Recibo de luz/agua
- `DOCUMENTO_IDENTIDAD`: DNI/PTP/Carnet

**IMPORTANTE:** Los tipos antiguos se limpian automáticamente al montar componentes.

## Próximos Pasos (Futuro)

- [ ] Implementar vista de listado de solicitudes
- [ ] Agregar vista de detalle de solicitud
- [ ] Implementar edición de solicitudes en borrador
- [ ] Agregar filtros y búsqueda en listado
- [ ] Exportar solicitudes a PDF/Excel
- [ ] Notificaciones en tiempo real de cambios de estado
