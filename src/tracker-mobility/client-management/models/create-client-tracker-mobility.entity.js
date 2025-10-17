

export class CreateClientTracker {

    constructor(
        {
            ruc = "",
            password = "",
            companyName = "",
        } = {}
    ) {
        this.ruc = ruc;
        this.password = password;
        this.companyName = companyName;
    }

}