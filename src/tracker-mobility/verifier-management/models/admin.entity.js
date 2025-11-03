
export class Admin {
    constructor({
        id = 0,
        email = '',
        role = '',
        status = 'ACTIVE',
        name = '',
        lastName = '',
        phoneNumber = ''
    }) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.status = status;
        this.name = name;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
    }
}