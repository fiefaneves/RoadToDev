import mongoose from "mongoose"

const { Schema } = mongoose;

const topicSchema = new Schema({
    topic: { type: String },
    completed: { type: Boolean }
}, 
);

const roadMapSchema = new Schema({
    topics: [ topicSchema ],
    progress: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }
}, 
);

const roadMap= mongoose.model("RoadMaps", roadMapSchema);

export default roadMap;