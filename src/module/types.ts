export const TYPES = {
    ICartRepository: Symbol("ICartRepository"),
    IProductRepository: Symbol("IProductRepository"),
    ISequelizeRepository: Symbol("ISequelizeRepository"),
    ITransactionRepository: Symbol("ITransactionRepository"),
    IUserRepository: Symbol("IUserRepository"),

    Persistance: Symbol("Persistance"),
    Sequelize: Symbol("Sequelize"),

    // tslint:disable-next-line:object-literal-sort-keys
    IAfterTransactionTask: Symbol("IAfterTransactionTask"),
    IBeforeTransactionTask: Symbol("IBeforeTransactionTask"),
    ITransactionService: Symbol("ITransactionService"),
    IProcessTransactionStrategy: Symbol("IProcessTransactionStrategy"),
};
