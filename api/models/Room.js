const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema(
    {
        hostID: {
            type: String,
            required: true,
        },
        code: {
            unique: true,
            maxlength: 8,
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Room", RoomSchema)