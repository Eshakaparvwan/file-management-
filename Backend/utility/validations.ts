import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";

export const validate = (
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({ message: "Validation Error", data: errors }).status(400);
        }
        next();
    }
)