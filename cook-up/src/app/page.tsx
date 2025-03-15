'use client'

import React, {useEffect, useState} from 'react';
import {IRecipe} from "@server/interfaces/recipe.interface";
import {getAIRecipes} from "@/app/services/ai-service";
import {ProgressSpinner} from "primereact/progressspinner";
import RecipePost from "@/app/components/posts";

export default function Home() {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const AIRecipes: IRecipe[] = await getAIRecipes();
        setRecipes(AIRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center m-10">
        <ProgressSpinner/>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center gap-5 m-5">
        {recipes.map((recipe: IRecipe) => {
          return (
            <RecipePost key={recipe.title} postProps={{recipe}}>
            </RecipePost>
          )
        })}
      </div>
    );
  }
}
