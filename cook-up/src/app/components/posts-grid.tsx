import React from 'react';
import {IRecipe} from "@server/interfaces/recipe.interface";
import RecipePost from "@/app/components/posts";

export interface PostsGridProps {
    posts: IRecipe[] | null;
    onUpdate?: () => void
}

export default function PostsGrid({postsGridProps}: {postsGridProps: PostsGridProps}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {postsGridProps.posts?.map((recipe: IRecipe) => <RecipePost key={recipe.id} postProps={{recipe: recipe, onUpdate: postsGridProps.onUpdate}}></RecipePost>)}
        </div>);
};

