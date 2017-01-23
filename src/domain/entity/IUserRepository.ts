import * as Promise from "bluebird";
import { User } from "./User";

export interface IUserRepository {
    add(user: User, password: string);
    getById(uuid: string): Promise<User>;
    checkPassword(user: User, password: string);
}
