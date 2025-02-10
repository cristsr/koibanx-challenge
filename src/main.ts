import {createExpressServer, useContainer} from "routing-controllers";
import {Express} from "express";
import {Container} from "typedi";


async function bootstrap() {

    useContainer(Container);

    const app: Express = createExpressServer({
        controllers: [__dirname + "/**/*.controller.ts"],
        routePrefix: 'api',
        classTransformer: true,
        validation: true,
    });

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    })


}

bootstrap().then()
