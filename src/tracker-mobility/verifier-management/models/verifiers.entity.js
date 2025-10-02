

export class Verifier {
    constructor(
        {
            id = null,
            email = null,
            role = null,
            status = null,
            name = null,
            lastName = null,
            phoneNumber = null,
            agenda = null,
            adminId = null
        }
    )
    {
        this.id = id;
        this.email = email;
        this.role = role;
        this.status = status;
        this.name = name;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.agenda = agenda;
        this.adminId = adminId;
    }
}

