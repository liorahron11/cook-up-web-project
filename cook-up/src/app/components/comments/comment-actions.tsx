import React, {RefObject, useRef} from "react";
import { Menu } from 'primereact/menu';
import {IRecipe} from "@server/interfaces/recipe.interface";
import {MenuItem} from "primereact/menuitem";
import {removeComment} from "@/app/services/rest.service";

export default function CommentActions({ recipe, commentId, reloadEvent }: { recipe: IRecipe, commentId: string, reloadEvent: () => void }) {
    const menuLeft: RefObject<any> = useRef(null);
    const items: MenuItem[] = [
        {
            items: [
                {
                    label: 'הסר',
                    icon: 'pi pi-times',
                    command: async () => {
                        await removeComment(recipe.id as string, commentId);
                        reloadEvent();
                    }
                }
            ]
        }
    ];

    return (<div>
        <button id="dropdownComment1Button" onClick={(event) => menuLeft.current.toggle(event)}
                className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                type="button">
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 fill="currentColor" viewBox="0 0 16 3">
                <path
                    d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
            </svg>
            <span className="sr-only">אפשרויות</span>
        </button>
        <Menu model={items} popup ref={menuLeft}  id="popup_menu_left" />
    </div>);
}
