const express = require('express');

const app = express();
const port = process.env.PORT || 6128;
const passport = require('passport');
const flash = require('connect-flash');
const Place = require('./app/mongoModels/place');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// mongodb ==================================================================
const connectionString = require('./database/mongo//url');

mongoose.connect(connectionString);
// configuration ===============================================================


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating


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
app.set('port', port);


const minutes = 24 * 60;
const the_interval = minutes * 60 * 1000;
setInterval(() => {
  const cutOff = new Date(new Date().getTime() - the_interval);
  Place.find({ updated_at: { $lt: cutOff } }).remove().exec();
  // do your stuff here
}, the_interval);
