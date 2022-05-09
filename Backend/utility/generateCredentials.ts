export const createUserID = (name: string) => {
    const random = Math.floor(Math.random() * 100);
    const userID = `${name}_${random}`;
    return userID;
}
