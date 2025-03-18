import {Schema, model, Model} from 'mongoose';
import {IComment} from "../interfaces/comment.interface";
import {IRecipe} from "../interfaces/recipe.interface";
import {IIngredient} from "../interfaces/ingredients.interface";
export type RecipeModel = Model<IRecipe>;
export type CommentModel = Model<IComment>;

const commentSchema: Schema<IComment, CommentModel> = new Schema<IComment, CommentModel>({
    senderId: {type: 'String', required: true},
    content: {type: 'String', required: true},
});

const ingredientSchema = new Schema<IIngredient>({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
});

const recipeSchema: Schema<IRecipe, RecipeModel> = new Schema<IRecipe, RecipeModel>({
    timestamp: { type: Date, default: Date.now },
    senderId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [ingredientSchema], required: true },
    instructions: { type: String, required: true },
    image: { type: String},
    likes: { type: [String], required: true, default: []},
    comments: { type: [commentSchema], default: [] }
});

export default model<IRecipe, RecipeModel>('Recipe', recipeSchema);
