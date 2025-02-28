import mongoose from "mongoose"

const { Schema } = mongoose;

const topicSchema = new Schema({
    topic: { type: String },
    completed: { type: Boolean }
}, 
);

const roadMapSchema = new Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    topics: [ topicSchema ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }
}, 
);

const roadMap= mongoose.model("RoadMaps", roadMapSchema);

export default roadMap;