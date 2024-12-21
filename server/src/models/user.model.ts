import {Schema, model, Model} from 'mongoose';
import {IUser} from "../interfaces/user.interface";
export type UserModel = Model<IUser>;

const userSchema: Schema<IUser, UserModel> = new Schema<IUser, UserModel>({
    id: {type: 'Number', required: true, unique: true},
    username: {type: 'String', required: true, unique: true},
    email: {type: 'String', required: true, unique: true},
    password: {type: 'String', required: true},
});

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        delete ret._id;
    }
});

export default model<IUser, UserModel>('User', userSchema);
