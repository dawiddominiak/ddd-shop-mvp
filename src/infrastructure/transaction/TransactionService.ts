import * as Promise from "bluebird";
import { inject, injectable, multiInject } from "inversify";
import { Cart } from "../../domain/entity/Cart";
import { Transaction } from "../../domain/entity/Transaction";
import { User } from "../../domain/entity/User";
import { IAfterTransactionTask } from "../../domain/service/IAfterTransactionTask";
import { IBeforeTransactionTask } from "../../domain/service/IBeforeTransactionTask";
import { IProcessTransactionStrategy } from "../../domain/service/IProcessTransactionStrategy";
import { ITransactionService } from "../../domain/service/ITransactionService";
import { CreditCard } from "../../domain/valueObject/CreditCard";
import { TYPES } from "../../module/types";

// TODO: saga pattern in the future!!!
@injectable()
export class TransactionService implements ITransactionService {
    private beforeTransactionTasks: IBeforeTransactionTask[];
    private afterTransactionTasks: IAfterTransactionTask[];
    private processTransactionStrategy: IProcessTransactionStrategy;

    /**
     * @param beforeTransactionTasks {IBeforeTransactionTask[]} tasks to be done before transaction execution:
     * security management, card validation.
     * @param processTransactionStrategy {IProcessTransactionStrategy} transaction strategy such as:
     * paylane gateway, payu gateway etc. 
     * @param afterTransactionTasks {IAfterTransactionTask[]} tasks to be done after transaction execution:
     * invoice management, send email etc.
     */
    constructor(
        @multiInject(TYPES.IBeforeTransactionTask) beforeTransactionTasks: IBeforeTransactionTask[],
        @inject(TYPES.IProcessTransactionStrategy) processTransactionStrategy: IProcessTransactionStrategy,
        @multiInject(TYPES.IAfterTransactionTask) afterTransactionTasks: IAfterTransactionTask[],
    ) {
        this.beforeTransactionTasks = beforeTransactionTasks;
        this.afterTransactionTasks = afterTransactionTasks;
        this.processTransactionStrategy = processTransactionStrategy;
    }

    public process(user: User, cart: Cart, creditCard: CreditCard): Promise<Transaction> {
        return Promise
            .all(
                this.beforeTransactionTasks.map((beforeTransactionTask) => {
                    return beforeTransactionTask.process(user, cart, creditCard);
                }),
            )
            .then(() => {
                return this.processTransactionStrategy.process(user, cart, creditCard);
            })
            .tap((transaction: Transaction) => {
                return Promise.all(
                    this.afterTransactionTasks.map((afterTransactionTask) => {
                        return afterTransactionTask.process(transaction);
                    }),
                );
            })
        ;
    }
}
