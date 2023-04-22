const express = require('express')
const router = express.Router();
const log = require("console");
const multer = require('multer')
const projectRegister = require('../models/ProjectRegistration');

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

router.post('/addproject', async (req, res) => {
    try {

        const { img, title, description, domain } = req.body;
        if (!title) {
            return res.json({error : "Please Insert Title"});
        }
        if (!img) {
            return res.json({error : "Please insert image"});
        }
        if (!domain) {
            return res.json({error : "Please Specify Project Domain"});
        }
        if (!description) {
            return res.json({error : "Please insert info about project"});
        }

        const newProject = await projectRegister.create({
            image: img,
            title: title,
            description: description,
            domain: domain,
        });

        if (!newProject) {
            return res.json({error : "Some error occured"});
        }

        res.json({success : true })
        
    } catch (error) {
        return res.send(error)
    }
})
module.exports = router;