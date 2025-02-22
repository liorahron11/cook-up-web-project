"use client";

import Card from "@/app/components/card";
import Input, {IInputProps} from "@/app/login/input";
import React, {useState} from "react";
import {FieldErrors, FieldValues, useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {IRecipe} from "@server/interfaces/recipe.interface";
import {createRecipe} from "@/app/services/rest.service";
import {getUserFromLocalStorage} from "@/app/services/local-storage.service";
import IngredientsInputGroup from "@/app/components/ingredients-input-group";
import CreateRecipeButton from "@/app/create-recipe/create-recipe-button";
import {IIngredient} from "@server/interfaces/ingredients.interface";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function CreateRecipe() {
    const router: AppRouterInstance = useRouter();
    const [formData, setFormData] = useState<{title: string, description: string, ingredients: IIngredient[], instructions: string}>({
        title: '',
        description: '',
        ingredients: [],
        instructions: '',
    });

    const handleIngredientsGroupStateChange = (newState: IIngredient[]) => {
        setFormData((prevData) => {
            return {...prevData, ingredients: newState}
        });
    };

    const TITLE_FIELD_ID: string = Object.keys(formData)[0];
    const DESCRIPTION_FIELD_ID: string = Object.keys(formData)[1];
    const INGREDIENTS_FIELD_ID: string = Object.keys(formData)[2];
    const INSTRUCTIONS_FIELD_ID: string = Object.keys(formData)[3];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const { register, handleSubmit, formState: { errors } } = useForm<IRecipe>({ reValidateMode: 'onSubmit'});
    const onSubmit = (recipe: IRecipe) => {
        const newRecipeFields: IRecipe = {
            timestamp: new Date(),
            senderId: getUserFromLocalStorage().id,
            title: recipe.title,
            description: recipe.description,
            ingredients: formData.ingredients,
            instructions: recipe.instructions,
            comments: []
        };

        createRecipe({recipe: newRecipeFields})
            .then((res) => {
                console.log(res);
                router.push('/');
            });
    };


    const inputs: IInputProps[] = [
        {
            id: TITLE_FIELD_ID,
            label: "שם המתכון",
            type: "text",
            validationFields: {
                required: true,
                minLength: 3,
            },
            onChange: handleChange,
        },
        {
            id: DESCRIPTION_FIELD_ID,
            label: "תיאור",
            type: "textarea",
            validationFields: {
                required: true,
                minLength: 10,
            },
            onChange: handleChange,
        },
        {
            id: INGREDIENTS_FIELD_ID,
            label: "מצרכים",
            type: "ingredients",
            validationFields: {
                required: true,
            },
            onChange: handleChange,
        },
        {
            id: INSTRUCTIONS_FIELD_ID,
            label: "הוראות הכנה",
            type: "textarea",
            validationFields: {
                required: true,
            },
            onChange: handleChange,
        },
    ];

    const parseErrors = (errors:  FieldErrors<FieldValues>): string => {
        return inputs
            .map(input => {
                const error = errors[input.id];
                if (error?.type === 'required') {
                    return `השדה "${input.label}" הוא שדה חובה.`;
                }
                if (error?.type === 'minLength') {
                    return `השדה "${input.label}" חייב להכיל לפחות ${input?.validationFields?.minLength} תווים.`;
                }
                return null;
            })
            .filter(Boolean)
            .join(' ');
    }

    return (<Card>
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                יצירת מתכון חדש
            </h1>

            <form className="space-y-6 mt-6" onSubmit={handleSubmit(onSubmit)}>
                {inputs.map((input: IInputProps) => {
                    if (input.type === 'ingredients') {
                        return <IngredientsInputGroup key={input.id} registerAction={register} onStateChange={handleIngredientsGroupStateChange}></IngredientsInputGroup>;
                    } else {
                        return <Input key={input.id} inputProps={input} className="w-[20vw]"
                                      registerAction={register}></Input>;
                    }
                })}
                <CreateRecipeButton/>

                <div className="m-auto mt-6 w-fit md:mt-8">
                    {((errors["title"] || errors["description"] || errors["ingredients"] || errors["instructions"]) &&
                        <span className="m-auto ml-1 text-red-500">
                                    {parseErrors(errors)}
                                </span>)}
                </div>

            </form>
        </div>
    </Card>);
}
