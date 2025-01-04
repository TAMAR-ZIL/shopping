import {connect} from "mongoose";
;
export async function connectDB() {
    
    try {


        let connection = await connect(process.env.DB_URI)
        console.log("MongoDB connected to: " + connection.connection.host);
    }
    catch (err) {
        console.log("cannot connect MongoDb" + err.message)
        process.exit(1)
    }
}