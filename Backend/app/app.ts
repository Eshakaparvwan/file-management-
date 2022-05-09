import express from "express";
import { connectToMongo } from "./connections/mongo.connections";
import { registerRoutes } from "./routes";

export const startServer = async () => {
    try {
        const app = express();

        await connectToMongo();
     

        registerRoutes(app);

        const { PORT } = process.env;
        app.listen(PORT, () => {
            console.log(`listening on PORT ${PORT}`);
        });
    }
    catch (e) {
        throw (e);
    }
}
