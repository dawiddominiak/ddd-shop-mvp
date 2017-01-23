import * as Promise from "bluebird";
import { inject, injectable } from "inversify";
import * as _ from "lodash";
import * as UUID from "node-uuid";
import * as Sequelize from "sequelize";
import { Cart } from "../domain/entity/Cart";
import { ICartRepository } from "../domain/entity/ICartRepository";
import { TYPES } from "../module/types";
import { ISequelizeRepository } from "./ISequelizeRepository";
import { ICartPojo } from "./pojo/ICartPojo";
import { IProductModel, SequelizeProductRepository } from "./SequelizeProductRepository";
import { IUserModel, SequelizeUserRepository } from "./SequelizeUserRepository";

export interface ICartInstance extends Sequelize.Instance<ICartPojo>, ICartPojo { }

export interface ICartModel extends Sequelize.Model<ICartInstance, ICartPojo> { }

@injectable()
export class SequelizeCartRepository implements ICartRepository, ISequelizeRepository {
    private cartModel: ICartModel;
    private productModel: IProductModel;
    private userModel: IUserModel;
    private sequelize: Sequelize.Sequelize;

    constructor(
        @inject(TYPES.Sequelize) sequelize: Sequelize.Sequelize,
        @inject(TYPES.IProductRepository) productRepository: SequelizeProductRepository,
        @inject(TYPES.IUserRepository) userRepository: SequelizeUserRepository,
    ) {
        this.sequelize = sequelize;

        this.productModel = productRepository.getModel();
        this.userModel = userRepository.getModel();
        this.cartModel = this.sequelize.define<ICartInstance, ICartPojo>("Cart", {
            uuid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
        }, {
            tableName: "carts",
            timestamps: true,
            // tslint:disable-next-line:object-literal-sort-keys
            createdAt: "created_at",
            updatedAt: "updated_at",
        });

        this.cartModel.belongsToMany(this.productModel, {
            as: "products",
            through: "cart_product",
        });
        this.productModel.belongsToMany(this.cartModel, {
            through: "cart_product",
        });

        this.userModel.hasMany(this.cartModel, {
            as: "carts",
        });
    }

    public save(cart: Cart): Promise<any> {
        const tmp = cart as any;
        const cartPojo = tmp as ICartPojo;

        return Promise.resolve(
            this
                .cartModel
                .create(cartPojo, {
                    include: [{
                        model: this.productModel,
                        // tslint:disable-next-line:object-literal-sort-keys
                        as: "products",
                    }],
                }),
        );
    }

    public getNextId() {
        return UUID.v4();
    }

    public getModel() {
        return this.cartModel;
    }
}

