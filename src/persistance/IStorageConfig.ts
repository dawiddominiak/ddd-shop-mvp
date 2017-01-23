export interface IStorageConfig {
    getDatabase(): string;
    getUsername(): string;
    getPassword(): string;
    getDialect(): string;
}
