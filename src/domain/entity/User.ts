export class User {
    private uuid: string;
    private email: string;

    constructor(uuid: string, email: string) {
        this.uuid = uuid;
        this.email = email;
    }

    public getUuid(): string {
        return this.uuid;
    }

    public getEmail(): string {
        return this.email;
    }
}
