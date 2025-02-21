import React from 'react';
import {IPost} from "@server/interfaces/post.interface";
import Post from "@/app/components/posts";

export interface PostsGridProps {
    posts: IPost[] | null;
}

export default function PostsGrid({postsGridProps}: {postsGridProps: PostsGridProps}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {postsGridProps.posts?.map((post: IPost) => <Post key={post.title} postProps={{post}}></Post>)}
        </div>);
};

