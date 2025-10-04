
export class ClientTracker {

    constructor(
        {
            id = 0,
            ruc = "",
            executiveName = "",
            status = "ACTIVE"
        } = {}
    ) {
        this.id = id;
        this.ruc = ruc;
        this.executiveName = executiveName;
        this.status = status;
    }

}