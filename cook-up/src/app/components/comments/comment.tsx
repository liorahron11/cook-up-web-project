import React from "react";
import {IComment} from "@server/interfaces/comment.interface";
import CommentHeader from "@/app/components/comments/comment-header";
import {IUser} from "@/app/models/user.interface";
import Divider from "@/app/login/divider";

export default function Comment({ comment, user }: { comment: IComment, user: IUser }) {
    return (<article className="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
                    <CommentHeader user={user} timestamp={comment.timestamp}></CommentHeader>
                    <p className="text-gray-500 dark:text-gray-400">{comment.content}</p>
                    <div className="flex items-center mt-4 space-x-4">
                        <button type="button"
                                className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                            <svg className="ml-1.5 w-3.5 h-3.5" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 20 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                            </svg>
                            השב
                        </button>
                    </div>
                    {comment?.comments?.map((comment: IComment) =>
                        (<div key={comment.id} className="mr-2">
                            <Comment key={comment.id} comment={comment} user={user}></Comment>
                            <Divider label=""></Divider>
                        </div>))}
    </article>);
}