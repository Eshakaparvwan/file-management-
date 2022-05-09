import { NextFunction, Router, Response, Request } from "express";
import { ROLES } from "../../../utility/DB_Constant";
import { permit } from "../../../utility/permit";
import { ResponseHandler } from "../../../utility/response";
import roleServices from "./role.services";
import { CreateRoleValidator } from "./role.validations";

const router = Router();

router.post("/create",
    permit([ROLES.ADMIN]),
    CreateRoleValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await roleServices.createRole(req.body);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

router.get("/display",
    permit([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await roleServices.getRole();
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e)
        }
    });

router.put("/update",
    permit([ROLES.ADMIN]),
    CreateRoleValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await roleServices.updateRole(req.body);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e)
        }
    });

export default router;