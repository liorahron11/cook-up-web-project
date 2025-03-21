import React, {ReactElement} from "react";
import {IUser} from "@/app/models/user.interface";
import moment from "moment/moment";
import Link from "next/link";
import {extractProfilePicture} from "@/app/services/images.service";
import CommentActions from "@/app/components/comments/comment-actions";
import {getUserFromLocalStorage} from "@/app/services/local-storage.service";
import {IRecipe} from "@server/interfaces/recipe.interface";

export default function CommentHeader({ user, timestamp, recipe, commentId, reloadEvent }: { user: IUser, timestamp: Date, recipe: IRecipe, commentId: string, reloadEvent: () => void }) {
    const profileImage: string = extractProfilePicture(user?.profilePictureUrl as string) as string;
    const commentActions: ReactElement = <CommentActions recipe={recipe} commentId={commentId} reloadEvent={reloadEvent}></CommentActions>

    return (<footer className="flex justify-between items-center mb-2 w-[30vw]">
        <div className="flex items-center">
            <Link href="/user-profile/[userId]" as={`/user-profile/${user.id}`} className="flex justify-center">
                <p className="inline-flex items-center ml-3 text-sm text-gray-900 dark:text-white font-semibold">
                    <img
                        className="ml-2 w-6 h-6 rounded-full"
                        src={`https://node06.cs.colman.ac.il:4000/uploads/${profileImage}`}
                        alt={user.username}/>{user.username}</p>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                {moment(timestamp).format('DD-MM-YYYY HH:mm')}
            </p>
        </div>
        {user.id === getUserFromLocalStorage().id && commentActions}
    </footer>);
}
