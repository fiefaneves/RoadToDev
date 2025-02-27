import mongoose from "mongoose"

const {Schema} = mongoose;
const linksSchema = new Schema({
    tema:{type: String, required:true}, recursos:[{link:{type: String , required: true}, descricao:{type:String, requirede: true}}]
}, 
);

const links= mongoose.model("Links", linksSchema);

export default links;