const express = require("express");
const router = express.Router();
const log = require("console");
const multer = require('multer')
// const upload = multer({ dest: 'images/' })
const collProject = require("../models/Project");
const UserProject = require("../models/UserProjects");
const User = require("../models/UserSchema");

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


router.post('/addiproject', uploadImage.single('img'), (req, res) => {
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
        //destructing req.body
        const { img, title, description, domain, author } = req.body;
        if (!title) {
            return res.json({ error: "Please insert Title" });
        }
        if (!description) {
            return res.json({ error: "Please specify information about the Project" });
        }
        if (!domain) {
            return res.json({ error: "Please insert Domain" });
        }
        if (!author) {
            return res.json({ error: "Please insert Author details" });
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
            return res.json({ error: "Some error occured" });
        }

        res.json({ success: true })
        // res.send(newEvent);
    } catch (error) {
        return res.send(error)
    }
});

router.post("/getallprojects", async (req, res) => {
    try {
        const projects = await collProject.find();
        res.json({projects: projects});
    } catch (error) {
        log(error)
    }
});

router.post("/addinproject/:projectID", async (req, res) => {
    try {
        const user = req.body.userID;

        const prevP = await UserProject.findOne({ userId: user, projectID: req.params.projectID });
        if (prevP) {
            return res.json({ error: "Project already added" });
        }

        const userP = await UserProject.create({
            userId: user,
            projectID: req.params.projectID
        })

        res.json({success:true});
    } catch (error) {
        console.log(error)
    }
});

router.post("/getrequestedprj/:id",async (req, res) => {
    try {
        const myproj = await UserProject.find({userId: req.params.id });

        const newp = await collProject.find({ _id: myproj.map((ele) => {
            return ele.projectID;
        })})

        res.json({myproj: newp});
    } catch (error) {
        console.log(error);
    }
});

router.delete("/leaveproject/:userid/:projectid",async (req, res) => {
    try {
        const myproj = await UserProject.findOneAndDelete({userId: req.params.userid, projectID: req.params.projectid });

        res.json({success: true});
    } catch (error) {
        console.log(error);
    }
});


router.post("/getmyproject/:authorid", async (req, res) => {
    try {
        const projects = await collProject.find({author: req.params.authorid});

        const userproject = await UserProject.find({projectID: projects.map((ele) => {
            return ele._id;
        })});

        const users = await User.find({_id: userproject.map((ele) => {
            return ele.userId;
        })}).select("-password")
        res.send(users);
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;