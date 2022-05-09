import { Router } from "express";

export interface IAuth {
    path: string,
    method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE"
}

export class Route {
    constructor(
        public path: any = path,
        public route: Router = route
    ) { }
}