import { Schema, model, Document } from "mongoose";
import { IRole } from "./role.types";

class RoleSchema extends Schema {
    constructor() {
        super({
            name: {
                type: String,
                required: true
            }
        })
    }
}

type RoleDocument = Document & IRole;
const RoleDB = model<RoleDocument>('Role', new RoleSchema());
export default RoleDB;
