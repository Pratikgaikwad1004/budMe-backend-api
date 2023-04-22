const express = require("express");
const router = express.Router();
const { body, validationResult, check } = require("express-validator");
const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "this is most importent secret";

router.post(
    "/signup",
    [
        body("email", "Enter a valid email").isEmail(),
        check("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 chars long")
            .matches(/\d/)
            .withMessage("Password must contain a number"),
        // body("name", "Name should be more than 3 characters").isLength({ min: 3 }),
        body("username", "Username is required.").isLength({ min: 3 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = await bcrypt.genSalt(10);
        let encryptedPassword = await bcrypt.hash(req.body.password, salt);

        try {
            const email = await User.findOne({ email: req.body.email.toLowerCase() });
            if (email) {
                return res.status(400).json({ error: "Email already exist." });
            }
            let useremail = req.body.email.toLowerCase();

            const user = await User.create({
                name: req.body.username,
                email: useremail,
                password: encryptedPassword,
            });

            const data = {
                user: {
                    id: user.id,
                },
            };

            const authtoken = jwt.sign(data, JWT_SECRET);
            return res
                .status(200)
                .json({ message: "Account created ", authtoken: authtoken });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
);

router.post(
    "/login",
    [
        body("email", "Enter valid email.").isEmail(),
        body("password", "Password cannot be blank.").exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let email = req.body.email;
            let pass = req.body.password;

            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                return res
                    .status(400)
                    .json({ error: "Please try to login with correct credentials." });
            }
            // Comparing password using bcryptjs.
            const passwordCompare = await bcrypt.compare(pass, user.password);

            if (!passwordCompare) {
                return res
                    .status(400)
                    .json({ error: "Please try to login with correct credentials." });
            }

            const data = {
                user: {
                    id: user.id,
                },
            };

            const authtoken = jwt.sign(data, JWT_SECRET);

            let usersend = await User.findById(data.user.id).select("-password");

            return res.status(200).json({ authtoken: authtoken, user: usersend });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
);


router.post("/getusers/:name", async (req, res) => {
    try {
        const users = await User.find({name: { "$regex": req.params.name, "$options": "i" }}).select("-password");
        res.json({users: users})
    } catch (error) {
        console.log(error);
    }
});

router.post("/getuser/:id", async (req, res) => {
    try {
        const users = await User.findById(req.params.id).select("-password");
        res.json({user: users})
    } catch (error) {
        console.log(error);
    }
});
module.exports = router;