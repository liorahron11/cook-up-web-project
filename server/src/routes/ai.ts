import express, {Router} from "express";
import {generateRecipes} from "../queries/gemini-queries";
import {IRecipe} from "../interfaces/recipe.interface";
import {rateLimitMiddleware} from "../middlewares/rate-limit.middleware";
const aiRoutes: Router = express.Router();
/**
* @swagger
* tags:
*   name: AI
*   description: The AI API
*/

aiRoutes.get('/recipes', rateLimitMiddleware, async (req, res) => {
    const geminiRecipes: IRecipe[] = await generateRecipes();
    if (geminiRecipes?.length) {
        res.status(200).json(geminiRecipes);
    } else {
        res.status(500).send();
    }
});

export default aiRoutes;
