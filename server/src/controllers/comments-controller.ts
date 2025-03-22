import express, {Router} from "express";
import {IComment} from "../interfaces/comment.interface";
import {
    addCommentToRecipeId, deleteCommentInRecipe,
    getRecipeCommentsById, getSpecificCommentInRecipe, updateCommentInRecipe

} from "../queries/recipe-queries";
import { Request, Response } from 'express';


const commentsRoutes: Router = express.Router();


//get all comments by recipe id
const getCommentsById = async (req: Request, res: Response) => {
    const recipeId: string = req.params.id;

    if (recipeId) {
        const recipeComments: IComment[] = await getRecipeCommentsById(recipeId);

        if (recipeComments) {
            res.status(200).send(recipeComments);
        } else {
            res.status(500).send('error finding recipe');
        }
    } else {
        res.status(500).send('recipe ID should be a number');
    }
};


// add comment to recipe by id
const addCommentToRecipe = async (req: Request, res: Response) => {
    const recipeId: string = req.params.recipeId;
    const newComment: IComment = req.body.comment;
    const parentCommentId: string = req.body.parentCommentId;
    if (recipeId) {

        const recipeComments: IComment[] = await addCommentToRecipeId(recipeId, newComment, parentCommentId);
        if (recipeComments) {
            res.status(201).send("comment added successfully");
        } else {
            res.status(500).send('error adding a comment to the recipe');
        }
    } else {
        res.status(500).send('recipe ID should be a number');
    }

};

// Update a comment in a recipe
const updateComment = async (req: Request, res: Response) => {
    const recipeId: string = req.params.recipeId;
    const commentId: string = req.params.commentId;
    const newContent: string = req.body.content;

    const isUpdateSuccess: boolean = await updateCommentInRecipe(recipeId, commentId, newContent);

    if(isUpdateSuccess){
        return res.status(200).send("comment updated successfully");
    } else {
        return res.status(500).send("error while update the comment");
    }
};

// delete a comment in a recipe
const deleteComment = async (req: Request, res: Response) => {
    const recipeId: string = req.params.recipeId;
    const commentId: string = req.params.commentId;

    const isDeleteSuccess: boolean = await deleteCommentInRecipe(recipeId, commentId);

    if(isDeleteSuccess){
        return res.status(200).send("comment deleted successfully");
    } else {
        return res.status(500).send("error while deleting comment");
    }
};

// get a specif comment by id in a recipe by id
const getSpecificComment = async (req: Request, res: Response) => {
    const recipeId: string = req.params.recipeId;
    const commentId: string = req.params.commentId;

    const comment: IComment = await getSpecificCommentInRecipe(recipeId, commentId);

    if(comment){
        return res.status(200).send(comment);
    } else {
        return res.status(500).send("error while find the comment");
    }
};

export default {
    getCommentsById,
    addCommentToRecipe,
    updateComment,
    deleteComment,
    getSpecificComment
};
