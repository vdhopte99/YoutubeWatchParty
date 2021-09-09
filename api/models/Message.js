const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    roomID: {
      type: String,
    },
    senderID: {
      type: String,
    },
    text: {
      type: String,
    },
    senderProfilePicture: {
      type: String,
      default: ""
  },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);