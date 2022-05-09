import roleRepo from "./role.repo";
import { IRole } from "./role.types";


const createRole = (role: IRole) => roleRepo.createRole(role);

const getRole = () => roleRepo.getRole();

const updateRole = (role: IRole) => roleRepo.updateRole(role);

export default {
    createRole,
    getRole,
    updateRole
}