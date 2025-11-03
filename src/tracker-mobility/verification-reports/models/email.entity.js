


export class Email {
    constructor({ from = null, to = null, subject = null, body = null, reportId = null } = {}) {
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.body = body;
        this.reportId = reportId;
    }
}
