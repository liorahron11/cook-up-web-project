'use client'

import React, {useEffect, useState} from 'react';
import {IRecipe} from "@server/interfaces/recipe.interface";
import {getAIRecipes} from "@/app/services/ai-service";
import {ProgressSpinner} from "primereact/progressspinner";
import RecipePost from "@/app/components/posts";
import {getUserByID} from "@/app/services/users-service";
import {IUser} from "@/app/models/user.interface";
import {getRecipes} from "@/app/services/rest.service";

export default function Home() {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecipesData = async () => {
      try {
        const AIRecipes: IRecipe[] = await getAIRecipes();
        const usersRecipes: IRecipe[] = await getRecipes();
        const feedRecipes: IRecipe[] = AIRecipes.concat(usersRecipes);  
        setRecipes(feedRecipes);

        const usersData: (IUser)[] = await Promise.all(
            feedRecipes.map(async (recipe: IRecipe) => {
              return await getUserByID(recipe.senderId);
            })
        );

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipesData();
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
            <RecipePost key={recipe.title} postProps={{recipe, user: users.find((user: IUser) => user.id === recipe.senderId)}}>
            </RecipePost>
          )
        })}
      </div>
    );
  }
}
