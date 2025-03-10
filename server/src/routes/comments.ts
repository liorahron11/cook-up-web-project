import express, {Router} from "express";
import commentsController from "../controllers/comments-controller";
import {authMiddleware} from "../middlewares/authMiddleware";

const commentsRoutes: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments API
 */

/**
 * @swagger
 * paths:
 *   /comments/{id}:
 *     get:
 *       summary: Get all comments for a specific recipe by recipe ID
 *       description: Fetch all comments for a recipe identified by recipeId.
 *       tags:
 *         - Comments
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the recipe to retrieve comments for
 *           schema:
 *             type: string
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: List of comments for the recipe
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Comment'
 *         500:
 *           description: Error finding comments for the recipe
 */

/**
 * @swagger
 * paths:
 *   /comments/{recipeId}:
 *     recipe:
 *       summary: Add a new comment to a specific recipe
 *       description: Add a new comment to the recipe identified by recipeId.
 *       tags:
 *         - Comments
 *       parameters:
 *         - in: path
 *           name: recipeId
 *           required: true
 *           description: The ID of the recipe to add a comment to
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         201:
 *           description: Comment added successfully
 *         500:
 *           description: Error adding comment to recipe
 */

/**
 * @swagger
 * paths:
 *   /comments/{recipeId}/{commentId}:
 *     put:
 *       summary: Update a comment in a specific recipe
 *       description: Update the content of an existing comment in a recipe identified by recipeId and commentId.
 *       tags:
 *         - Comments
 *       parameters:
 *         - in: path
 *           name: recipeId
 *           required: true
 *           description: The ID of the recipe the comment belongs to
 *           schema:
 *             type: string
 *         - in: path
 *           name: commentId
 *           required: true
 *           description: The ID of the comment to update
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
 *                   description: The new content for the comment
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Comment updated successfully
 *         500:
 *           description: Error updating comment
 */

/**
 * @swagger
 * paths:
 *   /comments/{recipeId}/{commentId}:
 *     delete:
 *       summary: Delete a comment in a recipe
 *       description: Delete a specific comment identified by commentId from the recipe identified by recipeId.
 *       tags:
 *         - Comments
 *       parameters:
 *         - in: path
 *           name: recipeId
 *           required: true
 *           description: The ID of the recipe the comment belongs to
 *           schema:
 *             type: string
 *         - in: path
 *           name: commentId
 *           required: true
 *           description: The ID of the comment to delete
 *           schema:
 *             type: string
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Comment deleted successfully
 *         500:
 *           description: Error deleting comment
 */

/**
 * @swagger
 * paths:
 *   /comments/{recipeId}/{commentId}:
 *     get:
 *       summary: Get a specific comment from a recipe by its ID
 *       description: Fetch a specific comment identified by commentId from the recipe identified by recipeId.
 *       tags:
 *         - Comments
 *       parameters:
 *         - in: path
 *           name: recipeId
 *           required: true
 *           description: The ID of the recipe the comment belongs to
 *           schema:
 *             type: string
 *         - in: path
 *           name: commentId
 *           required: true
 *           description: The ID of the comment to retrieve
 *           schema:
 *             type: string
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: The requested comment
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Comment'
 *         500:
 *           description: Error finding comment
 */

commentsRoutes.get("/:id", authMiddleware, commentsController.getCommentsById);
commentsRoutes.post("/:recipeId", authMiddleware, commentsController.addCommentToRecipe);
commentsRoutes.put("/:recipeId/:commentId", authMiddleware, commentsController.updateComment);
commentsRoutes.delete("/:recipeId/:commentId", authMiddleware, commentsController.deleteComment);
commentsRoutes.get("/:recipeId/:commentId", authMiddleware, commentsController.getSpecificComment);

export default commentsRoutes;
