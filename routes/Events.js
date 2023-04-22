const express = require("express");
const router = express.Router();
const log = require("console");
const multer = require('multer')
// const upload = multer({ dest: 'images/' })
const eventRegister = require("../models/EventRegistration");
const MyEvents = require("../models/RegisteredEvents");

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
        const { img, title, location, description, institute, time, userID } = req.body;
        if (!title) {
            return res.json({ error: "Please Insert Title" });
        }
        if (!institute) {
            return res.json({ error: "Please specify Institute" });
        }
        if (!location) {
            return res.json({ error: "Please Insert Location" });
        }
        if (!img) {
            return res.json({ error: "Please insert image" });
        }
        // if (!date) {
        //     return res.json({error : "Please Specify Date"});
        // }
        if (!time) {
            return res.json({ error: "Please Specify Date & Time" });
        }
        if (!description) {
            return res.json({ error: "Please insert info about event" });
        }
        if (!userID) {
            return res.json({ error: "Please insert user id of event owner" });
        }

        const newEvent = await eventRegister.create({
            image: img,
            title: title,
            location: location,
            description: description,
            institute: institute,
            time: time,
            ownerId: userID
        });

        if (!newEvent) {
            return res.json({ error: "Some error occured" });
        }

        res.json({ success: true })
        // res.send(newEvent);
    } catch (error) {
        return res.send(error)
    }
});

router.post("/getallevents", async (req, res) => {
    try {
        const events = await eventRegister.find();

        res.json({ events: events });
    } catch (error) {
        log(error)
    }
});

router.post("/getinevent", async (req, res) => {
    try {
        const events = await MyEvents.findOne({
            eventId: req.body.eventId,
            userId: req.body.userId,
        })

        if (events) {
            return res.json({ error: "You have already registered" });
        }
        const newev = await MyEvents.create({
            eventId: req.body.eventId,
            userId: req.body.userId,
        })

        res.json({ success: true })
    } catch (error) {
        log(error)
    }
});

router.post("/getregisteredevents/:id", async (req, res) => {
    try {
        const events = await MyEvents.find({ userId: req.params.id });
        const myevents = await eventRegister.find({
            _id: events.map((ele) => {
                return ele.eventId
            })
        })
        res.json({ events: myevents });
    } catch (error) {
        console.log(error);
    }
})

router.delete("/removeevent/:id", async (req, res) => {
    try {
        console.log(req.params.id);
        const rmevent = await MyEvents.findOneAndDelete({userId: req.body.userId, eventId: req.params.id});
        res.json({success: true});
    } catch (error) {
        log(error)
    }
})
module.exports = router;