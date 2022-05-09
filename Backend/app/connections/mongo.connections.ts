import { connect } from "mongoose";

export const connectToMongo = async () => {
    try {
        const { MONGO_CONNECTION } = process.env;
        if (MONGO_CONNECTION) {
            await connect(MONGO_CONNECTION);
            console.log("Connected to Database successfully ");
        }
    }
    catch (e) {
        throw { message: "Unable to connect to mongoDB Database" }
    }
}