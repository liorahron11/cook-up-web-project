export default function Card({ children }: { children: React.ReactNode }) {
    return (<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-700 px-4 pb-4 pt-8 sm:rounded-lg sm:px-10 sm:pb-6 sm:shadow flex flex-col items-center">
                    {children}
                </div>
            </div>);
}