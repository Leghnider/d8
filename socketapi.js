const io = require( "socket.io" )();
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on('connection', (socket) => {
   console.log( "A user connected" );
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
  socket.broadcast.emit("Hello")
});

// end of socket.io logic

module.exports = socketapi;