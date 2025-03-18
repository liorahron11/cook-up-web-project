import {IRecipe} from "../interfaces/recipe.interface";
import {HydratedDocument, UpdateWriteOpResult} from "mongoose";
import Recipe, {Comment} from "../models/recipe.model";
import { IComment } from "../interfaces/comment.interface";
import {addReplyRecursive, isIdValid, removeCommentRecursive} from "../services/query-utils"

export const addNewRecipe = async (recipe: IRecipe): Promise<string> => {
    try {
        const doc: HydratedDocument<IRecipe> = new Recipe(recipe);
        const res: HydratedDocument<IRecipe> = await doc.save();

        if (!res.id) {
            console.error('error occurred while adding recipe');

            return "0";
        } else {
            console.log(`recipe added successfully`);

            return res.id;
        }
    } catch (error) {
        console.error('error occurred while adding recipe');

        return "0"
    }
    
}

export const fetchAllRecipes = async (skip = 0, limit = 10): Promise<{ recipes: HydratedDocument<IRecipe>[], total: number }> => {
    try {
      const recipes: HydratedDocument<IRecipe>[] = await Recipe.find()
        .skip(skip)
        .limit(limit);
      
      const total = await Recipe.countDocuments();
      
      if (!recipes) {
        console.error("Could not find recipes");
        return { recipes: [], total: 0 };
      } else {
        console.log(`Recipes found successfully. Page: ${skip/limit + 1}, Count: ${recipes.length}, Total: ${total}`);
        return { recipes, total };
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return { recipes: [], total: 0 };
    }
  };

export const fetchRecipeById = async (id: string): Promise<HydratedDocument<IRecipe>> => {
    let recipe: HydratedDocument<IRecipe>;
    if(isIdValid(id)) {
        recipe = await Recipe.findOne({_id: id});
    }
    
    if (!recipe) {
        console.error(`didnt find recipe ${id}`);
    } else {
        console.log(`recipe ${id} found successfully`);

    }
    return recipe;
}

export const fetchRecipesBySender = async (senderId: string): Promise<HydratedDocument<IRecipe>[]> => {
    const recipes: HydratedDocument<IRecipe>[] = await Recipe.find({senderId});

    if (!recipes) {
        console.error(`didnt find recipes for sender ${senderId}`);
    } else {
        console.log(`recipes of sender ${senderId} found successfully`);

        return recipes;
    }
}

export const updateRecipeDetails = async (id: string, title: string): Promise<boolean> => {
    const result: UpdateWriteOpResult = await Recipe.updateOne({_id: id}, { $set: {title: title}});

    if (result.modifiedCount > 0) {
        console.log(`recipe ${id} content updated successfully`);

        return true;
    } else {
        console.log('recipe not found or content up to date');

        return false;
    }
}

export const saveLikeRecipe = async (userId: string, recipeId: string): Promise<boolean> => {
    const result: UpdateWriteOpResult = await Recipe.findByIdAndUpdate(
        { _id: recipeId },   
        { $push: { likes: userId } },
        { new: true }
      );

    if (result) {
        console.log(`userId ${userId} like recipeId ${recipeId} successfully`);

        return true;
    } else {
        console.log('recipe not found or content up to date');

        return false;
    }
}

export const saveDislikeRecipe = async (userId: string, recipeId: string): Promise<boolean> => {
    const result: UpdateWriteOpResult = await Recipe.findByIdAndUpdate(
        {_id: recipeId},
        {$pull: { likes: userId }},
        { new: true }
      );

    if (result) {
        console.log(`userId ${userId} dislike recipeId ${recipeId} successfully`);

        return true;
    } else {
        console.log('recipe not found or content up to date');

        return false;
    }
}


export const getRecipeCommentsById = async (id: string): Promise<IComment[]> => {
    const recipe: HydratedDocument<IRecipe> = await fetchRecipeById(id);

    if (!recipe) {
        console.error(`didnt find recipe ${id}`);
    } else {
        console.log(`recipe ${id} found successfully`);

        return recipe.comments;
    }
}

export const addCommentToRecipeId = async (id: string, comment: IComment, parentCommentId: string): Promise<IComment[]> => {
    const recipe: HydratedDocument<IRecipe> = await fetchRecipeById(id);
    const newComment = await Comment.create({
        senderId: comment.senderId,
        content: comment.content,
        comments: []
    });

    if (!recipe) {
        console.error(`didnt find recipe ${id}`);
    } else {
        console.log(`recipe ${id} found successfully`);
        let updatedRecipe;

        if (!parentCommentId) {
            updatedRecipe = await Recipe.findByIdAndUpdate(
                id,
                { $push: { comments: newComment } },
                { new: true }
            );
        } else {
            const recipe = await fetchRecipeById(id);
            const isAdded: boolean = addReplyRecursive(recipe.comments, parentCommentId, newComment);

            if (isAdded) {
                recipe.markModified("comments");
                await recipe.save();
                updatedRecipe = recipe;
            } else {
                throw new Error("Parent comment not found");
            }
        }

        if (!updatedRecipe) {
            throw new Error("Recipe not found");
        }

        return updatedRecipe.comments;
    }
}

export const updateCommentInRecipe = async (recipeId: string, commentId: string ,newContent: string): Promise<boolean> => {
    const recipe: HydratedDocument<IRecipe> = await fetchRecipeById(recipeId);

    if (!recipe) {
        console.error(`didnt find post ${recipeId}`);
        return false;
    } else {
        const comment = recipe.comments.find(c => c.id === commentId);

        if(comment){
            comment.content = newContent;
            await recipe.save();

            return true;
        } 
        console.error(`didnt find comment ${commentId} for recipe ${recipeId}`);
        return false;
    }
}

export const deleteCommentInRecipe = async (recipeId: string, commentId: string): Promise<boolean> => {
    try {
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            console.error("Recipe not found");
            return false;
        }

        const removed = removeCommentRecursive(recipe.comments, commentId);
        if (!removed) {
            console.error("Error removing comment");
            return false;
        }

        recipe.markModified("comments");
        await recipe.save();
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const getSpecificCommentInRecipe = async (recipeId: string, commentId: string): Promise<IComment> => {
    const recipe: HydratedDocument<IRecipe> = await fetchRecipeById(recipeId);
    
    if (!recipe) {
        console.error(`didnt find recipe ${recipeId}`);
    } else {
        console.log(`recipe ${recipeId} found successfully`);
        const comment: IComment = recipe.comments.find((currComment: IComment) => currComment.id === commentId);

        if(comment) {
            console.log(`comment ${commentId} found successfully`);
            return comment;
        } else { 
        console.error(`comment ${commentId} found for recipe ${recipeId}`);
        }
    }
}