import {connectToDB} from "./services/mongo-handler";
import postsRoutes from './routes/posts';
import express, {Express} from 'express';
import cors from 'cors';
import commentsRoutes from "./routes/comments";
import usersRoutes from "./routes/users";
require('dotenv').config()

const app: Express = express();
app.use(express.json());
app.use(cors());

const initRoutes = (app: Express) => {
    app.use('/post', postsRoutes);
    app.use('/comment', commentsRoutes);
    app.use('/user', usersRoutes);
};

const runApp = (app: Express) => {
    const port: number = Number(process.env.port);

    return app.listen(port, () => {
        return console.log(`app is running at port ${port}`);
    });
}

connectToDB();
initRoutes(app);
const server = runApp(app);

export default server;