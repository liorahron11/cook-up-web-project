import express, {Router} from "express";
import {HydratedDocument} from "mongoose";
import {IUser} from "../interfaces/user.interface";
import {UserQueriesService} from "../queries/user-queries";
import {isUserValid} from "../services/validation-service";
import isStrongPassword from "validator/lib/isStrongPassword";
import isEmail from "validator/lib/isEmail";
import {stringifyUpdatedUserFields} from "../services/query-utils";
import {upload} from "../middlewares/imageUploaderMiddleware";
import {authMiddleware} from "../middlewares/authMiddleware";
const usersRoutes: Router = express.Router();
const userQueryService: UserQueriesService = new UserQueriesService();

/**
* @swagger
* tags:
*   name: Users
*   description: The Users API
*/

usersRoutes.get('/all', async (req, res) => {
    const posts: HydratedDocument<IUser>[] = await userQueryService.getAllUsers();

    if (posts) {
        res.status(200).send(posts);
    } else {
        res.status(500).send();
    }
});

usersRoutes.post('/', async (req, res) => {
    const user: IUser = req.body.user;

    try {
        if (isUserValid(user)) {
            const userAdded: HydratedDocument<IUser> = await userQueryService.addUser(user);

            if (userAdded) {
                res.status(201).send(userAdded);
            } else {
                res.status(500).send('error creating user');
            }
        } else {
            res.status(500).send('user is missing');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

usersRoutes.get('/:id', async (req, res) => {
    const userId: string = req.params.id;
    const user: HydratedDocument<IUser> = await userQueryService.getUserById(userId);

    if (user) {
        res.status(200).send(user);
    } else {
        res.status(500).send('error finding user');
    }
});

usersRoutes.delete('/:id', async (req, res) => {
    const userId: string = req.params.id;
    const isDeleteSuccess: boolean = await userQueryService.deleteUser(userId);

    if (isDeleteSuccess){
        return res.status(200).send("user deleted successfully");
    } else {
        return res.status(500).send("error while deleting user");
    }
});

usersRoutes.put('/:id' ,upload.single('profilePicture'), async (req, res) => {
    let {isPasswordUpdated, isUsernameUpdated, isEmailUpdated, isProfilePictureUpdated}: {isPasswordUpdated: boolean, isUsernameUpdated: boolean, isEmailUpdated: boolean, isProfilePictureUpdated:boolean} = {isPasswordUpdated: false, isUsernameUpdated: false, isEmailUpdated: false, isProfilePictureUpdated: false};
    let moreInfo: string = "";
    const userId: string = req.params.id;

    const password: string = req.body.password?.toString();
    if (password && isStrongPassword(password)) {
        isPasswordUpdated = await userQueryService.updateUserPassword(userId, password);
    } else {
        moreInfo += "password is missing or not strong enough. ";
    }

    var profilePictureUrl: string = null;
    if((req as any).file){
        profilePictureUrl = (req as any).file.path;
    }
    if (profilePictureUrl) {
        isProfilePictureUpdated = await userQueryService.updateUserProfilePicture(userId, profilePictureUrl);
    } else {
        moreInfo += "profile picture is missing ";
    }

    const username: string = req.body.username?.toString();
    if (username) {
        isUsernameUpdated = await userQueryService.updateUserUsername(userId, username);
    } else {
        moreInfo += "username is missing. ";
    }

    const email: string = req.body.email?.toString();
    if (email && isEmail(email)) {
        isEmailUpdated = await userQueryService.updateUserEmail(userId, email);
    } else {
        moreInfo += "email is missing or not valid. ";
    }

    if (isPasswordUpdated || isUsernameUpdated || isEmailUpdated || isProfilePictureUpdated){
        return res.status(200).send(`${stringifyUpdatedUserFields(isPasswordUpdated, isUsernameUpdated, isEmailUpdated, isProfilePictureUpdated)} updated successfully. ${moreInfo}`);
    } else {
        res.status(500).send(`user not found or content up to date. ${moreInfo}`);
    }
});

export default usersRoutes;
