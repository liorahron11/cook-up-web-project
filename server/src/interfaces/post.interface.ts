import {IComment} from "./comment.interface";
import {IIngredient} from "./ingredients.interface";

export interface IPost {
    id?: string;
    timestamp: Date;
    senderId: string;
    title: string;
    description: string
    ingredients: IIngredient[];
    instructions: string;
    comments: IComment[];
}