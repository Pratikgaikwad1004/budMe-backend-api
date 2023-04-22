const express = require("express");
const router = express.Router();
const log = require("console");
const User = require("../models/UserSchema");
const multer = require('multer')
// const upload = multer({ dest: 'images/' })
const userPosts = require("../models/HomePosts");

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
        const { img, title, content, createdBy } = req.body;
        if (!title) {
            return res.json({error : "Please insert title"});
        }
        
        if (!content) {
            return res.json({error : "Please insert location"});
        }

        if (!img) {
            return res.json({error : "Please insert image"});
        }
        if (!createdBy) {
            return res.json({error : "Please add the post creator username"});
        }

        if (!content) {
            return res.json({error : "Please insert info about event"});
        }
        
        const userId = req.user._id; // assuming user is authenticated and their ID is available in the request object

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ error: "Invalid user ID" });
        }

        const newPost = await Post.create({
            image: img,
            title: title,
            description: description,
            domain: domain,
            author: user._id
        });
        
        if (!newPost) {
            return res.json({error : "Some error occured"});
        }
        res.json({success : true })
        
    } catch (error) {
        return res.send(error)
    }
})
module.exports = router;