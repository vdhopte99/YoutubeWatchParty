const router = require("express").Router();
const Message = require("../models/Message");
const User = require("../models/User");

//add
router.post("/", async (req, res) => {
  const user = await User.findOne({ profilePicture: req.body.senderProfilePicture });

  const newMessage = new Message({
    senderID: req.body.senderID,
    senderProfilePicture: user.profilePicture,
    text: req.body.text,
    roomID: req.body.roomID
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get
router.get("/:roomID", async (req, res) => {
  try {
    const messages = await Message.find({
      roomID: req.params.roomID,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete room messages
router.delete("/:roomID", async (req, res) => {
  try {
    await Message.remove({roomID: req.params.roomID})
    res.status(200).json("Successfully deleted messages!");
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;