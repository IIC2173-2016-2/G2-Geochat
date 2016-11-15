
// Connect to server
const io = require('socket.io-client');

const socket = io.connect('http://assw7.ing.puc.cl/');


const username = process.argv[2] || 'Attacker';
let number_of_messages = process.argv[3] || 3;

number_of_messages = parseInt(number_of_messages, 10);
const register = (process.argv[4] === 'true');

// Add a connect listener
socket.on('connect', () => {
  socket.emit('adduser', username);
  for (let i = 0; i < number_of_messages; i++) {
    socket.emit('sendchat', `${(new Date()).getTime()}`);
  }
});
if (register) {
  console.log('username, time_to_deliver');
  socket.on('updatechat', (username, data) => {
    console.log(`${username},${(new Date()).getTime() - Number(data)}`);
  });
}


//
// var socket = io.connect('http://assw7.ing.puc.cl/');
//
// // on connection to server, ask for user's name with an anonymous callback
// socket.on('connect', function () {
//   // call the server-side function 'adduser' and send one parameter (value of prompt)
//   socket.emit('adduser', '<%= user.username %>');
// });
//
// // listener, whenever the server emits 'updatechat', this updates the chat body
// socket.on('updatechat', function (username, data) {
//   $('#conversation').append('<b>' + username + ':</b> ' + data + '<br>');
// });
//
// // // listener, whenever the server emits 'updaterooms', this updates the room the client is in
// socket.on('updaterooms', function (rooms, current_room) {
//   // $('#rooms').empty(); $.each(rooms, function (key, value) {   if (value == current_room) {     $('#rooms').append('<li>' + value + '</li>');   } else {     $('#rooms').append('<li><a href="#" onclick="switchRoom(\'' + value + '\')">' + value +
//   // '</a></li>');   } });
// });
//
// function switchRoom(room) {
//   $('#conversation').empty();
//   socket.emit('switchRoom', room);
// }
//
// // on load of page
// $(function () {
//   // when the client clicks SEND
//   $('#datasend').click(function () {
//     var message = $('#data').val();
//     $('#data').val('');
//     // tell server to execute 'sendchat' and send along one parameter
//     socket.emit('sendchat', message);
//   });
//
//   // when the client hits ENTER on their keyboard
//   $('#data').keypress(function (e) {
//     if (e.which == 13) {
//       $(this).blur();
//       $('#datasend').focus().click();
//     }
//   });
// });
