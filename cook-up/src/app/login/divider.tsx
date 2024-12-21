export default function Divider({label}: {label: string}) {
    return (<div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white dark:bg-gray-700 px-2 text-gray-500 dark:text-white">{label}</span>
                </div>
            </div>);
}