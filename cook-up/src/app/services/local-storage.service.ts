import {extractProfilePicture} from "@/app/services/images.service";

export interface LocalStorageUser {
    id: string;
    email: string;
    username: string;
    profilePictureUrl?:string;
    isGoogleUser?: boolean;
    accessToken?: string;
}
const USER_KEY: string = 'user';

export const saveUserToLocalStorage = (user: LocalStorageUser) => {
    if(user.isGoogleUser != true && user?.profilePictureUrl){
        const fullUrl: any =  'https://node06.cs.colman.ac.il:4000/uploads/' + extractProfilePicture(user?.profilePictureUrl);
        user.profilePictureUrl = fullUrl;
    }

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
