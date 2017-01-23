import { injectable, multiInject } from "inversify";
import * as Sequelize from "sequelize";
import { ISequelizeRepository } from "../persistance/ISequelizeRepository";
import { TYPES } from "./types";

@injectable()
export class Persistance {
    private sequelize: Sequelize.Sequelize;

    constructor(
        @multiInject(TYPES.ISequelizeRepository) repositories: ISequelizeRepository[],
        sequelize: Sequelize.Sequelize,
    ) {
        this.sequelize = sequelize;
    }

    public sync(force?: boolean, logger?: Function) {
        this.sequelize.sync({
            force: force as boolean,
            logging: logger || false,
        });
    }
};
