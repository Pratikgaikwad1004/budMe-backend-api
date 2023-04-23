const express = require("express");
const router = express.Router();
const log = require("console");
const multer = require('multer')
// const upload = multer({ dest: 'images/' })
const eventRegister = require("../models/EventRegistration");
const MyEvents = require("../models/RegisteredEvents");


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