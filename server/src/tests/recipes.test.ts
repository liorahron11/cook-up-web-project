import request from 'supertest';
import RecipeModel from "../models/recipe.model";
import {IRecipe} from "../interfaces/recipe.interface";
import server from "../main";
import {IUser} from "../interfaces/user.interface";
import UserModel from '../models/user.model';

const recipeMock: IRecipe = {
    "senderId": "155",
    "timestamp": new Date(),
    "title": "testing recipe",
    "description": "testing recipe",
    "ingredients": [],
    "instructions": "test",
    "comments": []
};

type User = IUser & {
    accessToken?: string,
    refreshToken?: string
  };

const testUser: User = {
    username: "shalev",
    email: "test@user.com",
    password: "Testpassword6677!",
  }

afterAll(async () => {
    try {
        await RecipeModel.deleteMany({ title: recipeMock.title });
        await UserModel.deleteMany({ email: testUser.email });
    } finally {
        server.close();
    }
});

beforeAll(async () => {
    await request(server).post("/auth/register").send(testUser);
    const response = await request(server).post("/auth/login").send(testUser);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;
    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;
    testUser.id = response.body._id;
})

describe('Recipes API', () => {
    describe('POST /recipes', () => {
        it('should create a new recipe', async () => {
            const res = await request(server).post('/recipes')
                .send({recipe: recipeMock})
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set({ authorization: "JWT " + testUser.accessToken });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('recipe added successfully');
            expect(res.body.recipeId).toBeDefined();
            recipeMock.id = res.body.recipeId;

            const recipeInDb = await RecipeModel.findOne({ _id: recipeMock.id });
            expect(recipeInDb).not.toBeNull();
            expect(recipeInDb?.title).toBe('testing recipe');
        });
    });

    describe('GET /recipes', () => {
        it('should return a list of recipes', async () => {
            const res = await request(server).get('/recipes/all').set(
                { authorization: "JWT " + testUser.accessToken });
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should return a recipe with mock recipe id ', async () => {

            const res = await request(server).get(`/recipes/${recipeMock.id}`).set(
                { authorization: "JWT " + testUser.accessToken });
            expect(res.status).toBe(200);
            expect(res.body._id).toBe(recipeMock.id);
        });

        it('should return a recipes with senderID 155', async () => {
            const res = await request(server).get('/recipes?sender=155').set(
                { authorization: "JWT " + testUser.accessToken });
            expect(res.status).toBe(200);

            const recipes: IRecipe[] = res.body.map((recipe: any) => {
                return {id: recipe._id, comments: recipe.comments, title: recipe.title, senderId: recipe.senderId}
            });
            expect(recipes).toBeInstanceOf(Array);
        });
    });


    describe('PUT /recipes', () => {
        it('should update recipe content', async () => {

            const newRecipesFields: Partial<IRecipe> = { title: 'new recipes title' };

            const res = await request(server).put(`/recipes/${recipeMock.id}`)
                .send(newRecipesFields)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set({ authorization: "JWT " + testUser.accessToken });

            expect(res.status).toBe(200);
            expect(res.text).toContain('updated successfully');

            const recipeInDb = await RecipeModel.findOne({ _id: recipeMock.id });
            await RecipeModel.updateOne({ _id: recipeInDb.id }, { $set: { title: recipeMock.title } });
            expect(recipeInDb).not.toBeNull();
            expect(recipeInDb?.title).toBe(newRecipesFields.title);
        });
    });

    describe('Recipes API - Failures', () => {
        describe('POST /recipes', () => {
            it('should fail when required fields are missing', async () => {
                const invalidRecipeMock = {
                    // Missing 'senderId' and 'content' which are required
                    comments: []
                };
    
                const res = await request(server).post('/recipes')
                    .send({ recipe: invalidRecipeMock })
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .set({ authorization: "JWT " + testUser.accessToken });
    
                // Expect failure because required fields are missing
                expect(res.status).toBe(500); // Server responds with 500 according to the controller
                expect(res.text).toBe('error adding recipe'); // Error message from the controller
            });
    
            it('should fail when user is unauthorized', async () => {
                const recipeMockWithValidData = {
                    senderId: "155",
                    title: "testing recipe",
                    comments: []
                };
    
                // Simulating a missing authorization header
                const res = await request(server).post('/recipes')
                    .send({ recipe: recipeMockWithValidData })
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json');
    
                // Expect failure because the user is not authorized
                expect(res.status).toBe(401); // Controller returns 500 for unauthorized access
                expect(res.text).toBe('Access Denied');
            });
    
  
        });
    
        describe('GET /recipes', () => {
            it('should fail when recipe not found by id', async () => {
                // Using a non-existent recipeId
                const nonExistentRecipesId = "1234567890abcdef";
    
                const res = await request(server).get(`/recipes/${nonExistentRecipesId}`).set(
                    { authorization: "JWT " + testUser.accessToken });
    
                // Expect failure due to recipe not being found
                expect(res.status).toBe(500); // Controller returns 500 if recipe is not found
                expect(res.text).toBe('error finding recipe'); // Error message from the controller
            });
    
            it('should fail when senderId is missing in query', async () => {
                const res = await request(server).get('/recipes').set(
                    { authorization: "JWT " + testUser.accessToken });
    
                // Expect failure because senderId is missing in query
                expect(res.status).toBe(500); // Controller returns 500 when senderId is not provided
                expect(res.text).toBe('sender ID should be a number');
            });
        });
    });
    
});
