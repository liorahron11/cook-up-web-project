import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';
import {IUser} from "../interfaces/user.interface";

export const isUserValid = (user: IUser): boolean => {
    if (!user) {
        throw new Error('user is missing');
    }

    if (!user.username || !user.password || !user.email) {
        throw new Error('missing user fields');
    }

    if (!isEmail(user.email)) {
        throw new Error('invalid email');
    }

    return true;
}

export const isLoginValuesValid = (email: string, password: string): boolean => {
    if (!email || !password || !isEmail(email)) {
        throw new Error('invalud login fields');
    }

    return true;
}