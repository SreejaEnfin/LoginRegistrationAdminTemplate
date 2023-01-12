require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("./db.js");
const urouter = require("./routes/users.routes");
const mrouter = require('./routes/meetings.routes.js');
const bodyparser = require('body-parser');
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const Message = require('./models/messages.models.js');
const verifyToken = require('./utils/verifyToken.js');
const { verify } = require('crypto');
const httpServer = createServer(app);
const io = new Server(httpServer);
const crouter = require("./routes/chats.routes")
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");


const pubClient = createClient({ url: process.env.REDIS_URL, password:process.env.PASSWORDREDIS });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  // io.listen(3000);
});
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('join', (roomName) => {
    console.log("joined to room:", roomName);
    socket.join(roomName);
    // socket.emit("join", "joined successfully");
  })

  socket.on('my message', ({ message, roomName, uid, userName}) => {
    console.log(userName +" with " +uid+ " send message: " + message + " in " + roomName);
    // send socket to all in room except sender
    io.to(roomName).emit("save message", {message:message, sender:userName});
    let chatMessage = new Message({ message: message, room: roomName, sender:uid });
    chatMessage.save();
  })

  socket.on("disconnect", (msg)=>{
    console.log(msg)
  })
});

app.use('/users', urouter);
app.use('/meetings', mrouter);
app.use('/messages', crouter);

httpServer.listen(port, () => {
  console.log(`App is listening on port: ${port}`);
})