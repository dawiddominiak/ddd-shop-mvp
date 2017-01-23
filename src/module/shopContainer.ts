import { Container } from "inversify";
import "reflect-metadata";
import * as Sequelize from "sequelize";
import { IUserRepository } from "../domain/entity/IUserRepository";
import { ISequelizeRepository } from "../persistance/ISequelizeRepository";
import { SequelizeUserRepository } from "../persistance/SequelizeUserRepository";
import { sequelizeConfig } from "./../persistance/config";
import { Persistance } from "./Persistance";
import { TYPES } from "./types";

const shopContainer = new Container();

shopContainer.bind<Persistance>(TYPES.Persistance).to(Persistance);

shopContainer.bind<IUserRepository>(TYPES.IUserRepository).to(SequelizeUserRepository).inSingletonScope();
shopContainer.bind<ISequelizeRepository>(TYPES.ISequelizeRepository).to(SequelizeUserRepository);
shopContainer.bind<Sequelize.Sequelize>(TYPES.Sequelize).toDynamicValue(() => {
    return sequelizeConfig;
});

export { shopContainer };
