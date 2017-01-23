import { Container } from "inversify";
import "reflect-metadata";
import { IUserRepository } from "../domain/entity/IUserRepository";
import { SequelizeUserRepository } from "../persistance/SequelizeUserRepository";
import { TYPES } from "./types";

const shopContainer = new Container();
shopContainer.bind<IUserRepository>(TYPES.IUserRepository).to(SequelizeUserRepository).inSingletonScope();

export { shopContainer };
