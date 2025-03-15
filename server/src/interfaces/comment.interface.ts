export interface IComment {
    id?: string;
    timestamp: Date;
    senderId: string;
    content: string;
    comments: IComment[];
    likes: number;
}