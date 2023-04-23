const mongoose=require("mongoose");
const {Schema} = mongoose;
const LikeSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "userPosts",
        required: true
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});
                                    //name of collection in mongoDB of this schema i.e events
const Like = mongoose.model("likes", LikeSchema);
Like.createIndexes();
module.exports = Like;