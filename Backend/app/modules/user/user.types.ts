export interface IConfiguration {
    _id?: string,
    maxFileSize: number,
    maxNumberOfFiles: number,
    changeRequest: boolean
}

export interface IFile {
    _id?:string,
    filename: string,
    path: string,
    size: number
}

export interface IFolder {
    _id?:string,
    name: string,
    files: IFile[]
}

export interface IPass {
    _id?: string,
    resetToken: string,
    password: string,
    confirmPassword: string
}

export interface IUser {
    _id?: string,
    name: string,
    password: string,
    email: string,
    role: string,
    folders: IFolder[],
    configurations: IConfiguration,
    resetToken?: string | null,
    resetTokenExpiry?: number | null
}


export interface IFilter {
    count?: number,
    page?: number,
    itemsPerPage?: number
}