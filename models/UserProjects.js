const mongoose=require("mongoose");
const {Schema} = mongoose;
const ProjectsUser = new Schema({
    projectID: {
        type: Schema.Types.ObjectId,
        ref: "collProject",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
});
                                    //name of collection in mongoDB of this schema i.e events
const UserProject = mongoose.model("UserProject", ProjectsUser);
UserProject.createIndexes();
module.exports = UserProject;