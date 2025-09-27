
export class OrderServiceRequest {

    constructor() {

        this.petitionerData = {
            ruc: "",
            razonSocial: "",
            nombreEjecutivo: "",
            correoCorporativo: "",
            numeroContacto: ""
        };

        this.clientData = {
            nombres: "",
            apellidos: "",
            tipoDocumento: "",
            numeroDocumento: "",
            numeroContacto: ""
        };

        this.addressData = {
            departamento: "",
            provincia: "",
            distrito: "",
            direccionCompleta: "",
            ubicacionGoogleMaps: "",
            fotografiaDomicilio: null // File object para el componente FileUploader
        };

        this.supportDocs = {
            reciboServicio: null,      // File object para el componente FileUploader
            documentoIdentidad: null,  // File object para el componente FileUploader
            esInquilino: false
        };

        this.landlordData = {
            nombres: "",
            numeroContacto: ""
        };
    }
}