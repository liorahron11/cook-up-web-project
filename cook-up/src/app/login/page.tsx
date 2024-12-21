import LoginCard from "@/app/login/login-card";
import Image from "next/image";

export default function Login() {
    return (<div className="bg-gray-50 dark:bg-gray-800">
                <div className="flex min-h-[50vh] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
                    <Image src="/chef.png" width={100} height={100} alt="CookUp"/>
                    <LoginCard></LoginCard>
                </div>
            </div>);
}
