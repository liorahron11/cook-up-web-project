import axios, {AxiosInstance, AxiosResponse} from "axios";
import {IUser} from "@/app/models/user.interface";
import {serverUrl} from "@/app/consts";
const apiClient: AxiosInstance = axios.create({
    baseURL: `${serverUrl}/user`,
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
