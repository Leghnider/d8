const SocketServer = () => {
  // Initialize with no socket server
  let socketServer = null;

  // Allow the app to set the server
  const setSocketServer = (io) => {
    socketServer = io;
  };

  const getSocketServer = () => {
    return socketServer;
  };

  return {
    setSocketServer,
    getSocketServer,
  };
};

module.exports = SocketServer();
