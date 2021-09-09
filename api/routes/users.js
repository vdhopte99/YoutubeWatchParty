const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// update user
router.put("/:userID", async (req, res) => {
    if (req.body.userID === req.params.userID || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Successfully updated account!");
        } catch (err) {
            return res.status(500).json(err);
        }
    } 
    else {
        return res.status(403).json("Can not update this account!");
    }
});

// delete user
router.delete("/:userID", async (req, res) => {
    if (req.body.userID === req.params.userID || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.userID);
            res.status(200).json("Successfully deleted account!");
        } catch (err) {
            return res.status(500).json(err);
        }
    } 
    else {
        return res.status(403).json("Can not delete this account!");
    }
});

// get user
router.get('/', async (req, res) => {
    const userID = req.query.userID
    const username = req.query.username

    try {
        const user = userID 
        ? await User.findById(userID) 
        : await User.findOne({ username:username })

        const { password, updatedAt, createdAt, isAdmin, __v, ...other } = user._doc
        return res.status(200).json(other)
    } catch(err) {
        return res.status(500).json(err)
    }
})

module.exports = router