import React, {ReactElement} from 'react';
import {IRecipe} from "@server/interfaces/recipe.interface";
import moment from "moment";
import 'moment/locale/he';
import {IUser} from "@/app/models/user.interface";
moment.locale('he');

export interface RecipePostProps {
    recipe: IRecipe | null;
    user?: IUser | null;
}

export default function RecipePost({postProps}: {postProps: RecipePostProps}) {
    const recipe: IRecipe | null = postProps.recipe;
    const user: IUser | null | undefined = postProps.user;
    let userSection: ReactElement | null = null;
    const aiLogo: ReactElement = (<img src="gemini-logo.svg" alt="נוצר באמצעות AI" />)
    if (user) {
        userSection = (<div className="px-6 mt-4">
                        <span className="font-medium text-md inline-block hover:text-indigo-600 transition duration-500 ease-in-out inline-block flex flex row gap-2">
                            {user?.username}
                            {user?.username === 'CookUp - AI' ? aiLogo : null}
                        </span>
                    </div>)
    }

    if (recipe) {
        return (
            <div className="rounded overflow-hidden shadow-lg flex flex-col w-1/3">
                <div className="relative h-auto">
                    <img className=""
                         src={recipe.image}
                         alt="recipe image"/>
                    <div
                        className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
                    </div>
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
                <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
                <span  className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
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

                    <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                    <svg className="h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">
                        </path>
                    </svg>
                    <span className="mr-1">{recipe.comments.length} תגובות</span>
                </span>
                </div>
            </div>);
    }

    return null;
};

