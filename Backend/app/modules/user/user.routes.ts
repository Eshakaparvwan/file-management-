import { NextFunction, Router, Request, Response } from "express";
import { ROLES } from "../../../utility/DB_Constant";
import { multerMiddlerWare } from "../../../utility/fileStorageEngine";
import { permit } from "../../../utility/permit";
import { ResponseHandler } from "../../../utility/response";
import storageServices from "../upgrade-storage/storage.services";
import userServices from "./user.services";
import { createFolderValidator, CreateUserValidator, LoginUserValidator, ResetPasswordValidator } from "./user.validations";

const router = Router();

// register user
router.post("/register",
    CreateUserValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await userServices.createUser(req.body);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

// login user
router.post("/login",
    LoginUserValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await userServices.loginUser(req.body);
            res.send(new ResponseHandler(result));
        } catch (e) {
            next(e);
        }
    });

//file -upload
router.post("/file-upload",
    permit([ROLES.USER]),
    multerMiddlerWare,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.file)
            if (!req.file) return res.send("File not Found");
            await userServices.addFile(req.file as Express.Multer.File, req.body.folderId, res.locals['userData']._id);
            res.send(new ResponseHandler("File Uploaded"));
        }
        catch (e) {
            next(e);
        }
    });

// create folder
router.post("/create-folder",
    permit([ROLES.USER]),
    createFolderValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name } = req.body
            const _id = res.locals['userData']._id.toString();
            const result = await userServices.createFolder(_id, name);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

// forgot password
router.post("/forget-password",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            const result = await userServices.forgotPassword(email);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

//reset password
router.post("/reset-password",
    ResetPasswordValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await userServices.resetPassword(req.body);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

// display all users
router.get("/display-all-users",
    permit([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await userServices.getUser();
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

// display perticular user data
router.get("/display",
    permit([ROLES.USER]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _id = res.locals['userData']._id.toString();
            const result = await userServices.displayUserData(_id);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    })

// send request for change configurations
router.post("/send-request",
    permit([ROLES.USER]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _id = res.locals['userData']._id.toString();
            const storage = await storageServices.createStorage(_id, req.body);
            const result = await userServices.updateStorage(_id, storage._id);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    }
);

// get all request (admin)
router.get("/request",
    permit([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await storageServices.displayStorage();
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

// update size - approve request
router.put("/update-request",
    permit([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { _id } = req.body;
            const result = await userServices.updateStorageRequest(_id);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

//delete folder
router.put("/folder",
    permit([ROLES.USER]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _id = res.locals['userData']._id.toString();
            const result = await userServices.deleteFolder(_id, req.body.folderId);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

//delete file
router.put("/file",
    permit([ROLES.USER]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _id = res.locals['userData']._id.toString();
            const result = await userServices.deleteFile(_id, req.body.fileId, req.body.folderId)
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

// filter
router.get("/filter",
    permit([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filter = req.query;
            const result = await userServices.getFilteredData(filter);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

router.get("/total-size",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _id = res.locals['userData']._id.toString();
            const result = await userServices.getFolderSize(_id, req.body.folderId);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });
router.get("/download/:fileId",
    permit([ROLES.USER]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _id = res.locals['userData']._id.toString();
            const path = await userServices.downloadFile(_id, req.params.fileId);
            res.download(path)
        }
        catch (e) {
            next(e);
        }
    });
router.delete("/file",
    permit([ROLES.USER]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _id = res.locals['userData']._id.toString();
            const result = await userServices.deleteFile(_id, req.body.fileId, req.body.folderId)
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

router.post("/configuration",
    permit([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.body;
            const result = await userServices.showConfiguration(id)
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

export default router;
