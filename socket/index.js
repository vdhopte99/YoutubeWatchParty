const io = require('socket.io')(8900, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on('connection', (socket) => {
    // initial connect
    console.log("User connected")

    socket.on("joinRoom", (roomName) => {
        socket.join(roomName)
        console.log(`Joined room ${roomName}`)
    })

    // send and receive messages
    socket.on("sendMessage", ({senderID, roomName, text, senderProfilePicture}) => {
        io.to(roomName).emit("newMessage", {
            senderID, 
            text,
            senderProfilePicture
        })
    })

    // send video
    socket.on("sendVideo", ({videoID, roomName}) => {
        console.log("VIDEO ID")
        console.log(videoID)
        io.to(roomName).emit("newVideo", {
            videoID
        })
    })

    // send query
    socket.on("sendQuery", ({query, roomName}) => {
        io.to(roomName).emit("newQuery", {
            query
        })
    })

    // disconnecting
    socket.on("disconnect", () => {
        console.log("User disconnected")
    })
}) 