import {extractProfilePicture} from "@/app/services/images.service";

export interface LocalStorageUser {
    id: string;
    email: string;
    username: string;
    profilePictureUrl?:string;
    isGoogleUser?: boolean;
    accessToken?: string;
    refreshToken?: string;
}
const USER_KEY: string = 'user';

export const saveUserToLocalStorage = (user: LocalStorageUser) => {
    if(user.isGoogleUser != true && user?.profilePictureUrl){
        const fullUrl: any =  'http://localhost:5000/uploads/' + extractProfilePicture(user?.profilePictureUrl);
        user.profilePictureUrl = fullUrl;
    }

    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export const setTokensToLocalStorage = (tokens: { accessToken: string, refreshToken: string }) => {
    const user: LocalStorageUser = getUserFromLocalStorage();
    user.accessToken = tokens.accessToken;
    user.refreshToken = tokens.refreshToken;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export const getUserFromLocalStorage: () => LocalStorageUser = () => {
    if (typeof window !== "undefined") {

    const user: string | null = localStorage.getItem(USER_KEY);

    if (user) {
        return JSON.parse(user);
    }
    }

    return null;
}

export const removeUserFromLocalStorage = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem(USER_KEY);
    }

}
