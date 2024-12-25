import isEmail from 'validator/lib/isEmail';
import {IUser} from "../interfaces/user.interface";

export const isUserValid = (user: IUser): boolean => {
    if (!user) {
        throw new Error('user is missing');
    }

    if (!user.username || !user.email || !user.password) {
        throw new Error('missing user fields');
    }

    if (!isEmail(user.email)) {
        throw new Error('invalid email');
    }

    if (user.password.toString().length < 6) {
        throw new Error('password is weak');
    }

    return true;
}