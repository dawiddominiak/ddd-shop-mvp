export class User {
    private uuid: string;
    private nick: string;

    constructor(uuid: string, nick: string) {
        this.uuid = uuid;
        this.nick = nick;
    }

    public getUuid(): string {
        return this.uuid;
    }
}
