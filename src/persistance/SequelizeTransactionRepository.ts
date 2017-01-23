import * as Promise from "bluebird";
import { inject, injectable } from "inversify";
import * as _ from "lodash";
import * as UUID from "node-uuid";
import * as Sequelize from "sequelize";
import { ITransactionRepository } from "../domain/entity/ITransactionRepository";
import { Transaction } from "../domain/entity/Transaction";
import { TYPES } from "../module/types";
import { ISequelizeRepository } from "./ISequelizeRepository";
import { ICartPojo } from "./pojo/ICartPojo";
import { ITransactionPojo } from "./pojo/ITransactionPojo";
import { ICartModel, SequelizeCartRepository } from "./SequelizeCartRepository";

export interface ITransactionInstance extends Sequelize.Instance<ITransactionPojo>, ITransactionPojo { }

export interface ITransactionModel extends Sequelize.Model<ITransactionInstance, ITransactionPojo> { }

@injectable()
export class SequelizeTransactionRepository implements ITransactionRepository, ISequelizeRepository {
    private transactionModel: ITransactionModel;
    private cartModel: ICartModel;
    private sequelize: Sequelize.Sequelize;

    constructor(
        @inject(TYPES.Sequelize) sequelize: Sequelize.Sequelize,
        @inject(TYPES.ICartRepository) cartRepository: SequelizeCartRepository,
    ) {
        this.sequelize = sequelize;
        this.cartModel = cartRepository.getModel();

        this.transactionModel = this.sequelize.define<ITransactionInstance, ICartPojo>("Transaction", {
            uuid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
        }, {
            tableName: "transactions",
            timestamps: true,
            // tslint:disable-next-line:object-literal-sort-keys
            createdAt: "created_at",
            updatedAt: "updated_at",
        });

        this.transactionModel.belongsTo(this.cartModel);
    }

    public save(transaction: Transaction): Promise<any> {
        const tmp = transaction as any;
        const transactionPojo = tmp as ITransactionPojo;

        return Promise.resolve(
            this
                .transactionModel
                .create(transactionPojo, {
                    include: [{
                        model: this.cartModel,
                    }],
                }),
        );
    }

    public getNextId() {
        return UUID.v4();
    }
}
