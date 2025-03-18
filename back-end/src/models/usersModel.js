import mongoose from "mongoose"
    
const {Schema} = mongoose;
const userSchema = new Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    name:{type: String, required:true},
    //interesse:{ type: String },
    //experiencia:{ type: String },
    //tecnologia:{ type: String },
    username:{type: String, required:true, unique:true},
    email:{type: String, required:true, unique:true},
    number:{type: String, required:true, unique:true},
    password:{type: String, required:true},
    date:{type: Date, default: Date.now},
    roadmaps: [ { type: mongoose.Schema.Types.ObjectId, ref: "RoadMaps"  } ],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, 
);

const user= mongoose.model("Users", userSchema);

export default user;