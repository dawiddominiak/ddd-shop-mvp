import * as Promise from "bluebird";
import { inject, injectable } from "inversify";
import { Cart } from "../../domain/entity/Cart";
import { ITransactionRepository } from "../../domain/entity/ITransactionRepository";
import { Transaction } from "../../domain/entity/Transaction";
import { User } from "../../domain/entity/User";
import { IProcessTransactionStrategy } from "../../domain/service/IProcessTransactionStrategy";
import { CreditCard } from "../../domain/valueObject/CreditCard";
import { TYPES } from "../../module/types";

@injectable()
export class MockedProcessTransactionStrategy implements IProcessTransactionStrategy {
    private transactionRepository: ITransactionRepository;

    constructor(@inject(TYPES.ITransactionRepository) transactionRepository: ITransactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public process(user: User, cart: Cart, creditCard: CreditCard) {
        // TODO: connection with payment gateway
        const transactionId = this.transactionRepository.getNextId();
        const transaction = new Transaction(transactionId, cart);

        return this
            .transactionRepository
            .save(transaction)
            .then(() => {
                return transaction;
            })
        ;
    }
}

