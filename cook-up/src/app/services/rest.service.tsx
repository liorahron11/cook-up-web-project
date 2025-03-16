import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {IUser} from "@/app/models/user.interface";
import {getUserFromLocalStorage, LocalStorageUser} from "@/app/services/local-storage.service";
import {CredentialResponse} from "@react-oauth/google";
import {IRecipe} from "@server/interfaces/recipe.interface";
const user: LocalStorageUser = getUserFromLocalStorage();

const baseURL:string = 'http://localhost:5000';

const apiClient: AxiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const reqIncludeFileHeaders = {
    'Authorization': `Bearer ${user.accessToken}`,
    'Content-Type': 'multipart/form-data',
};

const authHeaders = {
    'Authorization': `Bearer ${user.accessToken}`
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

export const getRecipes = async () => {
    try {
        const response = await apiClient.get('/recipes/all', {headers: authHeaders});
        response.data.forEach(recipe => {
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

export const getUserRecipes = async (userId: string) => {
    try {
        const response = await apiClient.get(`/recipes?sender=${userId}`, {headers: authHeaders});
        response.data.forEach(recipe => {
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

export const createRecipe = async (data: any) => {
    try {
        const response = await apiClient.post('/recipes', data , {headers: reqIncludeFileHeaders});
        return response.data;
    } catch (error) {
        console.error('Error creating recipes:', error);
        throw error;
    }
};

const extractRecipeImage = (input: string): string | null => {
    const match = input.match(/photo\-[\w\-]+\.\w{3,4}/);
    return match ? match[0] : null;
  };
