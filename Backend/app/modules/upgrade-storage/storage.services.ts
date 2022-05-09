import storageRepo from "./storage.repo";
import { IStorage } from "./storage.type";


const createStorage = (_id: string, storage: IStorage) => {
    storage.userId = _id;
    storage.changeRequest = true;
    return storageRepo.createStorage(storage);
}

const displayStorage = () => storageRepo.displayStorage();

const displayStorageById = (_id: string) => storageRepo.displayStorageById(_id);

const updateStorage = (_id: string) => storageRepo.updateStorage(_id);

export default {
    createStorage,
    displayStorage,
    updateStorage,
    displayStorageById
}