import {connect} from "mongoose";
;
export async function connectDB() {
    
    try {


        let connection = await connect(process.env.DB_URI||"mongodb://127.0.0.1:27017/lego")
        console.log("MongoDB connected to: " + connection.connection.host);
    }
    catch (err) {
        console.log("cannot connect MongoDb" + err.message)
        process.exit(1)
    }
}