import fs from "fs";

const getTotalSize = (path: string) => {
    const { size } = fs.statSync(path);
    return size;
}

export default getTotalSize;