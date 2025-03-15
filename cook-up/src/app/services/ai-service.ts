import axios, {AxiosInstance} from "axios";
import {IRecipe} from "@server/interfaces/recipe.interface";

const apiClient: AxiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAIRecipes = async () => {
    try {
        const response = await apiClient.get('/ai/recipes');
        return response.data;
    } catch (error: any) {
        console.error('Error getting ai recipes:', error.response.data);
        throw error;
    }
}
