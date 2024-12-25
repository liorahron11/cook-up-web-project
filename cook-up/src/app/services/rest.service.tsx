import axios, {AxiosInstance} from 'axios';
import {IUser} from "@/app/models/user.interface";
export interface IUserBody {
    user: Partial<IUser>;
}
const apiClient: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const registerUser = async (data: IUserBody) => {
    try {
        const response = await apiClient.post('/user', data);
        return response.data;
    } catch (error: any) {
        console.error('Error registering user:', error.response.data);
        throw error;
    }
}

export const userLogin = async (data: IUserBody) => {
    try {
        const response = await apiClient.post('/user/login', data);
        return response.data.user;
    } catch (error: any) {
        console.error('Error logging in user:', error.response.data);
        throw error;
    }
}

export const getPosts = async () => {
    try {
        const response = await apiClient.get('/post/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const createPost = async (data: any) => {
    try {
        const response = await apiClient.post('/post', data);
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};
