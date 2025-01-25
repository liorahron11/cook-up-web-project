"use client";

import {ChangeEventHandler, HTMLInputTypeAttribute} from "react";
import {UseFormRegister} from "react-hook-form";
export interface IInputProps {
    id: string;
    label: string;
    type: HTMLInputTypeAttribute;
    validationFields?: {
        required?: boolean;
        min?: number
        max?: number
        minLength?: number
        maxLength?: number
        pattern?: RegExp;
        validate?: () => boolean;
    };
    onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function Input({ inputProps, registerAction }: { inputProps: IInputProps, registerAction: UseFormRegister<any>; }) {
    const { validationFields, ...inputFields } = inputProps;

    return (<div>
                <label htmlFor={inputProps.id} className="block text-sm font-medium text-gray-700 dark:text-white">{inputProps.label}</label>
                <div className="mt-1">
                    <input {...inputFields} {...registerAction(inputProps.id, {...validationFields})} className="block w-80 appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-300 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm"/>
                </div>
            </div>);
}