import { Cart } from "./Cart";

export class Transaction {
    private uuid: string;
    private cart: Cart;
    // TODO: transaction states(?)

    constructor(uuid: string, cart: Cart) {
        this.uuid = uuid;
        this.cart = cart;
        this.cart.bindTransaction(this);
    }

    public getCart(): Cart {
        return this.cart;
    }
}
