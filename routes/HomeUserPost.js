const express = require("express");
const router = express.Router();
const multer = require('multer')
// const upload = multer({ dest: 'images/' })
const userPosts = require("../models/HomePosts");
const User = require("../models/UserSchema");
const Like = require("../models/LikeSchema");

const storageImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images/");
    },
    filename: function (req, file, cb) {
        let fileExeArr = file.originalname.split(".");
        let extension = fileExeArr[fileExeArr.length - 1];
        cb(null, Date.now() + `.${extension}`);
    },
    fileFilter: function (req, file, cb) {
        if (file === null) {
            return cb(new Error("File cannot be empty."));
        }
    },
});
const uploadImage = multer({ storage: storageImage });


router.post('/addimage', uploadImage.single('img'), (req, res) => {
    try {
        console.log(req.file)
        return res.json({
            filepath: `http://localhost:3000/${req.file.filename}`
        })
    } catch (error) {
        console.log(error)
    }
})
router.post('/addpost', async (req, res) => {
    try {
        //destructing req.body
        const { img, username, description, user } = req.body;
        if (!description) {
            return res.json({ error: "Please insert description" });
        }

        if (!img) {
            return res.json({ error: "Please insert image" });
        }
        if (!user) {
            return res.json({ error: "Please add the post creator user id" });
        }

        const myuser = await User.findById(user);

        console.log(myuser);


        const newPost = await userPosts.create({
            image: img,
            username: myuser.name,
            description: description,
            author: req.body.user
        });

        if (!newPost) {
            return res.json({ error: "Some error occured" });
        }

        res.json({ success: true })

    } catch (error) {
        return res.send(error)
    }
});

router.post("/getallposts", async (req, res) => {
    try {
        const posts = await userPosts.find();

        res.json({posts: posts})
    } catch (error) {
        console.log(error);
    }
});

router.post("/addlike/:postId/:likedBy", async (req, res) => {
    try {
        const like = await Like.create({
            postId: req.params.postId,
            likedBy: req.params.likedBy
        })

        res.json({success: true});
    } catch (error) {
        console.log(error);
    }
});

router.post("/getlikes/:postId", async (req, res) => {
    try {
        const likes = await Like.find({ postId: req.params.postId });
        res.json({likes: likes.length})
    } catch (error) {
        console.log(error);
    }
})
module.exports = router;