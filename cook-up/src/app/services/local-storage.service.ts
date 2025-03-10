export interface LocalStorageUser {
    id: string;
    email: string;
    username: string;
    accessToken: string;
}
const USER_KEY: string = 'user';

export const saveUserToLocalStorage = (user: LocalStorageUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export const getUserFromLocalStorage: () => LocalStorageUser = () => {
    const user: string | null = localStorage.getItem(USER_KEY);

    if (user) {
        return JSON.parse(user);
    }

    return null;
}

export const removeUserFromLocalStorage = () => {
    localStorage.removeItem(USER_KEY);
}
