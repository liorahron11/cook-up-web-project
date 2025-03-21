"use client";

import React, {ReactElement} from "react";
import { getUserFromLocalStorage } from "@/app/services/local-storage.service";
import { LocalStorageUser } from "@/app/services/local-storage.service";
import {getUserRecipes} from "@/app/services/rest.service";
import {useEffect, useState} from "react";
import {IRecipe} from "@server/interfaces/recipe.interface";
import PostsGrid, {PostsGridProps} from "@/app/components/posts-grid";
import {useParams} from "next/navigation";
import {Params} from "next/dist/server/request/params";
import {getUserByID} from "@/app/services/users-service";
import {IUser} from "@/app/models/user.interface";
import {ProgressSpinner} from "primereact/progressspinner";

export default function UserProfile() {
    const params: Params = useParams();
    const userId = params?.userId as string | undefined; // Ensure it's a string
    const [recipes, setRecipes] = useState<IRecipe[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<IUser | null>(null);
    const fetchUserData = async () => {
        setLoading(true);
        try {
            let userData;
            if (userId) {
                userData = await getUserByID(userId as string);
            } else {
                userData = getUserFromLocalStorage();
            }
            setUser(userData);

            const userPosts: IRecipe[] = await getUserRecipes(userId as string);
            setRecipes(userPosts);
            setLoading(false);

        } catch (error) {
            console.error("Error fetching user profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId !== undefined) {
            fetchUserData();
        }
    }, [userId]);

    const postGridProps: PostsGridProps = {
        posts: recipes,
        onUpdate: fetchUserData
    }

    const userUpdateButton: ReactElement = (<button
            className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-black dark:text-white hover:bg-gray-300 active:bg-gray-400 dark:hover:bg-gray-600 disabled:cursor-wait disabled:opacity-50 w-30 h-8">
            <span className="text-sm">עריכת פרופיל</span>
        </button>)
    const isLoggedUser: boolean = userId === getUserFromLocalStorage().id;

    if (loading) {
        return (<div className="flex flex-col items-center justify-center m-10">
                <ProgressSpinner/>
            </div>
        )
    } else if (!user) {
        return (<div className="flex flex-col justify-center items-center text-lg mt-10 gap-4">
            <img src="../error.svg" alt="שגיאה!"/>
            <span>לא נמצא משתמש</span>
        </div>)
    } else {
        if (user) {
            return (
                <div className="flex min-h-[88vh] flex-col items-center py-12 sm:px-6 lg:px-8">
                    <div className="flex flex-row items-center justify-content gap-20">
                        <div>
                            <img className="w-20 h-20 rounded-full" 
                             src={`${user?.profilePictureUrl || "avatar.png"}`}
                                 alt="Rounded avatar"/>
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="flex flex-row items-center justify-content gap-10">
                                <h1 className="text-2xl">{user.username}</h1>
                                {isLoggedUser && userUpdateButton}
                            </div>
                            <p className="text-sm mt-2">{user.email}</p>
                            <p className="text-sm mt-2">{postGridProps.posts?.length} פוסטים</p>
                        </div>
                    </div>
                    <hr className="h-px my-8 w-[70vw] bg-gray-200 border-0 dark:bg-gray-700"/>
                    <PostsGrid postsGridProps={postGridProps}></PostsGrid>
                </div>
            );
        } else {
            return (
                <div className="flex min-h-[88vh] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
                    <h1 className="text-2xl mt-4">אין משתמש מחובר</h1>
                </div>
            );
        }
    }

}
