import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { join } from "path";

const fileStorageEngine = (_id: string) => multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, join('storage', _id));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

export const multerMiddlerWare = (
    req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = res.locals['userData']._id.toString();
        const fileStorage = fileStorageEngine(_id);
        
        const upload = multer({ storage: fileStorage, limits: {fileSize: res.locals.userData.configurations.maxFileSize} });
        upload.single('file')(req, res, () => { next() });
    }
    catch (e) {
        next(e);
    }
}





