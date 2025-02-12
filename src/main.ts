import { useContainer, useExpressServer} from "routing-controllers";
import express from "express";
import {Container} from "typedi";
import {storage} from "./config";
import multer from "multer";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

async function bootstrap() {
    useContainer(Container);
    const app = express();

    multer({ storage })

    await mongoose.connect(process.env.DB_URI as string)

    useExpressServer(app, {
        controllers: [__dirname + "/**/*.controller.ts"],
        cors: true,
        routePrefix: 'api',
        classTransformer: true,
        validation: true,
        development: false
    });

    app.listen(process.env.PORT, () => {
        console.log("Server running on port 3000");
    })
}

bootstrap().then()
