import React from "react";
import {IUser} from "@/app/models/user.interface";
import moment from "moment/moment";
import Link from "next/link";
import {extractProfilePicture} from "@/app/services/images.service";

export default function CommentHeader({ user, timestamp }: { user: IUser, timestamp: Date }) {
    const profileImage: string = extractProfilePicture(user?.profilePictureUrl as string) as string;

    return (<footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
            <Link href="/user-profile/[userId]" as={`/user-profile/${user.id}`} className="flex justify-center">
                <p className="inline-flex items-center ml-3 text-sm text-gray-900 dark:text-white font-semibold">
                    <img
                        className="ml-2 w-6 h-6 rounded-full"
                        src={`http://localhost:5000/uploads/${profileImage}`}
                        alt={user.username}/>{user.username}</p>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                {moment(timestamp).format('DD-MM-YYYY HH:mm')}
            </p>
        </div>
        <button id="dropdownComment1Button" data-dropdown-toggle="dropdownComment1"
                className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                type="button">
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 fill="currentColor" viewBox="0 0 16 3">
                <path
                    d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
            </svg>
            <span className="sr-only">אפשרויות</span>
        </button>
        <div id="dropdownComment1"
             className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownMenuIconHorizontalButton">
                <li>
                    <a href="#"
                       className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">עריכה</a>
                </li>
                <li>
                    <a href="#"
                       className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">מחיקה</a>
                </li>
            </ul>
        </div>
    </footer>);
}
