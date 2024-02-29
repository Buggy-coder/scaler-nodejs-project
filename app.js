const express = require('express');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 8080;
const globalChat = http.createServer(app);


globalChat.listen(PORT, ()=>{
    console.log( `Listening on port ${PORT}` );
});

app.use(express.static(__dirname+"/public"))

app.get("/", (req,res)=>{
    res.sendFile(__dirname +  "/index.html");
});

// socket.io server

const io = require('socket.io')(globalChat);

io.on('connection', (socket)=>{
    let username;
    console.log(`new client connected :)`);
    socket.on('toggle', (msg)=>{
        username = msg.user;
        socket.broadcast.emit( 'toggle' , msg);
    })

    socket.on('message', (msg)=>{
        socket.broadcast.emit('message', msg);
    })

})