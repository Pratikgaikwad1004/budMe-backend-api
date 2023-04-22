const mongoose=require("mongoose");
const {Schema} = mongoose;
const eventRegistration = new Schema({
    image:{
        type: String,
        require : true
    },
    title : {
        type: String,
        require : true
    },
    location : {
        type: String,
        require: true,
    },
    description :{
        type: String,
        require: true
    },
    institute:{
        type:String,
        require: true,
    },
    time:{
        type: String,
        require: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
});
                                    //name of collection in mongoDB of this schema i.e events
const eventRegister = mongoose.model("events",eventRegistration);
eventRegister.createIndexes();
module.exports = eventRegister;