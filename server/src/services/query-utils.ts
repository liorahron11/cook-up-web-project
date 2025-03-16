import mongoose from 'mongoose';


export const isIdValid = (id: string): boolean => {
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) return true;
    
    return false;
}

export const stringifyUpdatedUserFields = (isPasswordUpdated: boolean, isUsernameUpdated: boolean ,isEmailUpdated: boolean, isProfilePictureUpdated: boolean): string => {
    let updatedFields: string = '';
    if (isPasswordUpdated) {
        updatedFields += 'password ';
    }
    if (isUsernameUpdated) {
        updatedFields += 'username ';
    }
    if (isProfilePictureUpdated) {
        updatedFields += 'profile picture ';
    }
    if (isEmailUpdated) {
        updatedFields += 'email ';
    }
    return updatedFields;
}