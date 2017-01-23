import * as Sequelize from "sequelize";

export interface ISequelizeRepository {
    constructor(sequelize: Sequelize.Sequelize);
}
