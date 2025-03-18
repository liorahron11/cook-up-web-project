import React, {ReactElement, useState} from 'react';
import {IRecipe} from "@server/interfaces/recipe.interface";
import moment from "moment";
import 'moment/locale/he';
import {IUser} from "@/app/models/user.interface";
import { Tooltip } from 'primereact/tooltip';
import Link from "next/link";
import {Dialog} from "primereact/dialog";
import PostDetails from "@/app/components/post-details";
import {getUserFromLocalStorage, LocalStorageUser} from "@/app/services/local-storage.service";
import {handleLike, handleDislike} from "@/app/services/rest.service";
moment.locale('he');

export interface RecipePostProps {
    recipe: IRecipe | null;
    user?: IUser | null;
}

export default function RecipePost({postProps}: {postProps: RecipePostProps}) {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const loggedUser: LocalStorageUser = getUserFromLocalStorage();
    const recipe: IRecipe | null = postProps.recipe;
    const user: IUser | null | undefined = postProps.user;
    const [liked, setLiked] = useState<boolean>(recipe?.likes?.includes(loggedUser.id) || false);
    const [likeCount, setLikeCount] = useState<number>(recipe?.likes?.length || 0);

    let userSection: ReactElement | null = null;
    const headerContent: ReactElement = (<div className=""><h2>{user?.username}</h2></div>);

    const aiLogo: ReactElement = (<div className="flex flex-row items-center justify-center">
        <Tooltip target=".gemini-logo" position="mouse" />
        <img className="gemini-logo" src="gemini-logo.svg" alt="נוצר באמצעות AI" data-pr-tooltip="נוצר באמצעות AI" />
    </div>)

    if (user) {
        userSection = (<div className="px-6 mt-4">
            <span className="font-medium text-md inline-block hover:text-indigo-600 transition duration-500 ease-in-out inline-block">
               <Link className="flex flex-row gap-2" href="/user-profile/[userId]" as={`/user-profile/${user.id}`}>
                   {recipe?.isAI ? 'CookUp - AI' : user?.username}
                   {recipe?.isAI ? aiLogo : null}
               </Link>
            </span>
            </div>)
    }

    const handleLikeClick = async () => {
        let isOperationSuccess: boolean;
        if(liked) {
            isOperationSuccess = await handleDislike(loggedUser.id, recipe?._id as string);
        } else {
            isOperationSuccess = await handleLike(loggedUser.id, recipe?._id as string);
        }

       if(isOperationSuccess) {
        setLiked(!liked);
        setLikeCount(prevCount => liked ? prevCount - 1 : prevCount + 1);
       }
    };


    if (recipe) {
        return (
            <div className=" w-1/3">
            <div className="rounded overflow-hidden shadow-lg flex flex-col">
                <div onClick={() => setIsVisible(true)}>
                    <div className="relative h-auto">
                        <img
                            src={recipe.image}
                            alt="recipe image"/>
                    </div>
                    {userSection}
                    <div className="px-6 py-4 mb-auto">
                    <span
                        className="font-medium text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out inline-block mb-2">
                        {recipe.title}</span>
                        <p className="text-gray-500 text-sm">
                            {recipe.description}
                        </p>
                    </div>
                </div>
                <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
                    <div className="flex flex-row items-center">
                        <span className="py-1 text-xs font-regular text-gray-900 mr-3 flex flex-row items-center">
                            <svg height="13px" width="13px" version="1.1" id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px"
                                y="0px" viewBox="0 0 512 512"
                                xmlSpace="preserve">
                                <g>
                                    <g>
                                        <path
                                            d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M277.333,256 c0,11.797-9.536,21.333-21.333,21.333h-85.333c-11.797,0-21.333-9.536-21.333-21.333s9.536-21.333,21.333-21.333h64v-128 c0-11.797,9.536-21.333,21.333-21.333s21.333,9.536,21.333,21.333V256z">
                                        </path>
                                    </g>
                                </g>
                            </svg>
                            <span className="mr-1" title={moment(recipe.timestamp).format('DD-MM-YYYY HH:mm')}>{moment(recipe.timestamp).fromNow()}</span>
                        </span>

                        <span className="py-1 text-xs font-regular text-gray-900 mr-3 flex flex-row items-center">
                            <svg className="h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">
                                </path>
                            </svg>
                            <span className="mr-1">{recipe.comments.length} תגובות</span>
                        </span>
                    </div>

                    <button
                        onClick={handleLikeClick}
                        className={`flex flex-row items-center focus:outline-none transition duration-300 ease-in-out border rounded-md px-3 py-1 ${liked ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:bg-gray-50'}`}
                        aria-label="לייק"
                    >
                        <div className="w-6 h-6 flex items-center justify-center">
                            {liked ? (
                                <svg className="w-5 h-5" fill="#E53E3E" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            )}
                        </div>
                        <span className="mr-1 text-xs font-medium text-gray-900">{likeCount} לייקים</span>
                    </button>
                </div>
            </div>
                <Dialog draggable={false} header={headerContent} visible={isVisible} style={{ width: '50vw' }} onHide={() => {if (!isVisible) return; setIsVisible(false); }}>
                    <PostDetails recipe={recipe}></PostDetails>
                </Dialog>
            </div>
                );
    }

    return null;
};