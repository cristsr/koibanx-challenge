import { useContainer, useExpressServer} from "routing-controllers";
import express from "express";
import {Container} from "typedi";
import {storage} from "./config";
import multer from "multer";
import mongoose from "mongoose";

async function bootstrap() {
    useContainer(Container);
    const app = express();

    multer({ storage })

    await mongoose.connect("mongodb://localhost:27017/koibanx",)

    useExpressServer(app, {
        controllers: [__dirname + "/**/*.controller.ts"],
        cors: true,
        routePrefix: 'api',
        classTransformer: true,
        validation: true,
        development: false
    });

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    })
}

bootstrap().then()
