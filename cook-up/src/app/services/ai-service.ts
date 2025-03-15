import axios, {AxiosInstance, AxiosResponse} from "axios";
import {IRecipe} from "@server/interfaces/recipe.interface";
import recipes from "@server/routes/recipes";
const apiClient: AxiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAIRecipes: () => Promise<IRecipe[]> = async () => {
    try {
        const response: AxiosResponse = await apiClient.get('/ai/recipes');

        return response ? response.data : [];
    } catch (error: any) {
        console.error('Error getting ai recipes:', error);
        throw error;
    }
}
