const express = require("express");
const router = express.Router();
const log = require("console");
const multer = require('multer')
// const upload = multer({ dest: 'images/' })
const collProject = require("../models/Project");

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
router.post('/addevent', async (req, res) => {
    try {
        //destructing req.body
        const { img, title, description, domain, author } = req.body;
        if (!title) {
            return res.json({error : "Please insert Title"});
        }
        if (!description) {
            return res.json({error : "Please specify information about the Project"});
        }
        if (!domain) {
            return res.json({error : "Please insert Domain"});
        }
        if (!author) {
            return res.json({error : "Please insert Author details"});
        }
        // if (!date) {
        //     return res.json({error : "Please Specify Date"});
        // }
        // if (!time) {
        //     return res.json({error : "Please Specify Date & Time"});
        // }
        // if (!description) {
        //     return res.json({error : "Please insert info about event"});
        // }

        const newProject = await collProject.create({
            image: img,
            title: title,
            description: description,
            domain: domain,
            author: author
        });

        if (!newProject) {
            return res.json({error : "Some error occured"});
        }

        res.json({success : true })
        // res.send(newEvent);
    } catch (error) {
        return res.send(error)
    }
})
module.exports = router;