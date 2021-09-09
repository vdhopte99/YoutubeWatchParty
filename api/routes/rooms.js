const Room = require("../models/Room");
const router = require("express").Router();
var randomstring = require("randomstring");

// create room
router.post("/", async (req, res) => {
    const newRoom = new Room({
        members: req.body.members,
        hostID: req.body.hostID,
        code: randomstring.generate({
            length: 8,
            charset: 'alphabetic',
            capitalization: 'uppercase'
        })
    });
  
    try {
      const savedRoom = await newRoom.save();
      res.status(200).json(savedRoom);
    } catch (err) {
      res.status(500).json(err);
    }
});

// get room
router.get('/:roomCode', async (req, res) => {
    try {
        const room = await Room.findOne({ code: req.params.roomCode });
    
        return res.status(200).json(room)
    } catch(err) {
        return res.status(500).json(err)
    }
})

// delete user room
router.delete("/:userID", async (req, res) => {
    try {
        const room = await Room.findOne({ hostID: req.params.userID });

        await room.deleteOne();
        res.status(200).json("Room successfully deleted!");
      } catch (err) {
        res.status(500).json(err);
      }
});

// join room 
router.put("/:roomCode/join", async (req, res) => {
    try {
        const room = await Room.findOne({ code: req.params.roomCode });

        if (!room.members.includes(req.body.userID)) {
            await room.updateOne({ $push: { members: req.body.userID } });
            console.log(room)
            res.status(200).json("Successfully joined room");
        } else {
            res.status(500).json("Already joined room");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// leave room 
router.put("/:roomCode/leave", async (req, res) => {
    try {
        const room = await Room.findOne({ code: req.params.roomCode });

        if (room.members.includes(req.body.userID)) {
            await room.updateOne({ $pull: { members: req.body.userID } });
            res.status(200).json("Successfully left room");
        } else {
            res.status(500).json("Already left room");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// get user room 
router.get('/:userID/userRoom', async (req, res) => {
    try {
        const room = await Room.findOne({ hostID: req.params.userID });
    
        return res.status(200).json(room)
    } catch(err) {
        return res.status(500).json(err)
    }
})

module.exports = router