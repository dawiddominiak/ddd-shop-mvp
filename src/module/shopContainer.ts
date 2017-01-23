import { Container } from "inversify";
import "reflect-metadata";
import * as Sequelize from "sequelize";
import { IUserRepository } from "../domain/entity/IUserRepository";
import { ISequelizeRepository } from "../persistance/ISequelizeRepository";
import { SequelizeUserRepository } from "../persistance/SequelizeUserRepository";
import { sequelizeConfig } from "./../persistance/config";
import { Persistance } from "./Persistance";
import { TYPES } from "./types";

const databaseHost = process.env.DATABASE_HOST || "localhost";
const databasePort = process.env.DATABASE_PORT || 5432;
const databaseName = process.env.DATABASE_NAME || "postgres";
const databaseUser = process.env.DATABASE_USER || "postgres";
const databasePassword = process.env.DATABASE_PASSWORD || "postgres";
const databaseDialect = process.env.DATABASE_DIALECT || "postgres";

const shopContainer = new Container();

shopContainer.bind<Persistance>(TYPES.Persistance).to(Persistance);

shopContainer.bind<IUserRepository>(TYPES.IUserRepository).to(SequelizeUserRepository).inSingletonScope();
shopContainer.bind<ISequelizeRepository>(TYPES.ISequelizeRepository).to(SequelizeUserRepository);
shopContainer.bind<Sequelize.Sequelize>(TYPES.Sequelize).toDynamicValue(() => {
    return sequelizeConfig;
});

export { shopContainer };
