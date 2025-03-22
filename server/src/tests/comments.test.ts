import request from 'supertest';
import RecipeModel from "../models/recipe.model";
import {IRecipe} from "../interfaces/recipe.interface";
import server from "../main";
import {IComment} from "../interfaces/comment.interface";
import {IUser} from "../interfaces/user.interface";
import UserModel from "../models/user.model";

const recipeMock: IRecipe = {
    "senderId": "156",
    "timestamp": new Date(),
    "title": "testing post",
    "description": "testing post",
    "ingredients": [],
    "instructions": "test",
    likes: [],
    comments: [
        {
            timestamp: new Date(),
            content: 'test comment',
            senderId: "345",
            comments: [],
        }
    ]
};
const commentMock: IComment = {
    timestamp: new Date(),
    content: 'new comment',
    senderId: "92",
    comments: [],
}

type User = IUser & {
    accessToken?: string,
    refreshToken?: string
  };

const testUser: User = {
    username: "shalev",
    email: "test@user.com",
    password: "Testpassword6677!",
}

beforeAll(async () => {
    const savedRecipe: IRecipe = await RecipeModel.create(recipeMock);
    recipeMock.id = savedRecipe.id;
    recipeMock.comments[0].id = savedRecipe.comments[0].id;
    const response = await request(server).post("/auth/register").send(testUser);
    const response2 = await request(server).post("/auth/login").send(testUser);
    const accessToken = response2.body.accessToken;
    const refreshToken = response2.body.refreshToken;
    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;
    testUser.id = response2.body._id;
})

afterAll(async () => {
    try {
        await RecipeModel.deleteMany({ title: recipeMock.title });
        await UserModel.deleteMany({ email: testUser.email });
    } finally {
        server.close();
    }
});

describe('Comments API', () => {
    describe('POST /comments', () => {
        it('should create a new comment on a recipe', async () => {
            const res = await request(server).post(`/comments/${recipeMock.id}`)
                .send({comment: commentMock})
                .set('Content-Type', 'application/json')
                .set({ authorization: "JWT " + testUser.accessToken });

            expect(res.status).toBe(201);
            expect(res.text).toBe('comment added successfully');

            const recipeInDb: IRecipe = await RecipeModel.findOne({ _id: recipeMock.id }).lean();
            const commentsInDb: IComment[] = recipeInDb.comments;
            expect(commentsInDb).not.toBeNull();
            expect(commentsInDb).toBeInstanceOf(Array);

            const addedCommentInDb: IComment = commentsInDb[1];
            expect(addedCommentInDb).not.toBeNull();
            expect(addedCommentInDb.content).toMatch(commentMock.content);
        });
        
            it('should return an error when the user is not authorized to add a comment', async () => {
                const res = await request(server).post(`/comments/${recipeMock.id}`)
                    .send({ comment: commentMock })
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .set({ authorization: "JWT " + 'invalidAccessToken' });
        
                expect(res.status).toBe(401);
                expect(res.text).toContain('Access Denied');
            });
    });

    describe('GET /comments', () => {
        it('should return a list of comments of recipe', async () => {
            const res = await request(server).get(`/comments/${recipeMock.id}`).set(
                { authorization: "JWT " + testUser.accessToken });

                const comments: IComment[] = res.body.map((comment: any) => {
                    return {id: comment._id, content: comment.content, senderId: comment.senderId}
                });
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(comments[0].content).toMatch(recipeMock.comments[0].content);
        });

        it('should return a comment with id in recipe with id 345', async () => {
            const res = await request(server).get(`/comments/${recipeMock.id}/${recipeMock.comments[0].id}`).set(
                { authorization: "JWT " + testUser.accessToken });
            const comment: any = res.body;
            const retComment = { _id: comment._id, content: comment.content, senderId: comment.senderId, comments: comment.comments, timestamp: comment.timestamp};
            expect(res.status).toBe(200);
            expect(retComment).toMatchObject(comment);
        });
    });

    describe('PUT /comments', () => {
        it('should update comment content', async () => {
            const newCommentFields: Partial<IComment> = { content: 'new comment content' };

            const res = await request(server).put(`/comments/${recipeMock.id}/${recipeMock.comments[0].id}`)
                .send(newCommentFields)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set({ authorization: "JWT " + testUser.accessToken });

            expect(res.status).toBe(200);
            expect(res.text).toContain('comment updated successfully');

            const recipeInDb = await RecipeModel.findOne({  _id: recipeMock.id }).lean();
            const commentsInDb: IComment[] = recipeInDb?.comments;
            expect(commentsInDb).not.toBeNull();
            expect(commentsInDb).toBeInstanceOf(Array);

            const updatedCommentInDb: IComment = commentsInDb.find((comment: any) => String(comment._id) === recipeMock.comments[0].id);
            expect(updatedCommentInDb).not.toBeNull();
            expect(updatedCommentInDb?.content).toBe(newCommentFields.content);
        });
        
        it('should return an error when providing an invalid comment ID for update', async () => {
            const invalidCommentId = 'invalidCommentId';
            const newCommentFields: Partial<IComment> = { content: 'updated comment content' };
    
            const res = await request(server).put(`/comments/${recipeMock.id}/${invalidCommentId}`)
                .send(newCommentFields)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set({ authorization: "JWT " + testUser.accessToken });
    
            expect(res.status).toBe(500);
            expect(res.text).toContain('error while update the comment');
        });
    });
    

    describe('DELETE /comments', () => {
        it('should delete a comment', async () => {
            const res = await request(server).delete(`/comments/${recipeMock.id}/${recipeMock.comments[0].id}`).set(
                { authorization: "JWT " + testUser.accessToken });

            expect(res.status).toBe(200);
            expect(res.text).toContain('comment deleted successfully');

            const recipeInDb = await RecipeModel.findOne({ _id: recipeMock.id }).lean();
            const commentsInDb: IComment[] = recipeInDb?.comments;
            expect(commentsInDb).toBeInstanceOf(Array);

            const updatedCommentInDb: IComment = commentsInDb.find((comment: any) => String(comment._id) === recipeMock.comments[0].id);
            expect(updatedCommentInDb).toBeUndefined();
        });

        it('should return an error when attempting to delete a non-existing comment', async () => {
            const nonExistingCommentId = 'nonExistingCommentId';
    
            const res = await request(server).delete(`/comments/${recipeMock.id}/${nonExistingCommentId}`)
                .set({ authorization: "JWT " + testUser.accessToken });
    
            expect(res.status).toBe(500);
            expect(res.text).toContain('error while deleting comment');
        });
    });
});
