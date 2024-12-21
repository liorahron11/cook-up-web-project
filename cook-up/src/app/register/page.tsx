"use client";

import Card from "@/app/components/card";
import Input, {IInputProps} from "@/app/login/input";
import Link from "next/link";
import RegisterButton from "@/app/register/register-button";
import React, {useState} from "react";
interface IRegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
}

export default function Register() {
    const [formData, setFormData] = useState<IRegisterFormData>({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prevData: IRegisterFormData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        // Add your form submission logic here
    };

    const inputs: IInputProps[] = [
        {
            id: "email",
            label: "אימייל",
            type: "text",
            required: true,
            onChange: handleChange
        },
        {
            id: "password",
            label: "סיסמה",
            type: "password",
            required: true,
            onChange: handleChange
        },
        {
            id: "confirmPassword",
            label: "אישור סיסמה",
            type: "password",
            required: true,
            onChange: handleChange
        }
    ];

    return (<Card>
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        צור חשבון
                    </h1>

                    <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
                        {inputs.map((input: IInputProps) => <Input key={input.id} inputProps={input}></Input>)}
                        <RegisterButton/>
                    </form>
                    <div className="m-auto mt-6 w-fit md:mt-8">
                            <span className="m-auto ml-1 dark:text-gray-400">יש לך משתמש?
                            </span>
                        <Link className="font-semibold text-indigo-600 dark:text-indigo-100" href="/login">התחבר</Link>
                    </div>
                </div>
            </Card>);
}
