const io = require( "socket.io" )();
const socketapi = {
    io: io
};

// Add your socket.io logic here!
// io.on('connection', function(client) {
//   console.log('Client connected...');
//   client.on('join', function(data) {
//       client.on('messages', function(data) {
//           client.emit('broad', data);
//           client.broadcast.emit('broad',data);
//       });
//   });
// });

// end of socket.io logic

module.exports = socketapi;