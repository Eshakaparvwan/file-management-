import { body } from "express-validator";
import { validate } from "../../../utility/validations";


export const CreateRoleValidator = [
    body('name').matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic.'),
    validate
]