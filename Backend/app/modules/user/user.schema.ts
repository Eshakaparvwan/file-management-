import { Schema, model, Document } from "mongoose";
import { ROLES } from "../../../utility/DB_Constant";
import { IUser } from "./user.types";

class UserSchema extends Schema {
    constructor() {
        super({
            name: {
                type: String,
                required: true,
            },
            password: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true,
                unique: true
            },
            role: {
                type: Schema.Types.ObjectId,
                ref: 'Role',
                required: false,
                default: ROLES.USER
            },
            folders: [{
                name: { type: String },
                files: [{
                    filename: { type: String },
                    path: { type: String },
                    size: { type: Number }
                }]
            }],
            configurations: {
                maxFileSize: {
                    type: Number,
                    required: false,
                    default: 2000000
                },
                maxNumberOfFiles: {
                    type: Number,
                    required: false,
                    default: 5
                }
            },
            requestStorage: {
                type: Schema.Types.ObjectId,
                ref: 'Storage'
            },
            resetToken: {
                type: String,
                required: false
            },
            resetTokenExpiry: {
                type: Number,
                required: false
            }
        }, { timestamps: true })
    }
};

type UserDocument = Document & IUser;
const UserDB = model<UserDocument>('User', new UserSchema());
export default UserDB;