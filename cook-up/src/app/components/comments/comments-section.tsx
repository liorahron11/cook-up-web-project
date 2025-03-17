import React, {useEffect, useState} from "react";
import {IComment} from "@server/interfaces/comment.interface";
import {IUser} from "@/app/models/user.interface";
import {getUserByID} from "@/app/services/users-service";
import {ProgressSpinner} from "primereact/progressspinner";
import Comment from "@/app/components/comments/comment";
import AddComment from "@/app/components/comments/add-comment";
import {IRecipe} from "@server/interfaces/recipe.interface";
import {getRecipeById} from "@/app/services/rest.service";
import Divider from "@/app/login/divider";

export default function CommentsSection({ recipe }: { recipe: IRecipe }) {
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<IUser[]>([]);
    const [recipeData, setRecipeData] = useState<IRecipe>(recipe);

    const reloadData = async () => {
        try {
            setLoading(true);
            const newRecipe = await getRecipeById(recipe.id as string);
            setRecipeData(newRecipe);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCommentsData = async () => {
            try {
                let senderIds: string[] = recipeData.comments.map((comment: IComment) => comment.senderId);
                senderIds = Array.from(new Set(senderIds));
                const usersData: IUser[] = await Promise.all(
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
    }, [recipeData]); // ✅ Fetch data whenever recipeData updates

    if (loading) {
        return <div className="flex flex-col items-center justify-center m-10">
            <ProgressSpinner/>
        </div>;
    }

    return (
        <section>
            <div className="max-w-2xl px-4">
                <AddComment reloadEvent={reloadData} recipe={recipeData} />
                {recipeData.comments.map((comment: IComment) => (
                    <div key={comment.id}>
                        <Comment
                            comment={comment}
                            user={users.find((user: IUser) => user.id === comment.senderId) as IUser}
                            key={comment.id}
                        />
                        <Divider label=""></Divider>
                    </div>))}
            </div>
        </section>
    );
}