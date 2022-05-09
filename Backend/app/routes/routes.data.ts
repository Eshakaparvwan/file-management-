import { IAuth, Route } from "./routes.types";
import userRouter from "../modules/user/user.routes";

export const routes: Route[] = [
    new Route("/user", userRouter)
]

export const excludedPaths: IAuth[] = [
    { method: "POST", path: "/user/login" },
    { method: "POST", path: "/user/register" },
    { method: "POST", path: "/user/forget-password" },
    { method: "POST", path: "/user/reset-password" }
]