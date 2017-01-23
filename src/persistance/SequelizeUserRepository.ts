import * as bcrypt from "bcryptjs";
import * as Promise from "bluebird";
import { inject, injectable } from "inversify";
import * as Sequelize from "sequelize";
import { IUserRepository } from "../domain/entity/IUserRepository";
import { User } from "../domain/entity/User";
import { TYPES } from "../module/types";
import { ISequelizeRepository } from "./ISequelizeRepository";
import { IUserPojo } from "./pojo/IUserPojo";

export interface IUserInstance extends Sequelize.Instance<IUserPojo>, IUserPojo { }

export interface IUserModel extends Sequelize.Model<IUserInstance, IUserPojo> { }

@injectable()
export class SequelizeUserRepository implements IUserRepository, ISequelizeRepository {
    private sequelize: Sequelize.Sequelize;
    private userModel: IUserModel;

    constructor(@inject(TYPES.Sequelize) sequelize: Sequelize.Sequelize) { // TODO: logger
        this.sequelize = sequelize;

        this.userModel = this.sequelize.define<IUserInstance, IUserPojo>("User", {
            uuid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            // tslint:disable-next-line:object-literal-sort-keys
            email: {
                allowNull: false,
                type: Sequelize.STRING(128),
                unique: true,
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING(128),
            },
        },
        {
            tableName: "users",
            timestamps: true,
            // tslint:disable-next-line:object-literal-sort-keys
            createdAt: "created_at",
            updatedAt: "updated_at",
        });
    }

    public add(user: User, password: string): Promise<any> {
        const tmp = user as any;
        const userPojo = tmp as IUserPojo;

        return this
            .hashPassword(password)
            .then((hash) => {
                userPojo.password = password;

                return this.userModel.create(userPojo);
            })
        ;
    }

    public getById(uuid: string): Promise<User> {
        // TODO: change it
        const user = new User("test", "test");
        return Promise.resolve(user);
    }

    public checkPassword(user: User, password: string) {
    
    }

    private hashPassword(password: string): Promise<string> {
        const hash = Promise.promisify(bcrypt.hash);

        return hash(password, 8);
    }
}
