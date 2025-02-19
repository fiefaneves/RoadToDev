import mongoose from "mongoose"

async function  conectar_db(){
    mongoose.connect(process.env.MONGO_DB_KEY);
    return mongoose.connection
}
 export default conectar_db