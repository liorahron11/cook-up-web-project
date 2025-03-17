import mongoose from 'mongoose';
import {IComment} from "../interfaces/comment.interface";
import comments from "../routes/comments";


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

export const addReplyRecursive = (comments: any[], parentCommentId: string, newReply: IComment) => {
    for (let comment of comments) {
        if (comment._id.toString() === parentCommentId) {
            comment.comments.push(newReply);
            return true;
        }

        if (comment.comments.length > 0) {
            const added = addReplyRecursive(comment.comments, parentCommentId, newReply);
            if (added) return true;
        }
    }
    return false;
}