// lior-aharon-212211684-shalev-lavyoud-322930561

import {connectToDB} from "./services/mongo-handler";
import express, {Express} from 'express';
import cors from 'cors';
import commentsRoutes from "./routes/comments";
import authRoutes from "./routes/auth";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import usersRoutes from "./routes/users";
import recipesRoutes from "./routes/recipes";
import aiRoutes from "./routes/ai";
import https from "https";
import fs from "fs";
require('dotenv').config();

 const options = {
    definition: {
    openapi: "3.0.0",
    info: {
        title: "API For CookUp Server",
        version: "1.0.0",
        description: "REST server including authentication using JWT",
    },
        servers:
            [{url: `http://localhost:${process.env.PORT}`,},
            {url: `http://10.10.246.6`,},
            {url: `https://10.10.246.6`,}, {url: `https://node06.cs.colman.ac.il:4000`,}
        ],
    },
    apis: ["./src/routes/*.ts"],
 };
 const specs = swaggerJsDoc(options);

const app: Express = express();
app.use(express.json());
app.use(cors());

const initRoutes = (app: Express) => {
    app.use('/uploads', express.static('Images'));
    app.use('/recipes', recipesRoutes);
    app.use('/ai', aiRoutes);
    app.use('/comments', commentsRoutes);
    app.use('/user', usersRoutes);
    app.use('/auth', authRoutes);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
};

const runApp = (app: Express) => {
    const port: number = Number(process.env.PORT);
    if(process.env.NODE_ENV != "production"){ 
        return app.listen(port, () => {
            return console.log(`app is running at port ${port}`);
        });
    } else {
        const prop = {
            key: fs.readFileSync("../../client-key.pem"),
            cert: fs.readFileSync("../../client-cert.pem")
        }
        console.log(`app is running at port ${port} on prod mode `);
        https.createServer(prop, app).listen(port);
    }
}

connectToDB();
initRoutes(app);
const server = runApp(app);

export default server;
