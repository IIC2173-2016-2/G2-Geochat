const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const passport = require('passport');
const flash = require('connect-flash');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');


const CLIENTID = 'DB3WCAB4IXWLMJYXLQNNAGS0BTLFQU4BV053WSERRIW20NKV';
const CLIENTSECRET = 'UQDYESVN1EFVYWWLV1V4JAN25C0NHAFX042X2OI1CF1SEW0C';
const foursquare = require('node-foursquare-venues')(CLIENTID, CLIENTSECRET);


// mongodb ==================================================================
const connectionString = require('./database/mongo//url');

mongoose.connect(connectionString);
// configuration ===============================================================

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.use(express.static('public'));

// for chat ====================================================

const http = require('http');

const server = http.createServer(app);
const io = require('socket.io').listen(server);

server.listen(port);

const chat = require('./config/chat.js');

chat.initialize(io);


// // usernames which are currently connected to the chat
// const usernames = {};
//
// // rooms which are currently available in chat
// const rooms = ['Concepcion', 'Santiago', 'Temuco', 'Chillan', 'Antofagasta', 'Valparaiso', 'La Serena', 'Puerto Montt',
//     'Talca', 'Iquique', 'Arica', 'Rancagua',
// ];
//
// io.sockets.on('connection', (socket) => {
//     // when the client emits 'adduser', this listens and executes
//   socket.on('adduser', (username) => {
//         // store the username in the socket session for this client
//     socket.username = username;
//         // store the room name in the socket session for this client
//     socket.room = 'Santiago';
//         // add the client's username to the global list
//     usernames[username] = username;
//         // send client to room 1
//     socket.join('Santiago');
//         // echo to client they've connected
//     socket.emit('updatechat', 'SERVER', 'you have connected to Santiago');
//         // echo to room 1 that a person has connected to their room
//     socket.broadcast.to('Santiago').emit('updatechat', 'SERVER', `${username} has connected to this room`);
//     socket.emit('updaterooms', rooms, 'room1');
//   });
//
//     // when the client emits 'sendchat', this listens and executes
//   socket.on('sendchat', (data) => {
//         // we tell the client to execute 'updatechat' with 2 parameters
//     io.sockets.in(socket.room).emit('updatechat', socket.username, data);
//   });
//
//   socket.on('switchRoom', (newroom) => {
//     socket.leave(socket.room);
//     socket.join(newroom);
//     socket.emit('updatechat', 'SERVER', `you have connected to ${newroom}`);
//         // sent message to OLD room
//     socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', `${socket.username} has left this room`);
//         // update socket session room title
//     socket.room = newroom;
//     socket.broadcast.to(newroom).emit('updatechat', 'SERVER', `${socket.username} has joined this room`);
//     socket.emit('updaterooms', rooms, newroom);
//   });
//
//
//     // when the user disconnects.. perform this
//   socket.on('disconnect', () => {
//         // remove the username from global usernames list
//     delete usernames[socket.username];
//         // update list of users in chat, client-side
//     io.sockets.emit('updateusers', usernames);
//         // echo globally that this client has left
//     socket.broadcast.emit('updatechat', 'SERVER', `${socket.username} has disconnected`);
//     socket.leave(socket.room);
//   });
// });
