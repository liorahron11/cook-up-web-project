import mongoose, { Schema, model, Model, Document } from "mongoose";
import { IComment } from "../interfaces/comment.interface";
import { IRecipe } from "../interfaces/recipe.interface";
import { IIngredient } from "../interfaces/ingredients.interface";

export type RecipeModel = Model<IRecipe>;
export type CommentModel = Model<IComment>;

export interface ICommentDocument extends Document {
    timestamp: Date;
    senderId: string;
    content: string;
    comments: mongoose.Types.ObjectId[];
}

const CommentSchema: Schema = new Schema<IComment>({
    timestamp: { type: Date, default: Date.now },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    comments: [{ type: Schema.Types.Mixed, default: [] }]
});

export const Comment: CommentModel = model<ICommentDocument, CommentModel>("Comment", CommentSchema);

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
    comments: { type: [CommentSchema], default: [] },
    isAI: { type: Boolean, required: false },
});

export default model<IRecipe, RecipeModel>("Recipe", recipeSchema);
