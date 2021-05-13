const Manager = () => {
  let rooms = [];

  // A.createdAt;
  // B.createdAt;

  // attemptToAddRoomToDb = () => {
  //   if (A.createdAt < B.createAt) {
  //     return `${A.id}-${B.id}`;
  //   }

  //   return `${B.id}-${A.id}`;
  // };

  const getReverse = (roomName) => roomName.split("-").reverse().join("-");

  const addActiveRoom = (roomName) => {
    if (!rooms.find((r) => r === roomName || r === getReverse(roomName))) {
      rooms.push(roomName);
    }
  };

  const getActiveRoom = (potentialRoomName) => {
    return rooms.find((r) => r === roomName || r === getReverse(roomName));
  };
};
