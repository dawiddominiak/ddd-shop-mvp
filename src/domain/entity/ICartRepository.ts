import * as Promise from "bluebird";
import { Cart } from "./Cart";

export interface ICartRepository {
    save(cart: Cart): Promise<any>;
    getNextId(): string;
}
