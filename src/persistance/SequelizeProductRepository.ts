import * as Promise from "bluebird";
import { inject, injectable } from "inversify";
import * as _ from "lodash";
import * as UUID from "node-uuid";
import * as Sequelize from "sequelize";
import { IProductRepository } from "../domain/entity/IProductRepository";
import { Product } from "../domain/entity/Product";
import { User } from "../domain/entity/User";
import { TYPES } from "../module/types";
import { ISequelizeRepository } from "./ISequelizeRepository";
import { IFilePojo } from "./pojo/IFilePojo";
import { IProductPojo } from "./pojo/IProductPojo";
import { IUserPojo } from "./pojo/IUserPojo";

export interface IProductInstance extends Sequelize.Instance<IProductPojo>, IProductPojo { }

export interface IProductModel extends Sequelize.Model<IProductInstance, IProductPojo> { }

export interface IFileInstance extends Sequelize.Instance<IFilePojo>, IFilePojo { }

export interface IFileModel extends Sequelize.Model<IFileInstance, IFilePojo> { }

@injectable()
export class SequelizeProductRepository implements IProductRepository, ISequelizeRepository {
    private sequelize: Sequelize.Sequelize;
    private productModel: IProductModel;
    private fileModel: IFileModel;

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

        this.fileModel = this.sequelize.define<IFileInstance, IFilePojo>("File", {
            location: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING(255),
            },
        }, {
            tableName: "files",
            timestamps: true,

            // tslint:disable-next-line:object-literal-sort-keys
            createdAt: "created_at",
            updatedAt: "updated_at",
        });
        this.productModel.hasMany(this.fileModel, {
            as: "filesAvailableAfterPurchase",
            foreignKey: "product_id_of_paid_file",
        });
        this.productModel.hasMany(this.fileModel, {
            as: "demoFiles",
            foreignKey: "product_id_of_demo_file",
        });
    }

    public add(product: Product): Promise<any> {
        const tmp = product as any;
        const productPojo = tmp as IProductPojo;

        return Promise.resolve(
            this
                .productModel
                .create(productPojo, {
                    include: [{
                        model: this.fileModel,
                        // tslint:disable-next-line:object-literal-sort-keys
                        as: "demoFiles",
                    }, {
                        model: this.fileModel,
                        // tslint:disable-next-line:object-literal-sort-keys
                        as: "filesAvailableAfterPurchase",
                    }],
                }),
        );
    }

    /**
     * Lists products without files available only after purchase
     */
    public list(): Promise<Product[]> {
        return Promise.resolve(this.productModel.all({
            include: [{
                model: this.fileModel,
                // tslint:disable-next-line:object-literal-sort-keys
                as: "demoFiles",
            }],
        }))
            .map((productInstance: IProductInstance) => {
                const tmp = new Product(productInstance.uuid, productInstance.name, productInstance.price);
                _.merge(tmp, productInstance);

                return tmp;
            })
        ;
    }

    public listOwnedBy(user: User): Promise<Product[]> {
        return Promise.resolve([new Product("test", "test", 10.00)]);
    }

    public getNextId(): string {
        return UUID.v4();
    }
}
