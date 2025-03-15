"use client"
import React, { useState, useEffect } from "react";
import {IRecipe} from "@server/interfaces/recipe.interface";
import {Button} from "primereact/button";
import { Heart, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import {getRecipes} from "@/app/services/rest.service";
  
import { getUserFromLocalStorage } from "@/app/services/local-storage.service";
import {getUserRecipes} from "@/app/services/rest.service";
import { LocalStorageUser } from "@/app/services/local-storage.service";

export default function Home() {
  const [recipes, setRecipes] = useState<IRecipe[] | null>(null);
  const currentUser: LocalStorageUser = getUserFromLocalStorage();
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    loadRecipes();
  }, []);


  const loadRecipes = async () => {
    console.log("load recipess");
    const userPosts: IRecipe[] = await getUserRecipes();
    const posts: IRecipe[] = await getRecipes();
    console.log(posts);
    // const data = await Recipe.list("-created_date");
    setRecipes(posts);
    setIsLoading(false);
  };

  const toggleComments = (recipeId) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
  };

  const handleLike = async (recipe: IRecipe) => {
    if (!currentUser) {
      // Prompt user to login
      // await User.login();
      return;
    }

    const likes = recipe.likes || [];
    const isLiked = likes.includes(currentUser.email);
    const updatedLikes = isLiked
      ? likes.filter(email => email !== currentUser.email)
      : [...likes, currentUser.email];

    // await Recipe.update(recipe.id, { likes: updatedLikes });
    loadRecipes();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen" style={{ backgroundColor: "#e5e7eb", direction: "ltr" }}>Loading recipes...</div>;
  }

  return (
    <div className="flex flex-col space-y-6 min-h-screen p-4" style={{ backgroundColor: "#e5e7eb", direction: "ltr" }}>
      {recipes.map(recipe => (
        <div key={recipe.id} className="bg-white rounded-xl shadow-sm overflow-hidden" dir="ltr">
          <img 
            src="https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=1&amp;w=500"
            alt={recipe.title}
            className="w-full h-96 object-cover"
          />
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                
              </div>
              <div className="flex flex-col">
                <p className="font-medium text-gray-900">{recipe.senderName.toUpperCase()}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(recipe.timestamp), "MMM d, yyyy")}
                </p>
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-2 text-gray-900">{recipe.title}</h2>
            <p className="text-gray-600 mb-4">{recipe.description}</p>
            
            <div className="flex items-center gap-6 mb-4">
              <Button
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  currentUser && recipe.likes?.includes(currentUser.email)
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => handleLike(recipe)}
              >
                <Heart className={`w-5 h-5 ${
                  currentUser && recipe.likes?.includes(currentUser.email)
                  ? "fill-current"
                  : ""
                }`} />
                <span className="font-medium">{recipe.likes?.length || 0}</span>
              </Button>
              
              <Button 
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-all duration-200"
                onClick={() => toggleComments(recipe.id)}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{recipe.comments.length} Comment</span>
              </Button>
            </div>

            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 text-gray-900">Ingredients:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i} className="pl-1">{ingredient.quantity} {ingredient.unit} - {ingredient.name} </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 text-gray-900">Instructions:</h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  {recipe.instructions}
                </ol>
              </div>

          </div>
        </div>
      ))}
    </div>
  );
}