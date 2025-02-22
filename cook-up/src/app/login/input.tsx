"use client";

import React from "react";
import {ChangeEventHandler, HTMLInputTypeAttribute} from "react";
import {UseFormRegister} from "react-hook-form";
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";
export interface IInputProps {
    id: string;
    label?: string;
    placeholder?: string;
    defaultValue?: string | number;
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

export default function Input({ inputProps, registerAction, className = 'w-80' }: { inputProps: IInputProps, registerAction: UseFormRegister<any>, className?: string}) {
    const { validationFields, ...inputFields } = inputProps;
    let input;
    let label;

    if (inputProps.type === 'textarea') {
        input = <InputTextarea autoResize id={inputFields.id} {...registerAction(inputProps.id, {...validationFields})} rows={5} cols={30} className={"rounded-md border border-gray-300 ".concat(className)}/>;
    } else {
        input = (<InputText  {...registerAction(inputProps.id, {...validationFields})} {...inputFields} className={"rounded-md border p-inputtext-sm border-gray-300 ".concat(className)}/>)
    }

    if (inputProps.label) {
        label = <label htmlFor={inputProps.id} className= "block text-sm font-medium text-gray-700 dark:text-white">{inputProps.label}</label>;
    }

    return (<div>
                {label}
                <div className="mt-1">
                    {input}
                </div>
            </div>);
}