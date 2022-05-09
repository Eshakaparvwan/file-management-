import mongoose from "mongoose";
import UserDB from "./user.schema";
import { IConfiguration, IFile, IFilter, IPass, IUser } from "./user.types";
import { ICredentials } from "../../../utility/credentials";
const createUser = (user: IUser) => UserDB.create(user);

const getUser = () => UserDB.find().populate('folders').exec();

// const loginUser = (user: IUser) => UserDB.findOne({ email: user.email, password: user.password });

const loginUser = (credentials: ICredentials) => UserDB.findOne(credentials);
const resetPassword = (passwords: IPass) => UserDB.updateOne({ _id: passwords._id }, { $set: { password: passwords.confirmPassword } });

const forgotPassword = (email: string) => UserDB.findOne({ email: email });


const findByToken = (resetToken: string) => UserDB.findOne({ resetToken: resetToken });

const createFolder = (_id: string, name: string) => UserDB.findByIdAndUpdate(_id, {
    $push: {
        folders: { name: name, files: [] }
    }
});

const uploadFile = (fileData: IFile, folderId: string, userId: string) => UserDB.findOneAndUpdate({
    _id: userId,
    'folders._id': folderId
}, {
    $push: {
        'folders.$.files': {
            filename: fileData.filename,
            path: fileData.path,
            size: fileData.size
        }
    }
});


const displayFileData = (_id: string, fileId: string) => UserDB.aggregate([
    {
        $match: {
            _id: new mongoose.Types.ObjectId(_id),
        }
    },
    {
        $unwind: "$folders"
    },
    {
        $unwind: "$folders.files"
    },
    {
        $match: {
            "folders.files._id": new mongoose.Types.ObjectId(fileId)
        }
    },
    {
        $project: {
            "folders": 1
        }
    }
]);

const displayFolderData = (_id: string, folderId: string) => UserDB.aggregate([
    {
        $match: {
            _id: new mongoose.Types.ObjectId(_id)
        }
    },
    {
        $unwind: "$folders"
    },
    {
        $match: {
            "folders._id": new mongoose.Types.ObjectId(folderId)
        }
    },
    {
        $project: {
            "folders": 1
        }
    }
]);

const displayUserData = (_id: string) => UserDB.findById(_id).populate('requestStorage').exec();

const deleteFolder = (_id: string, folderId: string) => UserDB.updateOne({ _id },
    {
        $pull: {
            folders: {
                _id: folderId
            }
        }
    }
);

const deleteFile = (_id: string, fileId: string, folderId: string) => UserDB.findOneAndUpdate({
    _id: _id,
    'folders._id': folderId
},
    {
        $pull: {
            'folders.$.files': { _id: fileId }
        }
    });

const updateStorage = (_id: string, storageId: string) => UserDB.updateOne({ _id: _id },
    {
        $set: {
            requestStorage: storageId
        }
    })

const updateStorageRequest = (_id: string, fileSize: number, numberOfFiles: number) => UserDB.updateOne({ _id: _id },
    {
        $set: {
            configurations: {
                maxFileSize: fileSize,
                maxNumberOfFiles: numberOfFiles,
            }
        }
    });

const getFilteredData = async (filter: IFilter) => {
    const { count } = filter;
    let filters: any[] = [];
    let filteredQuery: any[] = [];
    const match = {
        $match: {
            $and: filteredQuery
        }
    }
    return UserDB.aggregate([
        { $unwind: "$folders" },
        // { $group: { _id: '$_id', myCount: { $sum: 1 } } },
        // { $project: { _id: 0 } }
    ])
}

const downloadFile = (_id: string, fileId: string) => UserDB.aggregate([
    {
        $match: {
            _id: new mongoose.Types.ObjectId(_id)
        }
    },
    {
        $unwind: "$folders"
    },
    {
        $unwind: "$folders.files"
    },
    {
        $match: {
            "folders.files._id": new mongoose.Types.ObjectId(fileId)
        }
    },
    {
        $project: {
            "folders": 1
        }
    }
]);


export default {
    createUser,
    getUser,
    loginUser,
    resetPassword,
    forgotPassword,
    uploadFile,
    findByToken,
    // displayRequest,
    // updateRequest,
    createFolder,
    displayUserData,
    deleteFolder,
    deleteFile,
    displayFileData,
    // sendRequest,
    updateStorage,
    updateStorageRequest,
    getFilteredData,
    displayFolderData,
    downloadFile
}