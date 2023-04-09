const express = require("express");
const router = express.Router();
const log = require("console");
const multer = require('multer')
// const upload = multer({ dest: 'images/' })
const eventRegister = require("../models/EventRegistration");

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
        const { img, title, location, description, institute, time } = req.body;
        if (!img) {
            return res.status(402).send("Imag daal");
        }
        if (!title) {
            return res.status(402).send("Title daal");
        }
        if (!location) {
            return res.status(402).send("Location daal");
        }
        if (!description) {
            return res.status(402).send("Description daal");
        }
        if (!institute) {
            return res.status(402).send("Institute daal");
        }
        if (!time) {
            return res.status(402).send("Time daal");
        }

        const newEvent = await eventRegister.create({
            image: img,
            title: title,
            location: location,
            description: description,
            institute: institute,
            time: time
        });

        if (!newEvent) {
            return res.send("BHosdike Thik se Apni gaand mara");
        }

        res.send(newEvent);
    } catch (error) {
        return res.send(error)
    }
})
module.exports = router;