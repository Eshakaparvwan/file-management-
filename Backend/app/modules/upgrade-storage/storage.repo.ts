import StorageDB from "./storage.schema";
import { IStorage } from "./storage.type";

const createStorage = (storage: IStorage) => StorageDB.create(storage);

const displayStorage = () => StorageDB.find({ changeRequest: true }).populate('userId').exec();

const displayStorageById = (_id: string) => StorageDB.findOne({ _id: _id, changeRequest: true });

const updateStorage = (_id: string) => StorageDB.updateOne({ _id: _id }, {
    $set: {
        changeRequest: false
    }
});


export default {
    createStorage,
    displayStorage,
    displayStorageById,
    updateStorage
}