
export class Verifier {
    constructor(
        {
            id = null,
            name = '',
            lastname = '',
            phone = '',
            status = 'Activo',
            email = '',
            password = '',
            agenda = '',
            assignedOrders = [] // Array of order IDs
        }
    )
    {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.phone = phone;
        this.status = status;
        this.email = email;
        this.password = password;
        this.agenda = agenda;
        this.assignedOrders = assignedOrders; // Array of order IDs
    }
}
