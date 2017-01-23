export class File {
    private location: string;

    constructor(location: string) {
        this.location = location;
    }

    public getLocation() {
        return this.location;
    }
}
