import axios from "axios";

const http = axios.create({baseURL: "https://web-service-tracker-mobility-production.up.railway.app/api/v1"});

export class OrderService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    /**
     * Transforma los datos del frontend al formato exacto esperado por el backend
     * Basado en el HTML de ejemplo proporcionado
     */
    transformToBackendFormat(frontendData) {
        console.log('🔄 Transformando datos del frontend:', frontendData);
        
        // Validar que tenemos los datos básicos
        if (!frontendData) {
            throw new Error('frontendData es requerido');
        }

        // Crear el objeto order según el formato del HTML
        const orderData = {
            adminId: 1, // TODO: Obtener del usuario autenticado
            applicantCompany: {
                companyName: frontendData.petitionerData?.razonSocial || '',
                executiveName: frontendData.petitionerData?.nombreEjecutivo || '',
                ruc: frontendData.petitionerData?.ruc || '',
                corporateEmail: frontendData.petitionerData?.correoCorporativo || '',
                contactPhoneNumber: this.cleanPhoneNumber(frontendData.petitionerData?.numeroContacto)
            },
            client: {
                name: frontendData.clientData?.nombresCompletos || '',
                lastName: frontendData.clientData?.apellidosCompletos || '',
                phoneNumber: this.cleanPhoneNumber(frontendData.clientData?.numeroContacto),
                documentNumber: frontendData.clientData?.numeroDocumento || '',
                documentType: this.mapDocumentType(frontendData.clientData?.tipoDocumento),
                isTenant: Boolean(frontendData.supportDocs?.esInquilino),
                landlordName: frontendData.landlordData?.nombres || "",
                landlordPhoneNumber: this.cleanPhoneNumber(frontendData.landlordData?.numeroContacto),
                department: frontendData.addressData?.departamento || '',
                province: frontendData.addressData?.provincia || '',
                district: frontendData.addressData?.distrito || '',
                homeAddress: frontendData.addressData?.direccionCompleta || '',
                mapLocation: frontendData.addressData?.ubicacionGoogleMaps || '',
                documents: []
            }
        };

        // Crear array de archivos y metadatos de documentos
        const files = [];
        const documents = [];

        console.log('📁 Verificando archivos en frontendData:');
        console.log('- Recibo servicio:', frontendData.supportDocs?.reciboServicio);
        console.log('- Documento identidad:', frontendData.supportDocs?.documentoIdentidad);
        console.log('- Foto fachada:', frontendData.addressData?.fotografiaDomicilio);

        // Recibo de servicio
        if (frontendData.supportDocs?.reciboServicio && frontendData.supportDocs.reciboServicio instanceof File) {
            files.push(frontendData.supportDocs.reciboServicio);
            documents.push({ type: "RECIBO_LUZ" });
            console.log('✅ Agregado: Recibo de servicio');
        } else {
            console.log('⚠️ Recibo de servicio no es un archivo válido');
        }

        // Documento de identidad
        if (frontendData.supportDocs?.documentoIdentidad && frontendData.supportDocs.documentoIdentidad instanceof File) {
            files.push(frontendData.supportDocs.documentoIdentidad);
            documents.push({ 
                type: this.mapDocumentType(frontendData.clientData?.tipoDocumento) 
            });
            console.log('✅ Agregado: Documento de identidad');
        } else {
            console.log('⚠️ Documento de identidad no es un archivo válido');
        }

        // Foto de fachada
        if (frontendData.addressData?.fotografiaDomicilio && frontendData.addressData.fotografiaDomicilio instanceof File) {
            files.push(frontendData.addressData.fotografiaDomicilio);
            documents.push({ type: "FOTO_FACHADA_VIVIENDA" });
            console.log('✅ Agregado: Foto de fachada');
        } else {
            console.log('⚠️ Foto de fachada no es un archivo válido');
        }

        // Agregar los documentos al objeto order
        orderData.client.documents = documents;

        console.log('📋 Resumen:', {
            totalFiles: files.length,
            totalDocuments: documents.length,
            documentTypes: documents.map(d => d.type)
        });

        return { orderData, files };
    }

    /**
     * Mapea los tipos de documento del frontend al backend
     */
    mapDocumentType(frontendType) {
        const mapping = {
            'DNI': 'DNI',
            'CE': 'CARNET_EXTRANJERIA',
            'PTP': 'PTP'
        };
        return mapping[frontendType] || 'DNI';
    }

    /**
     * Limpia el número de teléfono eliminando espacios y caracteres especiales
     * El backend requiere máximo 9 caracteres
     */
    cleanPhoneNumber(phoneNumber) {
        if (!phoneNumber) return '';
        
        // Eliminar espacios, guiones y otros caracteres no numéricos
        const cleaned = String(phoneNumber).replace(/[^\d]/g, '');
        
        // Truncar a 9 caracteres máximo (requerimiento del backend)
        const result = cleaned.slice(0, 9);
        
        console.log(`📱 Teléfono limpiado: "${phoneNumber}" → "${result}"`);
        
        return result;
    }

    /**
     * Valida los datos antes de enviar al backend
     */
    validateOrderData(orderData, files) {
        const errors = [];

        // Validar adminId
        if (!orderData.adminId || typeof orderData.adminId !== 'number') {
            errors.push('adminId debe ser un número válido');
        }

        // Validar applicantCompany
        if (!orderData.applicantCompany) {
            errors.push('applicantCompany es requerido');
        } else {
            const required = ['companyName', 'executiveName', 'ruc', 'corporateEmail', 'contactPhoneNumber'];
            required.forEach(field => {
                if (!orderData.applicantCompany[field]) {
                    errors.push(`applicantCompany.${field} es requerido`);
                }
            });
            
            // Validar formato de teléfono de empresa
            if (orderData.applicantCompany.contactPhoneNumber && orderData.applicantCompany.contactPhoneNumber.length > 9) {
                errors.push(`applicantCompany.contactPhoneNumber no puede tener más de 9 caracteres (actual: ${orderData.applicantCompany.contactPhoneNumber.length})`);
            }
        }

        // Validar client
        if (!orderData.client) {
            errors.push('client es requerido');
        } else {
            const required = ['name', 'lastName', 'phoneNumber', 'documentNumber', 'documentType', 'department', 'province', 'district', 'homeAddress'];
            required.forEach(field => {
                if (!orderData.client[field]) {
                    errors.push(`client.${field} es requerido`);
                }
            });
            
            // Validar formato de teléfono de cliente
            if (orderData.client.phoneNumber && orderData.client.phoneNumber.length > 9) {
                errors.push(`client.phoneNumber no puede tener más de 9 caracteres (actual: ${orderData.client.phoneNumber.length})`);
            }
            
            // Validar formato de teléfono de arrendador si existe
            if (orderData.client.landlordPhoneNumber && orderData.client.landlordPhoneNumber.length > 9) {
                errors.push(`client.landlordPhoneNumber no puede tener más de 9 caracteres (actual: ${orderData.client.landlordPhoneNumber.length})`);
            }
        }

        // Validar archivos
        if (files.length === 0) {
            errors.push('Se requiere al menos un archivo');
        }

        files.forEach((file, index) => {
            if (!(file instanceof File)) {
                errors.push(`El archivo ${index + 1} no es un objeto File válido`);
            }
        });

        // Validar documents array
        if (!orderData.client?.documents || orderData.client.documents.length === 0) {
            errors.push('Se requiere al menos un documento en client.documents');
        }

        if (orderData.client?.documents && files.length !== orderData.client.documents.length) {
            errors.push(`Número de archivos (${files.length}) no coincide con número de documentos (${orderData.client.documents.length})`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Crea una nueva orden usando el formato exacto del backend
     */
    async create(frontendData) {
        const { orderData, files } = this.transformToBackendFormat(frontendData);

        // Crear FormData exactamente como en el HTML
        const formData = new FormData();
        
        // Agregar el objeto order como Blob JSON (igual que en el HTML)
        formData.append('order', new Blob([JSON.stringify(orderData)], { type: 'application/json' }));

        // Agregar archivos con el mismo nombre 'files' (igual que en el HTML)
        files.forEach(file => {
            if (file instanceof File) {
                formData.append('files', file);
            }
        });

        // Debug detallado (siempre activo para diagnosticar el error)
        console.log('🚀 === DEBUG: ENVIANDO AL BACKEND ===');
        console.log('📋 Order data:', JSON.stringify(orderData, null, 2));
        console.log('📁 Files count:', files.length);
        files.forEach((file, index) => {
            console.log(`📁 File ${index + 1}:`, {
                name: file.name,
                size: file.size,
                type: file.type,
                isFile: file instanceof File
            });
        });
        
        // Validar que tenemos los datos mínimos
        const validation = this.validateOrderData(orderData, files);
        if (!validation.isValid) {
            console.error('❌ Datos inválidos:', validation.errors);
            throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
        }
        
        // Mostrar contenido del FormData
        console.log('📤 FormData entries:');
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: [FILE] ${value.name} (${value.size} bytes, type: ${value.type})`);
            } else if (value instanceof Blob) {
                console.log(`${key}: [BLOB] ${value.size} bytes`);
                // Leer el contenido del Blob para verificar
                value.text().then(text => {
                    console.log(`${key} content:`, text);
                });
            } else {
                console.log(`${key}: ${value}`);
            }
        }
        console.log('=== FIN DEBUG ===');

        try {
            const response = await http.post(this.resourceEndpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 60000 // Timeout de 60 segundos para archivos grandes
            });

            console.log('✅ Orden creada exitosamente:', response.data);
            return response;

        } catch (error) {
            console.error('❌ Error al crear orden:', error);
            
            // Debug detallado del error
            if (error.response) {
                console.error('📋 Error Response Status:', error.response.status);
                console.error('📋 Error Response Data:', error.response.data);
                console.error('📋 Error Response Headers:', error.response.headers);
                
                // Intentar obtener mensaje de error más específico
                let errorMessage = 'Error desconocido';
                if (error.response.data) {
                    if (typeof error.response.data === 'string') {
                        errorMessage = error.response.data;
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response.data.error) {
                        errorMessage = error.response.data.error;
                    } else {
                        errorMessage = JSON.stringify(error.response.data);
                    }
                }
                
                throw new Error(`Error del servidor (${error.response.status}): ${errorMessage}`);
            } else if (error.request) {
                console.error('📋 No response received:', error.request);
                throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
            } else {
                console.error('📋 Request setup error:', error.message);
                throw new Error(`Error en la solicitud: ${error.message}`);
            }
        }
    }

}