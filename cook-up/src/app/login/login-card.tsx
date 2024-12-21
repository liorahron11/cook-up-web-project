import Link from "next/link";
import Card from "@/app/components/card";
import Input, {IInputProps} from "@/app/login/input";
import LoginButton from "@/app/login/login-button";
import Divider from "@/app/login/divider";
import GoogleLoginButton from "@/app/login/google-login-button";
import Image from "next/image";

const inputs: IInputProps[] = [
    {
        id: "email",
        label: "אימייל",
        type: "text",
        required: true,
        value: ""
    },
    {
        id: "password",
        label: "סיסמה",
        type: "password",
        required: true,
        value: ""
    }
];

export default function LoginCard() {
    return (<Card>
                <Image src="/chef.png" width={100} height={100} alt="CookUp"/>
                <form className="space-y-6 mt-6">
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