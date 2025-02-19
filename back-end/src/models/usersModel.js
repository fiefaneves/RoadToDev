import mongoose from "mongoose"

const {Schema} = mongoose;
const userSchema = new Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    name:{type: String, required:true},
    interesse:{ type: String },
    experiencia:{ type: String },
    tecnologia:{ type: String },
    roadmap:{ type: String }
}, 
);

const user= mongoose.model("Users", userSchema);

export default user;