import { NextFunction, Request, Response } from "express"
import { ResponseHandler } from "./response";

export const permit = (permittedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { role } = res.locals['userData'];
        if (!permittedRoles.includes(role)) {
            return res.send(new ResponseHandler({ message: "permission not granted to access this URL " }));
        }
        next();
    }
}