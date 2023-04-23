const mongoose=require("mongoose");
const {Schema} = mongoose;
const project = new Schema({
    image:{
        type: String,
        require : true
    },
    title : {
        type: String,
        require : true,
    },
    description :{
        type: String,
        require: true
    },
    domain:{
        type:String,
        require: true,
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    }
});
                                    //name of collection in mongoDB of this schema i.e events
const collProject = mongoose.model("collabprojects",project);
collProject.createIndexes();
module.exports = collProject;