import * as Promise from "bluebird";
import { Cart } from "../entity/Cart";
import { Transaction } from "../entity/Transaction";
import { User } from "../entity/User";
import { CreditCard } from "../valueObject/CreditCard";

export interface IProcessTransactionStrategy {
    process(user: User, cart: Cart, creditCard: CreditCard): Promise<Transaction>;
}
