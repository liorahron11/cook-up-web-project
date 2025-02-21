import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {IUser} from "@/app/models/user.interface";
import {getUserFromLocalStorage, LocalStorageUser} from "@/app/services/local-storage.service";
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

export const userLogin = async (data: Partial<IUser>) => {
    try {
        const response: AxiosResponse = await apiClient.post('/auth/login', data);
        return response.data;
    } catch (error: any) {
        console.error('Error logging in user:', error.response.data);
        throw error;
    }
}

export const getPosts = async () => {
    try {
        const response = await apiClient.get('/posts/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const getUserPosts = async () => {
    try {
        const response = await apiClient.get(`/posts?sender=${user.id}`, {headers: {Authorization: `Bearer ${user.accessToken}`}});
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const createPost = async (data: any) => {
    try {
        const response = await apiClient.post('/posts', data);
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};
