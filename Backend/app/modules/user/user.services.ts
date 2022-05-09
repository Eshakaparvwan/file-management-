import userRepo from "./user.repo";
import { IConfiguration, IFile, IFilter, IPass, IUser } from "./user.types";
import jwt from "jsonwebtoken";
import { sendMail } from "../../../utility/sendMail";
import { randomBytes } from "crypto";
import path from "path";
import fs from "fs-extra";
import storageRepo from "../upgrade-storage/storage.repo";
import storageServices from "../upgrade-storage/storage.services";
import getTotalSize from "../../../utility/calculateSize";

const { sign } = jwt;

const createUser = async (user: IUser) => {
    try {
        const userData = await userRepo.createUser(user);
        console.log(userData);

        if (userData) {
            const _id = userData._id.toString();
            let uploadFolder = path.join("storage", _id);
            fs.ensureDir(uploadFolder);
        }
        return userData;
    }
    catch (e) {
        console.log(e);
        throw { message: "User already present" }
    }
}

const getUser = () => userRepo.getUser();

const loginUser = async (user: IUser) => {
    const userData = await userRepo.loginUser(user);
    if (userData) {
        const { SECRET_KEY } = process.env;
        if (SECRET_KEY) {
            const token = sign(userData.toObject(), SECRET_KEY, { expiresIn: '20d' });
            const { role, name } = userData;
            const data = { token, role, name };
            return data;
        }
        else {
            throw "Secret Key not found"
        }
    }
    else {
        throw "Invalid Credentials"
    }
};


const resetPassword = async (passwords: IPass) => {
    if (passwords.confirmPassword === passwords.password) {
        const user = await userRepo.findByToken(passwords.resetToken);
        if (!user || user.resetToken && (passwords.resetToken !== user.resetToken) || user.resetTokenExpiry && (Date.now() >= user.resetTokenExpiry)) {
            throw { statusCode: 400, message: 'Token invalid for resetting your password' }
        }
        user.password = passwords.confirmPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();
    } else {
        return "password not Matched";
    }
    return "password successfully changed";
};

const forgotPassword = async (email: string) => {
    try {
        const data = await userRepo.forgotPassword(email);
        if (!data) throw { statusCode: 400, message: "user not found" };
        if (
            data.resetToken &&
            data.resetTokenExpiry &&
            Date.now() <= data.resetTokenExpiry
        ) throw { statusCode: 400, message: "Email for reset password already been sent" }
        data.resetToken = randomBytes(6).toString('hex');
        data.resetTokenExpiry = Date.now() + (1000 * 60 * 60);
        const result = await data.save();
        if (result._id && result.resetToken) {
            await sendMail(email, result.resetToken);
            return "Email send";
        }
    }
    catch (e) {
        throw e;
    }
};

// upload file into folder
const addFile = async (fileData: Express.Multer.File, folderId: string, userId: string) => {
    try {
        const file: IFile = {
            filename: fileData.filename || '',
            size: fileData.size || 0,
            path: fileData.path.split('\\').join('/') || ''
        };
        const data = await userRepo.displayUserData(userId);
        // console.log(data);

        if (data) {
            const { configurations } = data;
            // console.log(file.size);
            const folders = data.folders
            let userFilenumber = 0;
            // console.log(folders[0].files.length)
            // console.log(folders)

            for (let folder in folders) {
                let id = folders[folder]._id;
                if (id?.toString() == folderId) {
                    let userFiles = folders[folder].files
                    userFilenumber = userFiles.length;
                }


            }


            // console.log(userFilenumber)
            console.log(configurations.maxFileSize);
            if (file.size > configurations.maxFileSize || userFilenumber > configurations.maxNumberOfFiles - 1) {
                throw "file size limit exceeded";
            }
            // if(configurations.maxNumberOfFiles)
            return userRepo.uploadFile(file, folderId, userId);
        }
    }
    catch (e) {
        throw (e);
    }
}


const createFolder = (_id: string, name: string) => userRepo.createFolder(_id, name);

const displayUserData = (_id: string) => userRepo.displayUserData(_id);

const deleteFolder = async (_id: string, folderId: string) => {
    try {
        const folderData = await userRepo.displayFolderData(_id, folderId);
        if (folderData) {
            let matchFiles;
            for (let folder of folderData) {
                if (folder.folders._id.toString() === folderId) {
                    matchFiles = folder.folders.files;
                }
            }
            for (let file of matchFiles) {
                const path = file.path;
                fs.unlinkSync(path);
            }
            await userRepo.deleteFolder(_id, folderId);
            return true;
        }
        else {
            throw { message: "Unable to find folder" }
        }
    }
    catch (e) {
        throw e;
    }
}

const getFolderSize = async (_id: string, folderId: string) => {
    try {
        const folderData = await userRepo.displayFolderData(_id, folderId);
        if (folderData) {
            let matchFiles;
            for (let folder of folderData) {
                if (folder.folders._id.toString() === folderId) {
                    matchFiles = folder.folders.files;
                }
            }
            let size = 0, count = 0;
            for (let file of matchFiles) {
                const path = file.path;
                count++;
                size += await getTotalSize(path);
            }
            console.log(count);
            const fileData = { count, size };
            return fileData;

        }
        else {
            throw { message: "Unable to find folder" }
        }
    }
    catch (e) {
        throw e;
    }
}

// delete perticular file
const deleteFile = async (_id: string, fileId: string, folderId: string) => {
    const fileData = await userRepo.displayFileData(_id, fileId);
    const path = fileData[0]?.folders.files.path;
    fs.unlinkSync(path);
    await userRepo.deleteFile(_id, fileId, folderId);
    return true;
}


// will update requeststorage in user Schema
const updateStorage = (_id: string, storageId: string) => userRepo.updateStorage(_id, storageId);


// update configuration in user schema 
const updateStorageRequest = async (_id: string) => {
    try {
        const storageData = await storageRepo.displayStorageById(_id);
        if (storageData) {
            const { userId } = storageData;
            const fileSize = storageData.fileSize;
            const numberOfFiles = storageData.numberOfFiles;

            await storageServices.updateStorage(_id);

            const result = await userRepo.updateStorageRequest(userId.toString(), fileSize, numberOfFiles);
            return result;
        }
    }
    catch (e) {
        throw { message: "Unable to resolve user Request" }
    }
}


const getFilteredData = async (filter: IFilter) => {
    const data = await userRepo.getFilteredData(filter);
    console.log(data);
}

const downloadFile = async (_id: string, fileId: string) => {
    const result = await userRepo.downloadFile(_id, fileId);
    const path = result[0].folders.files.path;
    return path;
}
const showConfiguration = async (id: string) => {
    const result = await userRepo.displayUserData(id);
    const configurations = result?.configurations;
    const  userFolder = result?.folders || ""
    let userFilenumber = 0;
    console.log(userFolder)
    for (let i=0;i<userFolder.length;i++) {

    }

    // console.log(result);

    return {configurations , userFilenumber};
}


export default {
    createUser,
    getUser,
    loginUser,
    resetPassword,
    forgotPassword,
    // displayRequest,
    createFolder,
    addFile,
    displayUserData,
    deleteFolder,
    deleteFile,
    // sendRequest,
    updateStorage,
    updateStorageRequest,
    getFilteredData,
    getFolderSize,
    downloadFile,
    showConfiguration
}