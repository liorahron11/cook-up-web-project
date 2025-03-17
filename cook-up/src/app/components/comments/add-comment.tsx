import React, {useState} from "react";
import {Button} from "primereact/button";
import {IRecipe} from "@server/interfaces/recipe.interface";
import Input, {IInputProps} from "@/app/login/input";
import {FieldErrors, FieldValues, useForm} from "react-hook-form";
import {postCommentOnPost} from "@/app/services/rest.service";
import {IComment} from "@server/interfaces/comment.interface";

export default function AddComment({ recipe, comment, reloadEvent }: { recipe: IRecipe, comment?: IComment, reloadEvent: () => void }) {
    const [commentData, setCommentData] = useState<{content: string}>({
        content: '',
    });
    const CONTENT_FIELD_ID: string = Object.keys(commentData)[0];
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setCommentData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const input: IInputProps = {
            id: CONTENT_FIELD_ID,
            type: "textarea",
            validationFields: {
                required: true,
            },
            onChange: handleChange,
        };
    const { register, handleSubmit, formState: { errors } } = useForm<{content: string}>({ reValidateMode: 'onSubmit'});
    const onSubmit = (data: {content: string}) => {
        postCommentOnPost(recipe.id as string, data.content, comment?.id)
            .then(() => {
                reloadEvent();
            });
    };

    const parseErrors = (errors:  FieldErrors<FieldValues>): string => {
        const error = errors[input.id];
        if (error?.type === 'required') {
            return "שדה חובה";
        }

        return "";
    }

    return (
                <form className="mb-6" onSubmit={handleSubmit(onSubmit)}>
                    <Input key={input.id} inputProps={input} className="w-[30vw]"
                               registerAction={register}></Input>
                    <Button type="submit"
                            className="inline-flex items-center py-2.5 px-4 mt-2  text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                        פרסם
                    </Button>
                    <div className="mt-4 md:mt-6">
                        {((errors["content"]) &&
                            <span className="text-red-500">
                                    {parseErrors(errors)}
                                </span>)}
                    </div>
                </form>);
}