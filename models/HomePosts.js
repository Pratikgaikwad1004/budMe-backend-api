const mongoose=require("mongoose");
const User = require("./UserSchema");
const {Schema} = mongoose;
const postSchema = new Schema({
    image:{
        type: String,
        require : true
    },
    title : {
        type: String,
        require : true
    },

    content :{
        type: String,
        require: true,
        maxlength: 300
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        require: true
    },

    date: {
        type: Date,
        default: Date.now
    }
});

// Middleware to automatically add the author of the post
postSchema.pre('save', async function(next) {
    try {
      if (!this.author) {
        // If author field is not set, get the default user (e.g., admin)
        const defaultUser = await User.findOne({ email: 'admin@example.com' });
        if (defaultUser) {
          this.author = defaultUser._id;
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  });


                                    //name of collection in mongoDB of this schema i.e events
const userPosts = mongoose.model("UserPosts",postSchema);
userPosts.createIndexes();
module.exports = userPosts;