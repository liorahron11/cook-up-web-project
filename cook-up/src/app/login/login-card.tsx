"use client";

import Link from "next/link";
import Card from "@/app/components/card";
import Input, {IInputProps} from "@/app/login/input";
import LoginButton from "@/app/login/login-button";
import Divider from "@/app/login/divider";
import GoogleLoginButton from "@/app/login/google-login-button";
import Image from "next/image";
import React, {useState} from "react";

interface ILoginFormData {
    email: string;
    password: string;
}

export default function LoginCard() {
    const [formData, setFormData] = useState<ILoginFormData>({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prevData: ILoginFormData) => ({
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
        }
    ];

    return (<Card>
                <Image src="/chef.png" width={100} height={100} alt="CookUp"/>
                <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
                    {inputs.map((input: IInputProps) => <Input key={input.id} inputProps={input}></Input>)}
                    <LoginButton/>
                </form>
                <div className="mt-6">
                    <Divider label="או התחבר באמצעות"/>
                    <div className="mt-6 flex justify-center">
                        <GoogleLoginButton/>
                    </div>
                </div>
                <div className="m-auto mt-6 w-fit md:mt-8">
                    <span className="m-auto ml-1 dark:text-gray-400">עדיין לא רשום?
                    </span>
                    <Link className="font-semibold text-indigo-600 dark:text-indigo-100" href="/register">צור חשבון</Link>
                </div>
            </Card>);
}