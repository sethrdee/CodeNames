const express = require('express');
const path = require('path');
var http = require('http');
var socketIO = require('socket.io');

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socketIO(server);

const getFileWords = require ('./getFileWords');
let data = getFileWords();

let redsTurn = true;

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});



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

server.listen(port, function(){
  console.log('listening on ' + port);
});
