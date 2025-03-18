import React from "react";

export default function CancelButton({children, label}: { children?: React.ReactNode, label: string}) {
    return (<div>
        <button type="reset"
                className="group relative w-full flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:border-transparent dark:hover:bg-gray-600 dark:focus:ring-gray-400 dark:focus:ring-offset-2 disabled:cursor-wait disabled:opacity-50 ">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            {children}
                        </span>
            {label}
        </button>
    </div>);
}