import {IComment} from "./comment.interface";
import {IIngredient} from "./ingredients.interface";

export interface IRecipe {
    id?: string;
    timestamp: Date;
    likes?: string[];
    senderId: string;
    senderName: string;
    title: string;
    description: string
    ingredients: IIngredient[];
    instructions: string;
    comments: IComment[];
}