import RoleDB from "./role.schema";
import { IRole } from "./role.types";

const createRole = (role: IRole) => RoleDB.create(role);

const getRole = () => RoleDB.find();

const updateRole = (role: IRole) => RoleDB.updateOne({ _id: role._id });

export default {
    createRole,
    getRole,
    updateRole
}
