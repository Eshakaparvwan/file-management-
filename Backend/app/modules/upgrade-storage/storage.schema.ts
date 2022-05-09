import { Schema, model, Document } from "mongoose";
import { IStorage } from "./storage.type";

class StorageSchema extends Schema {
    constructor() {
        super({
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            fileSize: {
                type: Number,
                required: true
            },
            numberOfFiles: {
                type: Number,
                required: true
            },
            changeRequest: {
                type: Boolean,
                required: false,
                default: false
            }
        }, { timestamps: true })
    }
};

type StorageDocument = Document & IStorage;
const StorageDB = model<StorageDocument>('Storage', new StorageSchema());
export default StorageDB;

