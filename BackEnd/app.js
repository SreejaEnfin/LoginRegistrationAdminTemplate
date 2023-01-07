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
const httpServer = createServer(app);
const io = new Server(httpServer);

// var http = require('http').createServer(app);
// const io = require('socket.io')(http, {
//   cors: {
//     origins: ['http://localhost:4200']
//   }
// });

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

  io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('new-message', (message)=>{
      console.log("message:", message);
      // socket.to(roomName).emit('new-message', message);;
      io.emit("new-message", message)
    })

    socket.on('join', (roomName)=>{
      console.log("joined to room:", roomName);
      socket.join(roomName);
      // socket.to(roomName).emit('new-message', message);;
    })

    socket.on('my message', ({message, roomName})=>{
      console.log("message: " + message + " in " + roomName);
    // send socket to all in room except sender
    socket.to(roomName).emit("my message", message);
    })
     });


app.use('/users', urouter);
app.use('/meetings', mrouter);

httpServer.listen(port, ()=>{
    console.log(`App is listening on port: ${port}`);
})