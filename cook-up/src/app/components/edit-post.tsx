"use client";

import Input, {IInputProps} from "@/app/login/input";
import React, {useState, useRef, useEffect} from "react";
import {FieldErrors, FieldValues, useForm} from "react-hook-form";
import {IRecipe} from "@server/interfaces/recipe.interface";
import {getUserFromLocalStorage} from "@/app/services/local-storage.service";
import IngredientsInputGroup from "@/app/components/ingredients-input-group";
import CreateRecipeButton from "@/app/create-recipe/create-recipe-button";
import {IIngredient} from "@server/interfaces/ingredients.interface";
import CancelButton from "@/app/components/cancel-button";
import {updateRecipe} from "@/app/services/rest.service";

export default function EditPost({recipe, closeEditMode, onUpdate}: {recipe: IRecipe, closeEditMode?: () => void, onUpdate?: () => void}) {
    const [formData, setFormData] = useState<{title: string, description: string, ingredients: IIngredient[], instructions: string}>({
        title: '',
        description: '',
        ingredients: [],
        instructions: '',
    });
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (recipe.image) {
            setPhotoPreview(recipe.image);
        }
    }, []);
    const handleIngredientsGroupStateChange = (newState: IIngredient[]) => {
        setFormData((prevData) => {
            return {...prevData, ingredients: newState}
        });
    };

    const TITLE_FIELD_ID: string = Object.keys(formData)[0];
    const DESCRIPTION_FIELD_ID: string = Object.keys(formData)[1];
    const INGREDIENTS_FIELD_ID: string = Object.keys(formData)[2];
    const INSTRUCTIONS_FIELD_ID: string = Object.keys(formData)[3];
    const PHOTO_FIELD_ID: string = "photo";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhoto(file);

            const reader = new FileReader();
            reader.onload = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoUploadClick = () => {
        fileInputRef.current?.click();
    };

    const removePhoto = () => {
        setPhoto(null);
        setPhotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const { register, handleSubmit, formState: { errors } } = useForm<IRecipe>({ reValidateMode: 'onSubmit'});
    const onSubmit = (updatedRecipe: IRecipe) => {
        const formDataToSend = new FormData();

        const newRecipeFields: IRecipe = {
            timestamp: recipe.timestamp,
            senderId: getUserFromLocalStorage().id,
            title: updatedRecipe.title,
            description: updatedRecipe.description,
            ingredients: formData.ingredients,
            instructions: updatedRecipe.instructions,
            comments: recipe.comments
        };

        formDataToSend.append('recipe', JSON.stringify(newRecipeFields));

        if (photo) {
            formDataToSend.append('photo', photo);
        }

        updateRecipe(recipe.id as string, formDataToSend)
            .then(() => {
                if (onUpdate) {
                    onUpdate();
                }

                if (closeEditMode) {
                    closeEditMode();
                }
            });
    };

    const handleCancel = () => {
        if (closeEditMode) {
            closeEditMode();
        }
    };


    const inputs: IInputProps[] = [
        {
            id: TITLE_FIELD_ID,
            label: "שם המתכון",
            defaultValue: recipe.title,
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
            value: recipe.description,
            validationFields: {
                required: true,
                minLength: 10,
            },
            onChange: handleChange,
        },
        {
            id: INGREDIENTS_FIELD_ID,
            label: "מצרכים",
            value: recipe.ingredients,
            type: "ingredients",
            validationFields: {
                required: true,
            },
            onChange: handleChange,
        },
        {
            id: INSTRUCTIONS_FIELD_ID,
            label: "הוראות הכנה",
            value: recipe.instructions,
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

    return (<div className="w-full max-w-2xl m-auto flex flex-col justify-center items-center">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                ערוך מתכון
            </h1>

            <form className="space-y-6 mt-6" onSubmit={handleSubmit(onSubmit)} onReset={handleCancel} encType="multipart/form-data">
                {inputs.map((input: IInputProps) => {
                    if (input.type === 'ingredients') {
                        return <IngredientsInputGroup ingredients={input.value} key={input.id} registerAction={register} onStateChange={handleIngredientsGroupStateChange}></IngredientsInputGroup>;
                    } else {
                        return <Input key={input.id} inputProps={input} className="w-[20vw]"
                                      registerAction={register}></Input>;
                    }
                })}

                <div className="space-y-2">
                    <label htmlFor={PHOTO_FIELD_ID} className="block text-sm font-medium text-gray-900 dark:text-white">
                        תמונת המתכון
                    </label>
                    <input
                        type="file"
                        id={PHOTO_FIELD_ID}
                        accept="image/*"
                        onChange={handlePhotoChange}
                        ref={fileInputRef}
                        className="hidden"
                    />

                    <div className="flex flex-col items-center justify-center w-full">
                        {!photoPreview ? (
                            <div
                                onClick={handlePhotoUploadClick}
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 dark:border-gray-600"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">לחץ להעלאת תמונה</span> או גרור לכאן
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PNG, JPG או JPEG
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative w-full">
                                <div className="relative w-full h-64 overflow-hidden rounded-lg shadow-md">
                                    <img
                                        src={photoPreview}
                                        alt="תצוגה מקדימה של תמונת המתכון"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-white text-sm font-medium">תמונת המתכון</span>
                                    </div>
                                </div>
                                <div className="absolute -top-2 -left-2 flex space-x-2 rtl:space-x-reverse">
                                    <button
                                        type="button"
                                        onClick={handlePhotoUploadClick}
                                        className="p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
                                        title="החלף תמונה"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={removePhoto}
                                        className="p-1.5 bg-red-600 rounded-full text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-md"
                                        title="הסר תמונה"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center items-center gap-6">
                    <CreateRecipeButton/>
                    <CancelButton label={"ביטול"}></CancelButton>
                </div>

                <div className="m-auto mt-6 w-fit md:mt-8">
                    {((errors["title"] || errors["description"] || errors["ingredients"] || errors["instructions"]) &&
                        <span className="m-auto ml-1 text-red-500">
                            {parseErrors(errors)}
                        </span>)}
                </div>
            </form>
        </div>
    </div>);
}