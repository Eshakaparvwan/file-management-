import { body } from "express-validator";
import { validate } from "../../../utility/validations";

export const createStorageValidator = [
    body('fileSize').isNumeric().isFloat({ min: 1 }).withMessage("File size required"),
    body('numberOfFiles').isNumeric().isFloat({ min: 1 }).withMessage("number of files is required"),
    validate
]