
export class CreateVerifier {
    constructor(
        {
            email = null,
            password = null,
            name = null,
            lastName = null,
            phoneNumber = null,
            agenda = null,
            adminId = null
        }
    )
    {
        this.email = email;
        this.password = password;
        this.name = name;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.agenda = agenda;
        this.adminId = adminId;
    }
}
