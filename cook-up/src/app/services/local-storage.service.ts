export interface LocalStorageUser {
    id: string;
    email: string;
    username: string;
    profilePictureUrl?:string;
    isGoogleUser?: boolean;
    accessToken: string;
}
const USER_KEY: string = 'user';

const extractProfilePicture = (input: string): string | null => {
    const match = input.match(/profilePicture\-[\w\-]+\.\w{3,4}/);
    return match ? match[0] : null;
  };

export const saveUserToLocalStorage = (user: LocalStorageUser) => {
    if(user.isGoogleUser != true && user.profilePictureUrl){
        const fullUrl:any =  'http://localhost:5000/uploads/' + extractProfilePicture(user.profilePictureUrl);
        user.profilePictureUrl = fullUrl;
    }

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
