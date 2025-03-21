import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {IUser} from "@/app/models/user.interface";
import {getUserFromLocalStorage, LocalStorageUser} from "@/app/services/local-storage.service";
import {CredentialResponse} from "@react-oauth/google";
import {IComment} from "@server/interfaces/comment.interface";
import {extractRecipeImage} from "@/app/services/images.service";
import {IRecipe} from "@server/interfaces/recipe.interface";
const user: LocalStorageUser = getUserFromLocalStorage();

const baseURL:string = 'https://node06.cs.colman.ac.il:4000';

const apiClient: AxiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const reqIncludeFileHeaders = {
    'Authorization': `Bearer ${user?.accessToken}`,
    'Content-Type': 'multipart/form-data',
};

const authHeaders = {
    'Authorization': `Bearer ${user?.accessToken}`
}

export const registerUser = async (data: Partial<IUser>) => {
    try {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    } catch (error: any) {
        console.error('Error registering user:', error.response.data);
        throw error;
    }
}

export const updateUserProfile = async (userId: string, data: FormData) => {
    try {
        const response = await apiClient.put(`/user/${userId}`, data,  {headers: reqIncludeFileHeaders});
        return response.data;
    } catch (error: any) {
        console.error('Error updating user:', error.response.data);
        throw error;
    }
}

export const googleSignin = async (credentialResponse: CredentialResponse) => {
    try {
        const response = await apiClient.post('/auth/googleSignin', credentialResponse);
        return response.data;
    } catch (error: any) {
        console.error('Error registering user using google:', error.response.data);
        throw error;
    }
}

export const userLogin = async (data: Partial<IUser>) => {
    try {
        const response: AxiosResponse = await apiClient.post('/auth/login', data);
        return response.data;
    } catch (error: any) {
        console.error('Error logging in user:', error.response.data);
        throw error;
    }
}
export const getRecipes = async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/recipes/all', {
        headers: authHeaders,
        params: { page, limit }
      });

      const recipes = response.data.recipes || [];
      recipes.forEach((recipe: IRecipe) => {
        if (recipe?.image && !recipe.isAI) {
          recipe.image = baseURL + "/uploads/" + extractRecipeImage(recipe.image);
        }
      });

      return {
        recipes: recipes,
        pagination: response.data.pagination || {
          total: recipes.length,
          page,
          limit,
          totalPages: Math.ceil(recipes.length / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  };

  export const getNextRecipesPage = async (currentPage: number, limit = 10) => {
    return getRecipes(currentPage + 1, limit);
  };

export const getUserRecipes = async (userId: string) => {
    try {
        const response = await apiClient.get(`/recipes?sender=${userId}`, {headers: authHeaders});
        response.data.forEach((recipe: IRecipe) => {
            if(recipe?.image) {
              recipe.image = baseURL + "/uploads/" + extractRecipeImage(recipe.image);
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
};

export const getRecipeById = async (recipeId: string) => {
    try {
        const response = await apiClient.get(`/recipes/${recipeId}`, {headers: authHeaders});
        return response.data;
    } catch (error) {
        console.error('Error fetching recipe:', error);
        throw error;
    }
};

export const createRecipe = async (data: any) => {
    try {
        const response = await apiClient.post('/recipes', data , {headers: reqIncludeFileHeaders});
        return response.data;
    } catch (error) {
        console.error('Error creating recipes:', error);
        throw error;
    }
};

export const postCommentOnPost = (recipeId: string, content: string, parentCommentId?: string) => {
    try {
        const commentToPost: IComment = {
            content: content,
            senderId: user.id,
            comments: [],
            timestamp: new Date(),
        }
        return apiClient.post(`/comments/${recipeId}`, {comment: commentToPost, parentCommentId}, {headers: authHeaders});
    } catch (error) {
        console.error('Error posting comment:', error);
        throw error;
    }
}

export const removeComment = (recipeId: string, commentId: string) => {
    try {
        return apiClient.delete(`/comments/${recipeId}/${commentId}`, {headers: authHeaders});
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
}
