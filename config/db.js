import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URL);
    mongoose.connection.once("open", () => {
        console.log("Connection SuccessFull");
    }).on("error", (err) => {
        console.log(err);
    })
}

export default connectDB;