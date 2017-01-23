import * as Promise from "bluebird";
import { inject, injectable } from "inversify";
import * as Sequelize from "sequelize";
import { IUserRepository } from "../domain/entity/IUserRepository";
import { User } from "../domain/entity/User";
import { ISequelizeRepository } from "./ISequelizeRepository";

@injectable()
export class SequelizeUserRepository implements IUserRepository {
    // private sequelize: Sequelize.Sequelize;

    // constructor(sequelize: Sequelize.Sequelize) { // TODO: logger
    //     this.sequelize = sequelize;
    // }

    public add(user: User) {

    }

    public getById(uuid: string) {
        // TODO: change it
        const user = new User("test", "test");
        return Promise.resolve(user);
    }

    public checkPassword(user: User, password: string) {
    
    }
}
