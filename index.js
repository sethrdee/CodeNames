const express = require('express');
const path = require('path');
var http = require('http');
var socketIO = require('socket.io');

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socketIO(server);

const getFileWords = require ('./getFileWords');
let redIsP1 = true;
let redsTurn = true;

const getWords = (gameType="normal") => {
  let p1Color = redIsP1? "red" : "blue";
  let p2Color = (!redIsP1)? "red" : "blue";
  return getFileWords(gameType, p1Color, p2Color);
}

let data = getWords();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

io.on('connection', socket => {
  console.log("New client "+socket.id+" connected");
  //Give socket all the current data
  socket.emit("outgoing data", data); 
  socket.emit("outgoing turn change", redsTurn);
  
  socket.on('new round', (gameType) => {
    data = getWords(gameType);
    redsTurn = redIsP1;
    redIsP1 = !redIsP1; //Toggle starting color
    io.sockets.emit("outgoing turn change", redsTurn);
    io.sockets.emit("outgoing new data", data);
  });
  
  socket.on('update data', (newData) => {
    data = newData;
    io.sockets.emit("outgoing data", data);
  });
  
  socket.on('change turn', () => {
    redsTurn = !redsTurn;
    io.sockets.emit("outgoing turn change", redsTurn);
  });

  socket.on('disconnect', () => {
    console.log("Client "+socket.id+" disconnected");
  });
  
  socket.on('play sound', (value) => {
    io.sockets.emit("play click sound", value);
  });
})

server.listen(port, function(){
  console.log('listening on ' + port);
});
