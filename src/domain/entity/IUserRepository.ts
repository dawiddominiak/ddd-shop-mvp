import * as Promise from "bluebird";
import { User } from "./User";

export interface IUserRepository {
    add(user: User, password: string);
    login(email: string, password: string): Promise<User>;
    getByEmail(email: string): Promise<User>;
}
