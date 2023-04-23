const mongoose=require("mongoose");
const User = require("./UserSchema");
const {Schema} = mongoose;
const postSchema = new Schema({
    image:{
        type: String,
        require : true
    },
    username : {
        type: String,
        require : true
    },

    description :{
        type: String,
        require: true,
    },

    author: {
        type: Schema.Types.ObjectId,
        require: true
    },

    date: {
        type: Date,
        default: Date.now
    }
});


                                    //name of collection in mongoDB of this schema i.e events
const userPosts = mongoose.model("UserPosts",postSchema);
userPosts.createIndexes();
module.exports = userPosts;