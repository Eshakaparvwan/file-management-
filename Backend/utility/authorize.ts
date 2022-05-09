import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IAuth } from "../app/routes/routes.types";

const { verify } = jwt;
export const authorize = (excludedPaths: IAuth[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (excludedPaths.find(ep => ep.method === req.method && ep.path === req.url)) return next();

            const token = req.headers.authorization;
            const { SECRET_KEY } = process.env;
            if (token && SECRET_KEY) {
                const payload = verify(token, SECRET_KEY);
                res.locals['userData'] = payload;
                next();
            }
            else {
                throw { message: "Un-Authorize Token " }
            }
        }
        catch (e) {
            next(e);
        }
    }
}


const array = [1, 2, 3, 4, 5, '6', false]
// [2,4] - prints even numbers
const numbers = "1234567890";
const result: any[] = [];
const getEvenNumbers = (array: any) => {
    for (let i of array) {
        if (numbers.includes(i) && i % 2 == 0) {
            result.push(i);
        }
    }
    return result;
}

console.log(getEvenNumbers(array));