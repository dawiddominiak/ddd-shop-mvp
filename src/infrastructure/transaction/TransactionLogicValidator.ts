import * as Promise from "bluebird";
import { inject, injectable } from "inversify";
import { Cart } from "../../domain/entity/Cart";
import { User } from "../../domain/entity/User";
import { IBeforeTransactionTask } from "../../domain/service/IBeforeTransactionTask";
import { CreditCard } from "../../domain/valueObject/CreditCard";

@injectable()
export class TransactionLogicValidator implements IBeforeTransactionTask {
    public process(user: User, cart: Cart, creditCard: CreditCard) {
        // TODO: check if user owns any product to prevent buy it twice (?)
        return Promise.resolve();
    }
}
