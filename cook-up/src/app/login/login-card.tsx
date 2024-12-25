"use client";

import Link from "next/link";
import Card from "@/app/components/card";
import Input, {IInputProps} from "@/app/login/input";
import LoginButton from "@/app/login/login-button";
import Divider from "@/app/login/divider";
import GoogleLoginButton from "@/app/login/google-login-button";
import Image from "next/image";
import React, {useState} from "react";
import {FieldErrors, FieldValues, useForm} from "react-hook-form";
import {IUser} from "@/app/models/user.interface";
import {registerUser, userLogin} from "@/app/services/rest.service";
import {saveUserToLocalStorage} from "@/app/services/local-storage.service";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useRouter} from "next/navigation";

interface ILoginFormData {
    email: string;
    password: string;
}

export default function LoginCard() {
    const router: AppRouterInstance = useRouter();
    const [formData, setFormData] = useState<ILoginFormData>({
        email: '',
        password: '',
    });

    const EMAIL_FIELD_ID: string = Object.keys(formData)[0];
    const PASSWORD_FIELD_ID: string = Object.keys(formData)[1];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prevData: ILoginFormData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onSubmit'});
    const onSubmit = (user: any) => {
        const userLoginFields = {
            email: user.email,
            password: user.password,
        }

        userLogin({user: userLoginFields})
            .then((userInfo) => {
                saveUserToLocalStorage({email: userInfo.email, username: userInfo.username});
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
            id: PASSWORD_FIELD_ID,
            label: "סיסמה",
            type: "password",
            validationFields: {
                required: true,
                minLength: 6,
                pattern: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) // At least one letter and one number
            },
            onChange: handleChange
        }
    ];

    const parseErrors = (errors:  FieldErrors<FieldValues>): string => {
        if (errors[EMAIL_FIELD_ID]?.type === 'required' || errors[PASSWORD_FIELD_ID]?.type === 'required') {
            return 'יש למלא את כל השדות על מנת להמשיך';
        } else if (errors[EMAIL_FIELD_ID]?.type === 'pattern') {
            return 'כתובת המייל אינה תקינה';
        } else if (errors[PASSWORD_FIELD_ID]?.type === 'minLength') {
            return 'הסיסמה צריכה להיות באורך של לפחות 6 תווים';
        } else if (errors[PASSWORD_FIELD_ID]?.type === 'pattern') {
            return 'הסיסמה צריכה לכלול לפחות תו אחד וספרה אחת';
        } else {
            return '';
        }
    }

    return (<Card>
                <Image src="/chef.png" width={100} height={100} alt="CookUp"/>
                <form className="space-y-6 mt-6" onSubmit={handleSubmit(onSubmit)}>
                    {inputs.map((input: IInputProps) => <Input key={input.id} inputProps={input} registerAction={register}></Input>)}
                    <LoginButton/>
                </form>
                <div className="mt-6">
                    <Divider label="או התחבר באמצעות"/>
                    <div className="mt-6 flex justify-center">
                        <GoogleLoginButton/>
                    </div>
                </div>
                <div className="mt-6 w-fit md:mt-8">
                    {((errors[EMAIL_FIELD_ID] || errors[PASSWORD_FIELD_ID]) &&
                    <span className="m-auto ml-1 text-red-500">
                        {parseErrors(errors)}
                    </span>
                    )}
                </div>
                <div className="m-auto mt-6 w-fit md:mt-8">
                    <span className="m-auto ml-1 dark:text-gray-400">עדיין לא רשום?
                    </span>
                    <Link className="font-semibold text-indigo-600 dark:text-indigo-100" href="/register">צור חשבון</Link>
                </div>
            </Card>);
}