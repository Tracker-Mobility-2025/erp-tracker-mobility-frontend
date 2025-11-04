import { OrderResponse } from "../models/order-response.entity.js";

import http from "../../../shared/services/http-common.js";

export class OrderServiceRequest {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    /**
     * Crea una nueva orden de servicio
     * @param {Object} applicantCompanyData - Datos de la empresa solicitante
     * @param {Object} clientData - Datos del cliente
     * @returns {Promise} - Promise que resuelve con OrderResponse
     */

    create(applicantCompanyData, clientData) {
        // ========================================
        // 🔍 ANÁLISIS DE DATOS ENVIADOS AL BACKEND
        // ========================================
        console.log('\n%c═══════════════════════════════════════════════════════', 'color: #2196F3; font-weight: bold');
        console.log('%c📤 DATOS ENVIADOS AL BACKEND - ORDER REQUEST', 'color: #2196F3; font-size: 16px; font-weight: bold');
        console.log('%c═══════════════════════════════════════════════════════', 'color: #2196F3; font-weight: bold');

        console.log('\n%c📋 1. DATOS DE LA EMPRESA SOLICITANTE (applicantCompany):', 'color: #FF9800; font-weight: bold');
        console.table({
            'ID de Empresa': applicantCompanyData.applicantCompanyId || 'N/A',
            'Nombre de Empresa': applicantCompanyData.companyName || 'N/A',
            'RUC': applicantCompanyData.ruc || 'N/A',
            'Nombre Ejecutivo': applicantCompanyData.executiveName || 'N/A',
            'Email Corporativo': applicantCompanyData.corporateEmail || 'N/A',
            'Teléfono de Contacto': applicantCompanyData.contactPhoneNumber || 'N/A'
        });

        console.log('\n%c👤 2. DATOS DEL CLIENTE (client):', 'color: #4CAF50; font-weight: bold');
        console.table({
            'Nombre': clientData.name || 'N/A',
            'Apellido': clientData.lastName || 'N/A',
            'Tipo de Documento': clientData.documentType || 'N/A',
            'Número de Documento': clientData.documentNumber || 'N/A',
            'Teléfono': clientData.phoneNumber || 'N/A',
            'Es Inquilino': clientData.isTenant ? 'Sí' : 'No'
        });

        console.log('\n%c🏠 3. DATOS DE DOMICILIO:', 'color: #9C27B0; font-weight: bold');
        console.table({
            'Dirección': clientData.homeAddress || 'N/A',
            'Departamento': clientData.department || 'N/A',
            'Provincia': clientData.province || 'N/A',
            'Distrito': clientData.district || 'N/A',
            'Ubicación en Mapa': clientData.mapLocation || 'N/A'
        });

        if (clientData.isTenant) {
            console.log('\n%c🏢 4. DATOS DEL ARRENDADOR (Landlord):', 'color: #FF5722; font-weight: bold');
            console.table({
                'Nombre del Arrendador': clientData.landlordName || 'N/A',
                'Teléfono del Arrendador': clientData.landlordPhoneNumber || 'N/A'
            });
        } else {
            console.log('\n%c🏢 4. DATOS DEL ARRENDADOR:', 'color: #999; font-weight: bold');
            console.log('   ℹ️  No aplica - El cliente NO es inquilino');
        }

        console.log('\n%c📎 5. DOCUMENTOS ADJUNTOS:', 'color: #00BCD4; font-weight: bold');
        const documentosInfo = clientData.documents.map((doc, index) => ({
            '#': index + 1,
            'Tipo': doc.type,
            'Nombre de Archivo': doc.file?.name || 'N/A',
            'Tamaño': doc.file?.size ? `${(doc.file.size / 1024).toFixed(2)} KB` : 'N/A',
            'Tipo MIME': doc.file?.type || 'N/A',
            'Válido': doc.file?.name ? '✅' : '❌'
        }));
        console.table(documentosInfo);

        // Crear FormData para envío de archivos y datos
        const formData = new FormData();
        
        // Limpiar y validar datos antes de enviar
        const cleanedClientData = {
            ...clientData,
            // Limpiar números de teléfono (quitar espacios y guiones)
            phoneNumber: clientData.phoneNumber?.toString().replace(/[\s-]/g, '') || null,
            landlordPhoneNumber: clientData.landlordPhoneNumber?.toString().replace(/[\s-]/g, '') || null,
            // Truncar dirección a máximo 300 caracteres
            homeAddress: clientData.homeAddress?.substring(0, 300) || null,
            documents: clientData.documents.map(doc => ({
                type: doc.type
                // Archivo se envía por separado en FormData
            }))
        };
        
        // Preparar datos de la orden
        const orderData = {
            applicantCompany: applicantCompanyData,
            client: cleanedClientData
        };
        
        console.log('\n%c🔧 6. DATOS DESPUÉS DE LIMPIEZA:', 'color: #795548; font-weight: bold');
        console.log('   📞 Teléfono del cliente (limpio):', cleanedClientData.phoneNumber);
        console.log('   📞 Teléfono del arrendador (limpio):', cleanedClientData.landlordPhoneNumber);
        console.log('   📏 Longitud de dirección:', cleanedClientData.homeAddress?.length || 0, 'caracteres');

        console.log('\n%c📦 7. ESTRUCTURA JSON ENVIADA (order):', 'color: #E91E63; font-weight: bold');
        console.log(JSON.stringify(orderData, null, 2));

        // Añadir datos JSON como blob
        formData.append('order', new Blob([JSON.stringify(orderData)], { type: 'application/json' }));
        
        // Añadir archivos al FormData
        console.log('\n%c📤 8. ARCHIVOS AÑADIDOS A FormData:', 'color: #607D8B; font-weight: bold');
        clientData.documents.forEach((doc, index) => {
            if (doc.file?.name) {
                formData.append('files', doc.file);
                console.log(`   ✅ Archivo ${index + 1}: ${doc.file.name} (${doc.type})`);
            } else {
                console.warn(`   ⚠️  Documento ${index + 1} (${doc.type}) sin archivo válido:`, doc);
            }
        });

        console.log('\n%c🌐 9. ENDPOINT DE DESTINO:', 'color: #3F51B5; font-weight: bold');
        console.log('   🎯 URL:', this.resourceEndpoint);
        console.log('   📋 Método HTTP: POST');
        console.log('   📦 Content-Type: multipart/form-data (automático)');

        console.log('\n%c═══════════════════════════════════════════════════════', 'color: #2196F3; font-weight: bold');
        console.log('%c🚀 Enviando solicitud al backend...', 'color: #2196F3; font-weight: bold');
        console.log('%c═══════════════════════════════════════════════════════\n', 'color: #2196F3; font-weight: bold');

        // Enviar FormData - http-common.js maneja automáticamente el Content-Type
        return http.post(this.resourceEndpoint, formData)
            .then(response => {
                console.log('\n%c✅ RESPUESTA DEL BACKEND RECIBIDA:', 'color: #4CAF50; font-weight: bold; font-size: 14px');
                console.log('%c═══════════════════════════════════════════════════════', 'color: #4CAF50; font-weight: bold');
                console.log('   📊 Status:', response.status);
                console.log('   📋 Status Text:', response.statusText);
                console.log('   📦 Datos de respuesta:');
                console.log(response.data);
                console.log('%c═══════════════════════════════════════════════════════\n', 'color: #4CAF50; font-weight: bold');

                // Transformar respuesta usando el modelo
                response.data = new OrderResponse(response.data);
                return response;
            })
            .catch(error => {
                console.log('\n%c❌ ERROR EN LA PETICIÓN AL BACKEND:', 'color: #F44336; font-weight: bold; font-size: 14px');
                console.log('%c═══════════════════════════════════════════════════════', 'color: #F44336; font-weight: bold');
                console.error('   🔴 Error completo:', error);
                if (error.response) {
                    console.log('   📊 Status:', error.response.status);
                    console.log('   📋 Status Text:', error.response.statusText);
                    console.log('   📦 Datos del error:', error.response.data);
                }
                console.log('%c═══════════════════════════════════════════════════════\n', 'color: #F44336; font-weight: bold');
                throw error; // Re-lanzar para manejo en componente
            });
    }


}