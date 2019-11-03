const express = require('express');
var http = require('http');
var socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const getFileWords = require ('../getFileWords');
let data = getFileWords();

let redsTurn = true;

io.on('connection', socket => {
  console.log("New client "+socket.id+" connected");
  //Give socket all the current data
  socket.emit("outgoing data", data); 
  socket.emit("outgoing turn change", redsTurn)
  
  socket.on('change data', () => {
    data = getFileWords();
    io.sockets.emit("outgoing data", data);
  })
  
  socket.on('update data', (data) => {
    io.sockets.emit("outgoing data", data);
  })
  
  socket.on('change turn', () => {
    redsTurn = !redsTurn;
    io.sockets.emit("outgoing turn change", redsTurn);
  })

  socket.on('disconnect', () => {
    console.log("Client "+socket.id+" disconnected");
  })
})

server.listen(4000, function(){
  console.log('listening on *:4000');
});