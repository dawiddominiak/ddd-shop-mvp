import { User } from "../domain/entity/User";
import * as Promise from "bluebird";
import { inject, injectable } from "inversify";
import * as Sequelize from "sequelize";
import { IProductRepository } from "../domain/entity/IProductRepository";
import { Product } from "../domain/entity/Product";
import { TYPES } from "../module/types";
import { ISequelizeRepository } from "./ISequelizeRepository";
import { IProductPojo } from "./pojo/IProductPojo";
import { IUserPojo } from "./pojo/IUserPojo";

export interface IProductInstance extends Sequelize.Instance<IProductPojo>, IProductPojo { }

export interface IProductModel extends Sequelize.Model<IProductInstance, IProductPojo> { }

export class SequalizeProductRepository implements IProductRepository, ISequelizeRepository {
    private sequelize: Sequelize.Sequelize;
    private productModel: IProductModel;

    constructor(@inject(TYPES.Sequelize) sequelize: Sequelize.Sequelize) {
        this.sequelize = sequelize;

        this.productModel = this.sequelize.define<IProductInstance, IProductPojo>("Product", {
            uuid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            // tslint:disable-next-line:object-literal-sort-keys
            name: {
                allowNull: false,
                type: Sequelize.STRING(128),
            },
            price: {
                allowNull: false,
                type: Sequelize.DECIMAL({
                    precision: 10,
                    scale: 2,
                }),
            },
            description: {
                allowNull: true,
                type: Sequelize.TEXT(),
            },
        }, {
            tableName: "products",
            timestamps: true,
            // tslint:disable-next-line:object-literal-sort-keys
            createdAt: "created_at",
            updatedAt: "updated_at",
        });
    }

    public add(product: Product): Promise<any> {
        const tmp = product as any;
        const productPojo = tmp as IProductPojo;

        return Promise.resolve(this.productModel.create(productPojo));
    }

    public list(): Promise<Product[]> {
        return Promise.resolve(this.productModel.all())
            .map((productInstance) => {
                return productInstance as Product;
            })
        ;
    }

    public listOwnedBy(user: User): Promise<Product[]> {
        return Promise.resolve([new Product("test", "test", 10.00)]);
    }
}
