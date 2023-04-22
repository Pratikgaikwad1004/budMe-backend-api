const express = require("express");
const router = express.Router();
const Message = require("../models/MessageSchema");
const log = require("console")

router.post("/newmsg", async (req, res) => {
    try {
        const from = req.body.from;
        const to = req.body.to;
        const msg = req.body.msg;

        if (!from) {
            return res.status(400).send("Invalid from");
        }
        if (!to) {
            return res.status(400).send("Invalid to");
        }
        if (!msg) {
            return res.status(400).send("Invalid msg");
        }
        const createMsg = await Message.create({
            from: from,
            to: to,
            msg: msg,
            type: req.body.type
        })

        res.status(200).send(true);

    } catch (error) {
        console.log(error);
    }
});

router.post('/getchats', async (req, res) => {
    try {
        const from = req.body.userID;
        const to = req.body.toID
        const chats = await Message.find({from: from, to: to});
        const chats2 = await Message.find({to: from});
        res.json({chats: chats})
    } catch (error) {
        log(error);
    }
})

module.exports = router;