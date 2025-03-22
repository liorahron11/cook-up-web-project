import axios, {AxiosInstance, AxiosResponse} from "axios";
import {IUser} from "@/app/models/user.interface";
const apiClient: AxiosInstance = axios.create({
    baseURL: 'http://localhost:5000/user',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getUserByID: (userId: string) => Promise<IUser> = async (userId: string) => {
    try {
        const response: AxiosResponse = await apiClient.get(`/${userId}`);
        const user: any = response.data;

        if (user) {
            return {id: user._id, username: user.username, email: user.email, profilePictureUrl: user?.profilePictureUrl}
        }

        return {};
    } catch (error: any) {
        console.error('Error getting ai recipes:', error);
        throw error;
    }
}
