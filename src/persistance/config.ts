import * as Sequelize from "sequelize";

const databaseHost = process.env.DATABASE_HOST || "localhost";
const databasePort = process.env.DATABASE_PORT || 5432;
const databaseName = process.env.DATABASE_NAME || "postgres";
const databaseUser = process.env.DATABASE_USER || "postgres";
const databasePassword = process.env.DATABASE_PASSWORD || "postgres";
const databaseDialect = process.env.DATABASE_DIALECT || "postgres";

const sequelizeConfig = new Sequelize(databaseName, databaseUser, databasePassword, {
    dialect: databaseDialect,
    host: databaseHost,
    port: databasePort,
});

export { sequelizeConfig };
