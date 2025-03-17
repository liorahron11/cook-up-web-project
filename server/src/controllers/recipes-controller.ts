import express, {Router} from "express";
import {HydratedDocument} from "mongoose";
import {IRecipe} from "../interfaces/recipe.interface";
import { Request, Response } from 'express';
import {
    addNewRecipe,
    fetchAllRecipes,
    fetchRecipeById,
    fetchRecipesBySender,
    updateRecipeDetails
} from "../queries/recipe-queries";
const recipesRoutes: Router = express.Router();

const addRecipe = async (req: Request, res: Response) => {
    const recipe: IRecipe = req.body.recipe;

    if (recipe) {
        const recipeId: string = await addNewRecipe(recipe);
        if (recipeId != "0") {
            res.status(201).send({
                message: 'recipe added successfully',
                recipeId: recipeId
            });
        } else {
            res.status(500).send('error adding recipe');
        }
    } else {
        res.status(500).send('recipe is missing');
    }
};

const getAllRecipes = async (req: Request, res: Response) => {
    const recipes: HydratedDocument<IRecipe>[] = await fetchAllRecipes();

    if (recipes) {
        const parsedRecipes = recipes.map((recipe) => parseRecipe(recipe));
        res.status(200).send(parsedRecipes);
    } else {
        res.status(500).send();
    }
};

const getRecipeById = async (req: Request, res: Response) => {
    const recipeId: string = String(req.params.id);

    if (recipeId) {
        const recipe: HydratedDocument<IRecipe> = await fetchRecipeById(recipeId);
        if (recipe) {
            res.status(200).send(parseRecipe(recipe));
        } else {
            res.status(500).send('error finding recipe');
        }
    } else {
        res.status(500).send('recipe ID should be a number');
    }
};

const getRecipesBySenderId = async (req: Request, res: Response) => {
    const senderId: string = req.query.sender as string;

    if (senderId) {
        const recipes: HydratedDocument<IRecipe>[] = await fetchRecipesBySender(senderId);

        if (recipes) {
            const parsedRecipes = recipes.map((recipe) => parseRecipe(recipe));
            res.status(200).send(parsedRecipes);
        } else {
            res.status(500).send('error finding recipes');
        }
    } else {
        res.status(500).send('sender ID should be a number');
    }
};

const updateRecipe = async (req: Request, res: Response) => {
    const recipeId: string = req.params.id;
    const newTitle: string = req.body.title;

    if (recipeId) {
        const isRecipeUpdated: boolean = await updateRecipeDetails(recipeId ,newTitle);

        if (isRecipeUpdated) {
            res.status(200).send('recipe updated successfully');
        } else {
            res.status(500).send('error updating the recipe');
        }
    } else {
        res.status(500).send('recipe ID not exist');
    }
};

const parseRecipe = (recipe) => {
    return {
        id: recipe._id,
        title: recipe.title,
        senderId: recipe.senderId,
        timestamp: recipe.timestamp,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        comments: recipe.comments.map((comment) => {
            return {
                id: comment._id,
                timestamp: comment.timestamp,
                senderId: comment.senderId,
                content: comment.content,
                comments: comment.comments
            }
        }),
        image: recipe.image
    };
}

export default {
    addRecipe,
    getAllRecipes,
    getRecipeById,
    getRecipesBySenderId,
    updateRecipe
};