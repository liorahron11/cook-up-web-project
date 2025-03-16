import express, {Router} from "express";
import recipesController from "../controllers/recipes-controller";
import {authMiddleware} from "../middlewares/authMiddleware";
import {upload} from "../middlewares/imageUploaderMiddleware";
const recipesRoutes: Router = express.Router();


/**
* @swagger
* tags:
*   name: Recipes
*   description: The Recipes API
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique ID of the comment
 *         senderId:
 *           type: string
 *           description: The ID of the sender of the comment
 *         content:
 *           type: string
 *           description: The content of the comment
 *     Recipe:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique ID of the recipe
 *         senderId:
 *           type: string
 *           description: The ID of the sender of the recipe
 *         content:
 *           type: string
 *           description: The content of the recipe
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: List of comments associated with the recipe
 */



/**
 * @swagger
 * paths:
 *   /posts:
 *     post:
 *       summary: Add a new post
 *       description: Create a new post with the provided content.
 *       tags:
 *         - Posts
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       responses:
 *         201:
 *           description: Post added successfully
 *         500:
 *           description: Error adding post
 */
recipesRoutes.post("/", authMiddleware, upload.single('photo') , recipesController.addRecipe);


/**
 * @swagger
 * paths:
 *   /recipe/all:
 *     get:
 *       summary: Get all recipes
 *       description: Fetch all recipes from the system.
 *       tags:
 *         - recipes
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: List of all recipes
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/recipe'
 *         500:
 *           description: Error fetching recipes
 */
recipesRoutes.get("/all", authMiddleware,recipesController.getAllRecipes);


/**
 * @swagger
 * paths:
 *   /recipes/{id}:
 *     get:
 *       summary: Get a specific recipe by ID
 *       description: Fetch a recipe by its ID.
 *       tags:
 *         - recipes
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the recipe
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: The requested recipe
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Recipe'
 *         500:
 *           description: Error finding recipe
 */
recipesRoutes.get("/:id", authMiddleware, recipesController.getRecipeById);

/**
 * @swagger
 * paths:
 *   /recipes:
 *     get:
 *       summary: Get recipes by sender ID
 *       description: Fetch recipes sent by a specific sender.
 *       tags:
 *         - Recipes
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: query
 *           name: sender
 *           required: true
 *           description: The sender's ID
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: List of recipes from the sender
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Recipe'
 *         500:
 *           description: Error finding recipes
 */
recipesRoutes.get("/", authMiddleware,recipesController.getRecipesBySenderId);

/**
 * @swagger
 * paths:
 *   /recipes/{id}:
 *     put:
 *       summary: Update an existing recipe
 *       description: Update the content of an existing recipe by its ID.
 *       tags:
 *         - recipes
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the recipe to update
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   description: The new content for the recipe
 *       responses:
 *         200:
 *           description: recipe updated successfully
 *         500:
 *           description: Error updating recipe
 */

recipesRoutes.put("/:id", authMiddleware, recipesController.updateRecipe);

export default recipesRoutes;


