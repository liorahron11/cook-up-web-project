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

export const removeCommentRecursive = (comments: any[], commentIdToRemove: string) => {
    for (let i = 0; i < comments.length; i++) {
        if (comments[i]._id.toString() === commentIdToRemove) {
            comments.splice(i, 1);
            return true;
        }

        if (comments[i].comments.length > 0) {
            const removed = removeCommentRecursive(comments[i].comments, commentIdToRemove);
            if (removed) return true;
        }
    }
    return false;
}