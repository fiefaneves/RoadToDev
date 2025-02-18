import mongoose from "mongoose"

const {Schema} = mongoose;//chama
const userSchema=new Schema({
    id: {type: ObjectId},
    name:{type: String,
        required:true
    },
    interesse:{type: String,
        required: true},
    experiencia:{type:String,
        required: true
    },
    tecnologia:{type: String,
        required: true
    },
    roadmap:{ type: String,
        required: true
    }
}, 
);

const user= mongoose.model("Users", userSchema);

export default user;