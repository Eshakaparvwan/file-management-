import cors from "cors";
import { Application, json, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { authorize } from "../../utility/authorize";
import { ResponseHandler } from "../../utility/response";
import { excludedPaths, routes } from "./routes.data";

export const registerRoutes = async (app: Application) => {
    try {
        app.use(cors());
        app.use(json());
        app.use(helmet());

        app.use(authorize(excludedPaths));

        for (let route of routes) {
            app.use(route.path, route.route);
        }
        app.use((req: Request, res: Response, next: NextFunction) => {
            res.status(404).send(new ResponseHandler(null, { message: 'Url doesn\'t exists' }));
        })

        app.use((error: any, req: Request, res: Response, next: NextFunction) => {
            console.log(error);
            res.status(error.statusCode ?? 500).send(new ResponseHandler(null, error));
        })
    }
    catch (e) {
        throw { message: "Unable to register Routes" }
    }
}