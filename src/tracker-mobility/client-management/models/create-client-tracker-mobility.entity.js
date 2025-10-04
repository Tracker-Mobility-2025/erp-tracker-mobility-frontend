

export class CreateClientTracker {

    constructor(
        {
            ruc = "",
            password = "",
            executiveName = "",
        } = {}
    ) {
        this.ruc = ruc;
        this.password = password;
        this.executiveName = executiveName;
    }

}