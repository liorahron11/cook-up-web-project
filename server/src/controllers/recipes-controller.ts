import express, {Router} from "express";
import {HydratedDocument} from "mongoose";
import {IRecipe} from "../interfaces/recipe.interface";
import { Request, Response } from 'express';
import {
    addNewRecipe, deleteRecipeById,
    fetchAllRecipes,
    fetchRecipeById,
    fetchRecipesBySender,
    updateRecipeDetails
} from "../queries/recipe-queries";
import {generateRecipes} from "../queries/gemini-queries";
const recipesRoutes: Router = express.Router();

const addRecipe = async (req: Request, res: Response) => {
    const recipe: IRecipe = JSON.parse(req.body.recipe);

    if (recipe) {
        if((req as any).file) {
            recipe.image = (req as any).file.path;
        }
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
    try {
        if (Math.random() < 0.1) {
            await generateRecipes();
        }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const { recipes, total } = await fetchAllRecipes(skip, limit);

      if (recipes) {
          const parsedRecipes = recipes.map((recipe) => parseRecipe(recipe));
          res.status(200).send({
              recipes: parsedRecipes,
              pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
              }
        });
      } else {
        res.status(500).send({ error: "Failed to retrieve recipes" });
      }
    } catch (error) {
      console.error("Error in getAllRecipes:", error);
      res.status(500).send({ error: "Internal server error" });
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
    let updatedRecipe: IRecipe = JSON.parse(req.body.recipe);

    if (recipeId && updatedRecipe) {
        if((req as any).file) {
            updatedRecipe.image = (req as any).file.path;
        } else {
            updatedRecipe.image = '';
        }

        const isRecipeUpdated: boolean = await updateRecipeDetails(recipeId, updatedRecipe);

        if (isRecipeUpdated) {
            res.status(200).send('recipe updated successfully');
        } else {
            res.status(500).send('error updating the recipe');
        }
    } else {
        res.status(500).send('recipe ID not exist');
    }
};

const removeRecipe = async (req: Request, res: Response) => {
    const recipeId: string = req.params.id;

    if (recipeId) {
        const isRecipeRemoved: boolean = await deleteRecipeById(recipeId);

        if (isRecipeRemoved) {
            res.status(200).send('recipe removed successfully');
        } else {
            res.status(500).send('error removing the recipe');
        }
    } else {
        res.status(500).send('recipe ID not exist');
    }
}

const parseRecipe = (recipe) => {
    return {
        id: recipe._id,
        isAI: recipe.isAI,
        title: recipe.title,
        senderId: recipe.senderId,
        timestamp: recipe.timestamp,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        comments: parseComments(recipe.comments),
        image: recipe.image
    };
}

const parseComments = (comments: any[]) => {
    return comments.map((comment) => ({
        id: comment._id.toString(),
        senderId: comment.senderId,
        content: comment.content,
        timestamp: comment.timestamp,
        comments: parseComments(comment.comments),
    }));
}

export default {
    addRecipe,
    getAllRecipes,
    getRecipeById,
    getRecipesBySenderId,
    updateRecipe,
    removeRecipe
};