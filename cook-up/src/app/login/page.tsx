import LoginCard from "@/app/login/login-card";

export default function Login() {
    return (<div className="bg-gray-50 dark:bg-gray-800 select-none">
                <div className="flex min-h-[50vh] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
                    <LoginCard></LoginCard>
                </div>
            </div>);
}
