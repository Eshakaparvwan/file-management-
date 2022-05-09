
export interface IUser {
    _id: string,
    configurations: string,
    name: string
}

export interface IStorage {
    _id?: string,
    userId: string,
    fileSize: number,
    numberOfFiles: number,
    changeRequest: boolean
}

