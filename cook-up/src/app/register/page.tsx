"use client";

import Card from "@/app/components/card";
import Input, {IInputProps} from "@/app/login/input";
import Link from "next/link";
import RegisterButton from "@/app/register/register-button";
import React, {useState} from "react";
import {FieldErrors, FieldValues, useForm} from "react-hook-form";
import {registerUser} from "@/app/services/rest.service";
import {useRouter} from "next/navigation";
import {saveUserToLocalStorage} from "@/app/services/local-storage.service";
import {IUser} from "@/app/models/user.interface";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
interface IRegisterFormData {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export default function Register() {
    const router: AppRouterInstance = useRouter();

    const [formData, setFormData] = useState<IRegisterFormData>({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const EMAIL_FIELD_ID: string = Object.keys(formData)[0];
    const USERNAME_FIELD_ID: string = Object.keys(formData)[1];
    const PASSWORD_FIELD_ID: string = Object.keys(formData)[2];
    const CONFIRM_PASSWORD_FIELD_ID: string = Object.keys(formData)[3];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prevData: IRegisterFormData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const { register, handleSubmit, formState: { errors }, getValues } = useForm<IRegisterFormData>({ reValidateMode: 'onSubmit'});
    const onSubmit = (user: IRegisterFormData) => {
        const userRegisterFields: IUser = {
            email: user.email,
            password: user.password,
            username: user.username
        }

        registerUser(userRegisterFields)
            .then((userRegistered) => {
            saveUserToLocalStorage({
                email: userRegistered.email,
                username: userRegistered.username,
                id: userRegistered._id,
                profilePictureUrl: userRegistered.profilePicture,
                accessToken: userRegistered?.accessToken
            });
            router.push('/');
        });
    };


    const inputs: IInputProps[] = [
        {
            id: EMAIL_FIELD_ID,
            label: "אימייל",
            type: "text",
            validationFields: {
                required: true,
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            },
            onChange: handleChange
        },
        {
            id: USERNAME_FIELD_ID,
            label: "שם משתמש",
            type: "text",
            validationFields: {
                required: true
            },
            onChange: handleChange
        },
        {
            id: PASSWORD_FIELD_ID,
            label: "סיסמה",
            type: "password",
            validationFields: {
                required: true,
                minLength: 6,
                pattern: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) // At least one letter and one number
            },
            onChange: handleChange
        },
        {
            id: CONFIRM_PASSWORD_FIELD_ID,
            label: "אישור סיסמה",
            type: "password",
            validationFields: {
                required: true,
                minLength: 6,
                pattern: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/), // At least one letter and one number
                validate: () => getValues("password") === getValues("confirmPassword")
            },
            onChange: handleChange
        }
    ];

    const parseErrors = (errors:  FieldErrors<FieldValues>): string => {
        if (errors[EMAIL_FIELD_ID]?.type === 'required' || errors[USERNAME_FIELD_ID]?.type === 'required' || errors[PASSWORD_FIELD_ID]?.type === 'required' || errors[CONFIRM_PASSWORD_FIELD_ID]?.type === 'required') {
            return 'יש למלא את כל השדות על מנת להמשיך';
        } else if (errors[EMAIL_FIELD_ID]?.type === 'pattern') {
            return 'כתובת המייל אינה תקינה';
        } else if (errors[PASSWORD_FIELD_ID]?.type === 'minLength') {
            return 'הסיסמה צריכה להיות באורך של לפחות 6 תווים';
        } else if (errors[PASSWORD_FIELD_ID]?.type === 'pattern') {
            return 'הסיסמה צריכה לכלול לפחות תו אחד וספרה אחת';
        } else if (errors[CONFIRM_PASSWORD_FIELD_ID]?.type === 'validate') {
            return 'הסיסמאות אינן תואמות';
        }
        else {
            return '';
        }
    }

    return (<Card>
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        צור חשבון
                    </h1>

                    <form className="space-y-6 mt-6" onSubmit={handleSubmit(onSubmit)}>
                        {inputs.map((input: IInputProps) => <Input key={input.id} inputProps={input}
                                                                   registerAction={register}></Input>)}
                        <RegisterButton/>

                        <div className="m-auto mt-6 w-fit md:mt-8">
                            {((errors["email"] || errors["username"] || errors["password"] || errors["confirmPassword"]) &&
                                <span className="m-auto ml-1 text-red-500">
                                    {parseErrors(errors)}
                                </span>)}
                        </div>

                    </form>
                    <div className="m-auto mt-6 w-fit md:mt-8">
                            <span className="m-auto ml-1 dark:text-gray-400">יש לך משתמש?
                            </span>
                        <Link className="font-semibold text-indigo-600 dark:text-indigo-100" href="/login">התחבר</Link>
                    </div>
                </div>
            </Card>);
}
