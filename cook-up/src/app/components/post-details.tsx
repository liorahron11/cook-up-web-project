import React from "react";
import {IRecipe} from "@server/interfaces/recipe.interface";
import {IIngredient} from "@server/interfaces/ingredients.interface";
import CommentsSection from "@/app/components/comments/comments-section";
import Divider from "@/app/login/divider";
import {EIngredientUnit} from "@/app/enums/ingredient-unit.enum";

export default function PostDetails({recipe}: { recipe: IRecipe }) {
    return (                    <div className="m-0">
            <div className="relative h-1/3 w-auto justify-center items-center flex">
                <img className="h-[40vh] w-auto rounded "
                     src={`${recipe?.image || "recipe.jpg"}`}
                     alt="recipe image"/>
            </div>
            <div className="px-6 py-4 mb-auto">
                <h1 className=" font-bold text-lg  mb-2">{recipe.title}</h1>
                <p className="text-sm mb-5">
                    {recipe.description}
                </p>
                <div className='mb-5'>
                    <h2 className="font-bold">מצרכים:</h2>
                    <div className="flex flex-col">
                        {recipe.ingredients.map((ingredient: IIngredient) => (<span className="text-sm" key={ingredient.name}>{ingredient.quantity} {(EIngredientUnit as any)[ingredient.unit]} {ingredient.name}</span>))}
                    </div>
                </div>
                <div className='mb-5'>
                    <h2 className="font-bold">הוראות הכנה:</h2>
                    <p className="text-sm" style={{ whiteSpace: "pre-line" }}>
                        {recipe.instructions}
                    </p>
                </div>
                <Divider label=""></Divider>
                {<div className='mb-5 mt-5'><h2 className="font-bold mb-5">תגובות</h2><CommentsSection recipe={recipe}></CommentsSection></div>}
            </div>
        </div>
    );
}