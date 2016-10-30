const Place = require('../app/mongoModels/place');


function saveOrUpdatePlace(placeName) {
  Place.findOne({
    name: placeName,
  }, (err, place) => {
    if (err) {
      return console.log(err);
    }
    if (!place) {
      const newPlace = new Place({
        name: placeName,
      });
      newPlace.save((err) => {
        if (err) {
          return console.log(err);
        }
      });
    } else {
      place.registerActivity();
    }
  });
}

exports.initialize = function (io) {
    // usernames which are currently connected to the chat
  const usernames = {};


    // ];

    // get the rooms names
  const rooms = ['alone-room'];

    // for (let i = 0; i < places.length; i++) {
    //   rooms.push(places[i].name);
    // }


  io.sockets.on('connection', (socket) => {
        // when the client emits 'adduser', this listens and executes
    socket.on('adduser', (username) => {
            // store the username in the socket session for this client
      socket.username = username;
            // store the room name in the socket session for this client
      socket.room = rooms[0];
            // add the client's username to the global list
      usernames[username] = username;
            // send client to room 1
      socket.join(rooms[0]);
            // echo to client they've connected
      socket.emit('updatechat', 'SERVER', `you have connected to ${rooms[0]}`);
            // echo to room 1 that a person has connected to their room
      socket.broadcast.to(rooms[0]).emit('updatechat', 'SERVER', `${username} has connected to this room`);
      socket.emit('updaterooms', rooms, 'room1');
    });


    socket.on('setrooms', (newRooms) => {
      rooms.concat(newRooms);
      socket.emit('updaterooms', rooms, 'room1');
    });

        // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', (data) => {
            // we tell the client to execute 'updatechat' with 2 parameters
      io.sockets.in(socket.room).emit('updatechat', socket.username, data);
    });

    socket.on('switchRoom', (newroom) => {
      saveOrUpdatePlace(newroom);
      socket.leave(socket.room);
      socket.join(newroom);
      socket.emit('updatechat', 'SERVER', `you have connected to ${newroom}`);
            // sent message to OLD room
      socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', `${socket.username} has left this room`);
            // update socket session room title
      socket.room = newroom;
      socket.broadcast.to(newroom).emit('updatechat', 'SERVER', `${socket.username} has joined this room`);
      socket.emit('updaterooms', rooms, newroom);
    });


        // when the user disconnects.. perform this
    socket.on('disconnect', () => {
            // remove the username from global usernames list
      delete usernames[socket.username];
            // update list of users in chat, client-side
      io.sockets.emit('updateusers', usernames);
            // echo globally that this client has left
      socket.broadcast.emit('updatechat', 'SERVER', `${socket.username} has disconnected`);
      socket.leave(socket.room);
    });
  });

  return true;
};
