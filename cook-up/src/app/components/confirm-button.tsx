export default function ConfirmButton({children, label}: { children?: React.ReactNode, label: string}) {
    return (<div>
        <button type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:border-transparent dark:hover:bg-indigo-600 dark:focus:ring-indigo-400 dark:focus:ring-offset-2 disabled:cursor-wait disabled:opacity-50">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            {children}
                        </span>
            {label}
        </button>
    </div>);
}