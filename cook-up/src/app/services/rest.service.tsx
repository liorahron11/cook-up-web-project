import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {IUser} from "@/app/models/user.interface";
import {getUserFromLocalStorage, LocalStorageUser} from "@/app/services/local-storage.service";
import {CredentialResponse} from "@react-oauth/google";
import {IComment} from "@server/interfaces/comment.interface";
const user: LocalStorageUser = getUserFromLocalStorage();

const apiClient: AxiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

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
    const headers = {
        'Authorization': `Bearer ${user.accessToken}`,
        'Content-Type': 'multipart/form-data',
    };
    try {
        const response = await apiClient.put(`/user/${userId}`, data,  {headers: headers});
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
        const response = await apiClient.get('/recipes/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
};

export const getUserRecipes = async (userId: string) => {
    try {
        const response = await apiClient.get(`/recipes?sender=${userId}`, {headers: {Authorization: `Bearer ${user.accessToken}`}});
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
};

export const getRecipeById = async (recipeId: string) => {
    try {
        const response = await apiClient.get(`/recipes/${recipeId}`, {headers: {Authorization: `Bearer ${user.accessToken}`}});
        return response.data;
    } catch (error) {
        console.error('Error fetching recipe:', error);
        throw error;
    }
};

export const createRecipe = async (data: any) => {
    try {
        const response = await apiClient.post('/recipes', data, {headers: {Authorization: `Bearer ${user.accessToken}`}});
        return response.data;
    } catch (error) {
        console.error('Error creating recipes:', error);
        throw error;
    }
};

export const postCommentOnPost = (recipeId: string, content: string) => {
    try {
        const commentToPost: IComment = {
            content: content,
            senderId: user.id,
            comments: [],
            timestamp: new Date(),
        }
        return apiClient.post(`/comments/${recipeId}`, {comment: commentToPost}, {headers: {Authorization: `Bearer ${user.accessToken}`}});
    } catch (error) {
        console.error('Error posting comment:', error);
        throw error;
    }
}