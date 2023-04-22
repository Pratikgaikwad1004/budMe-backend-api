const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    msg: {
        type: String,
        require: true,
    },
    time: {
        type: Date,
        default: Date.now,
    }
});

const Msg = mongoose.model("message", MessageSchema);
Msg.createIndexes();
module.exports = Msg;