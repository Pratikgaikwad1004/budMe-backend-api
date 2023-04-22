const mongoose=require("mongoose");
const {Schema} = mongoose;
const projectRegistration = new Schema({
    image:{
        type: String,
        require : true
    },
    title : {
        type: String,
        require : true
    },
    description :{
        type: String,
        require: true
    },
    domain:{
        type:String,
        require: true,
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        require:true
    }
});
                                    //name of collection in mongoDB of this schema i.e events
const projectRegister = mongoose.model("projects",projectRegistration);
projectRegister.createIndexes();
module.exports = projectRegister;