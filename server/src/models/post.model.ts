import {Schema, model, Model} from 'mongoose';
import {IComment} from "../interfaces/comment.interface";
import {IPost} from "../interfaces/post.interface";
import {IIngredient} from "../interfaces/ingredients.interface";
export type PostModel = Model<IPost>;
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

const postSchema: Schema<IPost, PostModel> = new Schema<IPost, PostModel>({
    timestamp: { type: Date, default: Date.now },
    senderId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [ingredientSchema], required: true },
    instructions: { type: String, required: true },
    comments: { type: [commentSchema], default: [] }
});

export default model<IPost, PostModel>('Post', postSchema);
