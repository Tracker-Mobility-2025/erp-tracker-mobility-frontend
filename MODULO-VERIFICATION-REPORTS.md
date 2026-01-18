# Módulo 2: Home Verification Reports

## 📋 Descripción General

El módulo **2.home-verification-reports** es responsable de la gestión y visualización de reportes de verificación domiciliaria. Permite consultar reportes generados por verificadores, visualizar información detallada de cada verificación, y completar/actualizar la entrevista con el arrendador cuando sea necesaria.

**Arquitectura:** Clean Architecture (Hexagonal)
- **Presentation:** Vistas, componentes, composables, rutas
- **Application:** Store de Pinia, casos de uso
- **Domain:** Entidades, comandos, validadores, repositorios (interfaces)
- **Infrastructure:** APIs, repositorios HTTP, assemblers

---

## 🔄 Flujo Principal

### 1. Vista de Listado (reports-management.vue)

**Ruta:** `/verification-reports`

**Flujo de Carga:**
```
Usuario accede → onMounted() → store.fetchAll() 
→ repository.findAllSummaries() → api.getAllSummaries() 
→ GET /api/v1/web/reports → ReportSummaryAssembler.toEntities() 
→ Actualiza verificationReports[]
```

**Funcionalidades:**
- ✅ Listar todos los reportes resumidos
- ✅ Filtrar por estado del reporte (Conforme, Observado, Rechazado, Entrevista Arrendador)
- ✅ Búsqueda global por código, cliente, verificador
- ✅ Visualizar detalle de cada reporte (botón ver)
- ❌ No permite crear nuevos reportes (show-new="false")
- ❌ No permite eliminar reportes (show-delete="false")
- ❌ No permite exportar reportes desde listado (show-export="false")

**Columnas Mostradas:**
| Campo | Descripción | Ordenable |
|-------|-------------|-----------|
| reportCode | Código único del reporte | ✅ |
| orderCode | Código de la orden asociada | ✅ |
| clientName | Nombre del cliente verificado | ✅ |
| companyName | Empresa solicitante | ✅ |
| requestDate | Fecha de solicitud | ✅ |
| finalResult | Estado/Resultado final | ✅ |

---

### 2. Vista de Detalle (report-detail.vue)

**Ruta:** `/verification-reports/:reportId`

**Flujo de Carga:**
```
Usuario hace clic en "Ver detalles" 
→ Router navega a /verification-reports/:reportId 
→ onMounted() / watch(route.params.reportId) 
→ clearData() (limpieza síncrona)
→ loadData(reportId) 
→ store.fetchById(reportId)
→ repository.findById() → api.getById() 
→ GET /api/v1/web/reports/{reportId}
→ ReportAssembler.toEntity() 
→ report.value actualizado
```

**Componentes de Visualización:**

El reporte se divide en múltiples tarjetas informativas:

1. **VerificationInfoCard** - Información general de la verificación
   - Código de reporte, fecha de visita, verificador, ubicación

2. **ApplicantClientInfoCard** - Datos del cliente/solicitante
   - Nombre, apellido, tipo de documento, número de documento

3. **AddressInfoCard** - Información de dirección
   - Departamento, provincia, distrito, calle, dirección exacta

4. **InterviewDetailsCard** - Detalles de la residencia
   - Tipo de residencia (propia/alquilada/familiar)
   - Tipo de vivienda (casa/departamento/cuarto)
   - Condición, material, techo, amueblado

5. **ContactReferencesCard** - Referencias de contacto
   - Lista de referencias proporcionadas por el cliente

6. **LandlordInterviewCard** ⚠️ - Entrevista con el arrendador
   - Nombre del inquilino según arrendador
   - Casa propia, servicios pagados, puntualidad de pagos
   - Tiempo de arrendamiento, piso ocupado
   - Observaciones de la entrevista

7. **ObservationsCard** - Observaciones del verificador

8. **SummaryCard** - Resumen ejecutivo

9. **GlossaryCard** - Glosario de términos

10. **CasuisticsCard** - Casuística del reporte

11. **AnnexePhotographicRegistry** - Registro fotográfico
    - Galería de fotos/documentos adjuntos

---

## 🔒 Restricciones y Lógica de Uso

### Estado del Reporte: `finalResult`

El campo `finalResult` determina el comportamiento del reporte:

| Estado | Valor | Descripción | Restricciones |
|--------|-------|-------------|---------------|
| ✅ Conforme | `CONFORME` | Reporte aprobado sin observaciones | - Exportación PDF: **Permitida**<br>- Edición entrevista: **Bloqueada** |
| ⚠️ Observado | `OBSERVADO` | Reporte con observaciones menores | - Exportación PDF: **Permitida**<br>- Edición entrevista: **Bloqueada** |
| ❌ Rechazado | `RECHAZADO` | Reporte rechazado | - Exportación PDF: **Permitida**<br>- Edición entrevista: **Bloqueada** |
| 📝 Entrevista Arrendador Faltante | `ENTREVISTA_ARRENDADOR_FALTANTE` | Falta completar entrevista con arrendador | - Exportación PDF: **BLOQUEADA** ❌<br>- Edición entrevista: **Permitida** ✅ |

### Reglas de Negocio

#### 1. Exportación de PDF

**Condición para exportar:**
```javascript
canExportPDF = finalResult !== 'ENTREVISTA_ARRENDADOR_FALTANTE' && reportId !== null
```

**Comportamiento:**
- ✅ **Permitido:** Si el reporte tiene cualquier resultado final excepto `ENTREVISTA_ARRENDADOR_FALTANTE`
- ❌ **Bloqueado:** Si `finalResult === 'ENTREVISTA_ARRENDADOR_FALTANTE'`
- 💡 **Mensaje de error:** "Debe completar la entrevista con el arrendador antes de descargar el informe"

**Endpoint:**
```http
GET /api/v1/web/reports/{reportId}/download-url
Response: { reportId, reportUrl }
```

El backend genera una URL firmada para descargar el PDF del reporte.

#### 2. Edición de Entrevista con Arrendador

**Condición para editar:**
```javascript
canEditInterview = finalResult === 'ENTREVISTA_ARRENDADOR_FALTANTE'
isEditBlockedByFinalResult = finalResult !== null && finalResult !== 'ENTREVISTA_ARRENDADOR_FALTANTE'
```

**Comportamiento:**
- ✅ **Permitido:** Solo cuando `finalResult === 'ENTREVISTA_ARRENDADOR_FALTANTE'`
- ❌ **Bloqueado:** Cuando hay cualquier otro resultado final
- 🎨 **UI Visual:**
  - Header naranja (`bg-orange-500`) cuando `canEdit === true`
  - Header azul (`bg-primary`) cuando `canEdit === false`
  - Alerta visible cuando `showInterviewAlert === true`

**Campos Obligatorios para Actualizar Entrevista:**

| Campo | Nombre en UI | Tipo | Validación |
|-------|-------------|------|------------|
| `tenantName` | Nombre del inquilino | Text | Required, no vacío |
| `ownHouse` | Casa propia | Dropdown | Required (Sí/No/No especifica) |
| `serviceClientPays` | Servicio que paga el cliente | Text | Required, no vacío |
| `clientPaysPunctual` | ¿El cliente paga puntual? | Dropdown | Required (Sí/No/No especifica) |
| `clientRentalTime` | Tiempo de arrendamiento | Text | Required, no vacío |
| `clientFloorNumber` | Piso ocupado por el cliente | Text | Required, no vacío |
| `interviewObservation` | Observaciones de la entrevista | Textarea | Opcional |

**Flujo de Actualización:**
```
Usuario hace clic en "Editar" en LandlordInterviewCard
→ isEditing = true (modo edición)
→ Usuario completa campos del formulario
→ Usuario hace clic en "Guardar"
→ validateForm() → verifica campos obligatorios
→ emit('update-interview-details-requested', editForm)
→ report-detail.vue → handleUpdateInterviewDetailsRequested()
→ Limpia strings (convierte valores vacíos/null/'-' a '')
→ Obtiene orderId desde report.value.orderId
→ store.updateLandlordInterview(orderId, commandData)
→ Crea UpdateLandlordInterviewCommand (con validación automática)
→ repository.updateLandlordInterview(command)
→ api.updateLandlordInterview()
→ PATCH /api/v1/web/reports/order/{orderId}/landlord-interview
→ Backend actualiza entrevista y recalcula finalResult
→ store.fetchById() (recarga reporte completo)
→ report.value actualizado con nuevo finalResult
→ Si finalResult cambió, se desbloquea exportación PDF
```

**Endpoint:**
```http
PATCH /api/v1/web/reports/order/{orderId}/landlord-interview
Body: {
  "tenantName": "string",
  "ownHouse": "string",
  "serviceClientPays": "string",
  "clientPaysPunctual": "string",
  "clientRentalTime": "string",
  "clientFloorNumber": "string",
  "interviewObservation": "string"
}
```

#### 3. Envío de Email (Pendiente de Implementación)

**Estado:** ⚠️ TODO - No implementado

**Botón:** "Enviar Email" en toolbar de report-detail.vue

**Funcionalidad Planificada:**
- Abrir diálogo EmailSendDialog
- Permitir seleccionar destinatarios
- Adjuntar el PDF del reporte
- Enviar email con información del reporte

---

## 📊 Modelos de Datos

### ReportSummary (Listado)

```javascript
{
  reportId: number,
  reportCode: string,        // Código único del reporte
  orderCode: string,          // Código de la orden
  clientName: string,         // Nombre completo del cliente
  companyName: string,        // Nombre de la empresa solicitante
  requestDate: Date,          // Fecha de solicitud
  finalResult: string         // CONFORME | OBSERVADO | RECHAZADO | ENTREVISTA_ARRENDADOR_FALTANTE
}
```

### Report (Detalle Completo)

```javascript
{
  reportId: number,
  reportCode: string,
  orderId: number,            // ID de la orden (requerido para actualizar entrevista)
  verifierName: string,
  addressLocation: string,
  visitDate: Date,
  finalResult: string,
  
  // Empresa solicitante
  companyName: string,
  companyRuc: string,
  companyExecutiveName: string,
  requestDate: Date,
  
  // Cliente
  clientName: string,
  clientLastName: string,
  clientDocumentType: string,
  clientDocumentNumber: string,
  clientFullName: string,
  
  // Dirección
  addressDepartment: string,
  addressProvince: string,
  addressDistrict: string,
  addressStreet: string,
  exactClientAddress: string,
  
  // Objetos complejos
  residence: ResidenceInfo,     // Información de residencia
  dwelling: DwellingInfo,       // Información de vivienda
  zone: ZoneInfo,               // Información de la zona
  garage: GarageInfo,           // Información del garaje
  contactReferences: Array<ContactReference>,
  
  // Entrevista con arrendador
  landlordName: string,
  landlordPhoneNumber: string,
  interviewDetails: InterviewDetails,
  
  // Resumen y observaciones
  summary: Array<ReportItem>,
  observations: Array<ReportItem>,
  glossary: Array<ReportItem>,
  casuistics: Array<ReportItem>,
  
  // Anexos
  attachments: Array<ReportAttachment>
}
```

### ResidenceInfo

```javascript
{
  livesWith: string,           // Con quién vive
  isResident: boolean,         // Es residente
  timeLivingText: string       // Tiempo viviendo en el lugar
}
```

### DwellingInfo

```javascript
{
  residenceType: string,       // PROPIA | ALQUILADA | FAMILIAR
  dwellingType: string,        // CASA | DEPARTAMENTO | CUARTO | CONDOMINIO | QUINTA
  apartmentInformation: string,
  typeFurnished: string,       // AMOBLADA | NO_AMOBLADA | SEMIAMOBLADA
  roofType: string,            // CASA_TECHADA | CASA_NO_TECHADA
  dwellingMaterial: string,    // NOBLE | MADERA | PREFABRICADO | ADOBE | ESTERA | QUINCHA
  dwellingCondition: string,   // BUENO | REGULAR | EN_CONSTRUCCION | MODESTO | PRECARIA
  facadeColor: string
}
```

### ZoneInfo

```javascript
{
  zoneType: string,            // URBANA | COMERCIAL | INDUSTRIAL | POPULAR | PUEBLO_JOVEN | AAHH
  zoneCharacteristics: Array<string>,
  areaRisk: Array<string>,
  accessType: string
}
```

### InterviewDetails

```javascript
{
  clientNameAccordingToLandlord: string,      // Nombre del cliente según arrendador
  ownHome: string,                             // Casa propia (Sí/No/No especifica)
  servicesPaidByClient: string,                // Servicios pagados por el cliente
  isTheClientPunctualWithPayments: string,     // ¿Paga puntual? (Sí/No/No especifica)
  timeLivingAccordingToLandlord: string,       // Tiempo viviendo según arrendador
  floorOccupiedByClient: string,               // Piso ocupado
  interviewObservation: string                 // Observaciones adicionales
}
```

---

## 🎯 Casos de Uso Principales

### CU-01: Listar Reportes de Verificación

**Actor:** Usuario autenticado (cualquier rol)

**Precondiciones:**
- Usuario autenticado en el sistema

**Flujo Normal:**
1. Usuario accede a la ruta `/verification-reports`
2. Sistema carga todos los reportes resumidos desde el backend
3. Sistema muestra listado con DataManager
4. Usuario puede filtrar por estado
5. Usuario puede buscar por código, cliente o verificador

**Postcondiciones:**
- Lista de reportes cargada y visible

---

### CU-02: Visualizar Detalle de Reporte

**Actor:** Usuario autenticado

**Precondiciones:**
- Existe un reporte con el ID solicitado

**Flujo Normal:**
1. Usuario hace clic en "Ver detalles" en un reporte
2. Sistema navega a `/verification-reports/:reportId`
3. Sistema carga reporte completo desde el backend
4. Sistema muestra todas las tarjetas informativas
5. Sistema evalúa `finalResult` para determinar permisos:
   - Si `ENTREVISTA_ARRENDADOR_FALTANTE`: Habilita edición, bloquea exportación
   - Cualquier otro: Habilita exportación, bloquea edición

**Postcondiciones:**
- Reporte completo visible
- Permisos configurados según estado

---

### CU-03: Completar Entrevista con Arrendador

**Actor:** Usuario autenticado

**Precondiciones:**
- `finalResult === 'ENTREVISTA_ARRENDADOR_FALTANTE'`
- Existe `orderId` en el reporte

**Flujo Normal:**
1. Usuario visualiza alerta: "⚠️ Este reporte requiere completar la entrevista"
2. Usuario hace scroll a "Detalles de la entrevista" (LandlordInterviewCard)
3. Card muestra header naranja indicando edición disponible
4. Usuario hace clic en "Editar"
5. Sistema habilita formulario de edición
6. Usuario completa campos obligatorios:
   - Nombre del inquilino
   - Casa propia (Sí/No/No especifica)
   - Servicio que paga el cliente
   - ¿El cliente paga puntual? (Sí/No/No especifica)
   - Tiempo de arrendamiento
   - Piso ocupado por el cliente
   - Observaciones (opcional)
7. Usuario hace clic en "Guardar"
8. Sistema valida campos obligatorios
9. Si válido:
   - Sistema envía PATCH al backend
   - Backend actualiza entrevista
   - Backend recalcula `finalResult`
   - Sistema recarga reporte completo
   - Sistema muestra mensaje de éxito
   - Si `finalResult` cambió, se habilita exportación PDF

**Flujo Alternativo 8a - Validación Fallida:**
- Sistema muestra mensaje de error
- Sistema mantiene formulario abierto
- Usuario corrige campos

**Postcondiciones:**
- Entrevista actualizada en el backend
- `finalResult` actualizado
- Exportación PDF habilitada (si corresponde)

---

### CU-04: Exportar Reporte a PDF

**Actor:** Usuario autenticado

**Precondiciones:**
- `finalResult !== 'ENTREVISTA_ARRENDADOR_FALTANTE'`
- `reportId !== null`

**Flujo Normal:**
1. Usuario hace clic en "Exportar PDF" en toolbar
2. Sistema solicita URL de descarga al backend
3. Backend genera URL firmada para el PDF
4. Sistema abre URL en nueva pestaña
5. Navegador descarga el archivo PDF
6. Sistema muestra mensaje de éxito

**Flujo Alternativo 2a - Entrevista Faltante:**
- Sistema muestra mensaje de error
- Sistema indica que debe completar la entrevista primero
- Proceso termina

**Postcondiciones:**
- PDF descargado en el dispositivo del usuario

---

## 🔌 Endpoints del Backend

### GET /api/v1/web/reports

**Descripción:** Obtiene todos los reportes resumidos

**Respuesta:**
```json
[
  {
    "reportId": 1,
    "reportCode": "RPT-2024-001",
    "orderCode": "ORD-2024-001",
    "clientName": "Juan Pérez García",
    "companyName": "Banco XYZ",
    "requestDate": "2024-01-15T10:30:00",
    "finalResult": "CONFORME"
  }
]
```

---

### GET /api/v1/web/reports/{reportId}

**Descripción:** Obtiene un reporte completo por ID

**Parámetros:**
- `reportId` (path, number): ID del reporte

**Respuesta:**
```json
{
  "reportId": 1,
  "reportCode": "RPT-2024-001",
  "orderId": 123,
  "verifierName": "María González",
  "addressLocation": "Lima, Perú",
  "visitDate": "2024-01-15T14:00:00",
  "finalResult": "ENTREVISTA_ARRENDADOR_FALTANTE",
  "companyName": "Banco XYZ",
  "companyRuc": "20123456789",
  "companyExecutiveName": "Carlos Rodríguez",
  "requestDate": "2024-01-15T10:30:00",
  "clientName": "Juan",
  "clientLastName": "Pérez García",
  "clientDocumentType": "DNI",
  "clientDocumentNumber": "12345678",
  ...
}
```

---

### PATCH /api/v1/web/reports/order/{orderId}/landlord-interview

**Descripción:** Actualiza la entrevista con el arrendador

**Parámetros:**
- `orderId` (path, number): ID de la orden

**Body:**
```json
{
  "tenantName": "Juan Pérez",
  "ownHouse": "Sí",
  "serviceClientPays": "Agua, luz, internet",
  "clientPaysPunctual": "Sí",
  "clientRentalTime": "2 años",
  "clientFloorNumber": "3er piso",
  "interviewObservation": "Cliente muy responsable"
}
```

**Respuesta:**
```json
{
  "message": "Entrevista actualizada correctamente",
  "reportId": 1,
  "finalResult": "CONFORME"
}
```

**Notas:**
- Todos los campos son obligatorios excepto `interviewObservation`
- El backend recalcula `finalResult` después de guardar la entrevista
- Si la entrevista es válida, el estado puede cambiar a `CONFORME`, `OBSERVADO` o `RECHAZADO`

---

### GET /api/v1/web/reports/{reportId}/download-url

**Descripción:** Obtiene la URL de descarga del PDF del reporte

**Parámetros:**
- `reportId` (path, number): ID del reporte

**Respuesta:**
```json
{
  "reportId": 1,
  "reportUrl": "https://storage.example.com/reports/signed-url?token=abc123..."
}
```

**Notas:**
- Solo funciona si `finalResult !== 'ENTREVISTA_ARRENDADOR_FALTANTE'`
- La URL es firmada y tiene un tiempo de expiración
- Se abre en nueva pestaña para descargar el PDF

---

## 🎨 Componentes de Presentación

### DataManager

**Uso:** Lista de reportes en reports-management.vue

**Configuración:**
```vue
<data-manager
  :items="reportStore.verificationReports"
  :filtered-items="filteredReports"
  :columns="columns"
  :show-new="false"           // No permite crear
  :show-delete="false"        // No permite eliminar
  :show-export="false"        // No permite exportar desde listado
  :show-view-action="true"    // Muestra botón "Ver detalles"
  :show-edit-action="false"   // No muestra botón editar
  :show-delete-action="false" // No muestra botón eliminar
/>
```

---

### LandlordInterviewCard

**Props:**
- `clientNameAccordingToLandlord` (string): Nombre según arrendador
- `ownHome` (string): Casa propia
- `servicesPaidByClient` (string): Servicios pagados
- `isTheClientPunctualWithPayments` (string): Puntualidad de pagos
- `timeLivingAccordingToLandlord` (string): Tiempo de arrendamiento
- `floorOccupiedByClient` (string): Piso ocupado
- `interviewObservation` (string): Observaciones
- `canEdit` (boolean): Permite edición
- `blockedByFinalResult` (boolean): Bloqueado por resultado final

**Events:**
- `@update-interview-details-requested`: Emitido al guardar formulario

**Estados Visuales:**
- Header naranja cuando `canEdit === true`
- Header azul cuando `canEdit === false`
- Modo edición cuando `isEditing === true`

---

## 🚦 Estados del Reporte

### CONFORME ✅

**Significado:** Reporte aprobado sin observaciones

**Comportamiento:**
- Exportación PDF: **Habilitada**
- Edición entrevista: **Bloqueada**
- Color badge: Verde (success)

---

### OBSERVADO ⚠️

**Significado:** Reporte aprobado con observaciones menores

**Comportamiento:**
- Exportación PDF: **Habilitada**
- Edición entrevista: **Bloqueada**
- Color badge: Amarillo/Naranja (warning)

---

### RECHAZADO ❌

**Significado:** Reporte rechazado

**Comportamiento:**
- Exportación PDF: **Habilitada**
- Edición entrevista: **Bloqueada**
- Color badge: Rojo (danger)

---

### ENTREVISTA_ARRENDADOR_FALTANTE 📝

**Significado:** Falta completar la entrevista con el arrendador

**Comportamiento:**
- Exportación PDF: **BLOQUEADA** ❌
- Edición entrevista: **Habilitada** ✅
- Color badge: Azul (info)
- Alerta visible en la parte superior del detalle
- Header del LandlordInterviewCard en color naranja

**Acciones del Usuario:**
1. Completar formulario de entrevista
2. Guardar datos
3. Backend recalcula `finalResult`
4. Si válido, estado cambia a `CONFORME`, `OBSERVADO` o `RECHAZADO`
5. Se habilita exportación PDF

---

## ⚠️ Funcionalidades Pendientes (TODO)

### 1. Eliminación de Reportes

**Estado:** No implementado

**Nota en el código:**
```javascript
async function remove(id) {
  // TODO: Implementar eliminación cuando el API lo soporte
  verificationReports.value = verificationReports.value.filter(r => r.reportId !== id);
  // ...
}
```

---

### 2. Envío de Email

**Estado:** Implementación parcial (UI creada, backend pendiente)

**Componente:** EmailSendDialog

**Nota:** El botón existe en la UI pero la funcionalidad de envío no está conectada al backend

---

### 3. Visualizador de Fotos/Anexos

**Estado:** No implementado

**Nota en el código:**
```javascript
const handleViewPhoto = (photo) => {
  // TODO: Implementar visualizador de fotos
  console.log('Ver foto:', photo);
};
```

---

### 4. Descarga de Anexos Individuales

**Estado:** No implementado

**Nota:** Solo existe descarga del PDF completo del reporte

---

## 📝 Notas Técnicas

### Limpieza de Datos

El módulo implementa limpieza **síncrona** de datos al cambiar de vista:

```javascript
const clearData = () => {
  // Limpiar datos SÍNCRONAMENTE (inmediato, sin await)
  report.value = null;
  hasError.value = false;
  errorMessage.value = '';
  // ...
};
```

**Razón:** Evita mostrar datos stale (obsoletos) mientras se cargan los nuevos datos.

---

### Validación de Strings

El módulo limpia strings vacíos/null/'-' antes de enviar al backend:

```javascript
const cleanString = (v) => {
  if (v === null || v === undefined || v === '' || v === '-' || v === 'No especificado') {
    return '';
  }
  return String(v).trim();
};
```

---

### Assemblers

El módulo utiliza Assemblers para transformar DTOs del backend a entidades del dominio:

- **ReportSummaryAssembler:** Transforma arrays de reportes resumidos
- **ReportAssembler:** Transforma reporte completo con todas sus sub-entidades
- **UpdateLandlordInterviewCommandAssembler:** Transforma Command a DTO para el backend

---

## 🎯 Conclusión

El módulo **2.home-verification-reports** es un módulo de **solo lectura** con la excepción de actualizar la entrevista con el arrendador. Su propósito principal es:

✅ **Consultar** reportes generados
✅ **Visualizar** información detallada
✅ **Completar** entrevistas faltantes
✅ **Exportar** reportes a PDF (cuando estén completos)

**No permite:**
❌ Crear nuevos reportes (se crean desde módulo de verificación de órdenes)
❌ Eliminar reportes
❌ Editar información del reporte (excepto entrevista con arrendador)

**Flujo crítico:** Completar entrevista con arrendador para desbloquear exportación PDF.
