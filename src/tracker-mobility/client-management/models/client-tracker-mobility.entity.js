
export class ClientTracker {

    constructor(
        {
            id = null,
            ruc = "",
            executiveName = "",
            status = "",
        } = {}
    ) {
        this.id = id;
        this.ruc = ruc;
        this.executiveName = executiveName;
        this.status = status;
    }

}