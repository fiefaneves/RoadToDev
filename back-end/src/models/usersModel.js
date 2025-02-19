import mongoose from "mongoose"

const {Schema} = mongoose;
const userSchema = new Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    name:{type: mongoose.Schema.Types.String, required:true},
    interesse:{ type: mongoose.Schema.Types.String },
    experiencia:{ type: mongoose.Schema.Types.String },
    tecnologia:{ type: mongoose.Schema.Types.String },
    roadmap:{ type: mongoose.Schema.Types.String }
}, 
);

const user= mongoose.model("Users", userSchema);

export default user;