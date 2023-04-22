const mongoose=require("mongoose");
const {Schema} = mongoose;
const RegisteredEvents = new Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: "eventRegister",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
});
                                    //name of collection in mongoDB of this schema i.e events
const MyEvents = mongoose.model("RegisteredEvents", RegisteredEvents);
MyEvents.createIndexes();
module.exports = MyEvents;