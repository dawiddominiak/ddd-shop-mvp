import * as bcrypt from "bcryptjs";
import * as Promise from "bluebird";
import { inject, injectable } from "inversify";
import * as _ from "lodash";
import * as UUID from "node-uuid";
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
                userPojo.password = hash;

                return this.userModel.create(userPojo);
            })
        ;
    }

    public getByEmail(email: string): Promise<User> {
        // TODO: change it
        const user = new User("test", "test");
        return Promise.resolve(user);
    }

    public getById(uuid: string): Promise<User> {
        return Promise.resolve(
            this.userModel.findOne({
                where: {
                    uuid,
                },
            },
        ))
            .then((user) => {
                if (!user) {
                    throw new Error ("User does not exist or password is incorrect."); // TODO: child domain error
                }

                return user.get({plain: true}) as any;
            })
            .then((userPlain) => {
                const tmp = new User(userPlain.uuid, userPlain.email);
                _.merge(tmp, userPlain);

                return tmp;
            })
        ;
    }

    public login(email: string, password: string): Promise<User> {
        // TODO: change it
        return this
            .hashPassword(password)
            .then((hash) => {
                return this.userModel.findOne({
                    where: {
                        email,
                    },
                })
                .then((user) => {
                    if (!user) {
                        throw new Error ("User does not exist."); // TODO: child domain error
                    }

                    const userPlain = user.get({plain: true}) as any;
                    const compare = Promise.promisify(bcrypt.compare);

                    return compare(password, hash)
                        .tap ((result) => {
                            if (!result) {
                                throw new Error ("Wrong password."); // TODO: child domain error
                            }
                        })
                        .then(() => {
                            const tmp = new User(userPlain.uuid, userPlain.email);
                            _.merge(tmp, userPlain);

                            return tmp;
                        })
                    ;
                });
            })
        ;
    }

    public getNextId() {
        return UUID.v4();
    }

    public getModel() {
        return this.userModel;
    }

    private hashPassword(password: string): Promise<string> {
        const hash = Promise.promisify(bcrypt.hash);

        return hash(password, 8);
    }
}
