import React, {useEffect, useState} from "react";
import {IComment} from "@server/interfaces/comment.interface";
import {Button} from "primereact/button";
import CommentHeader from "@/app/components/comment-header";
import {IUser} from "@/app/models/user.interface";
import {getUserByID} from "@/app/services/users-service";
import {ProgressSpinner} from "primereact/progressspinner";
import Comment from "@/app/components/comment";

export default function CommentsSection({ comments }: { comments: IComment[] }) {
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        const fetchCommentsData = async () => {
            try {
                const senderIds: string[] = comments.map((comment: IComment) => comment.senderId);
                const usersData: (IUser)[] = await Promise.all(
                    senderIds.map(async (id: string) => {
                        return await getUserByID(id);
                    })
                );

                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCommentsData();
    }, []);

    if (loading) {
        return <div className="flex flex-col items-center justify-center m-10">
            <ProgressSpinner/>
        </div>;
    }

    return (<section>
            <div className="max-w-2xl  px-4">
                <form className="mb-6">
                    <div
                        className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <label htmlFor="comment" className="sr-only">Your comment</label>
                        <textarea id="comment"
                                  className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                  placeholder="כתוב תגובה..." required></textarea>
                    </div>
                    <Button type="submit"
                            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                        פרסם
                    </Button>
                </form>
                {comments.map((comment: IComment) => <Comment comment={comment} user={users.find((user: IUser) => user.id === comment.senderId) as IUser} key={comment.id}></Comment>)}
            </div>
        </section>);
}