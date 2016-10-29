// config/passport.js

// load all the things we need
const LocalStrategy = require('passport-local').Strategy;

// load up the user model
const User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function auth(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

    // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with username
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true, // allows us to pass back the entire request to the callback
  },
        (req, username, password, done) => {
            // asynchronous
            // User.findOne wont fire unless data is sent back
          process.nextTick(() => {
                // find a user whose username is the same as the forms username
                // we are checking to see if the user trying to login already exists
            User.findOne(username, (err, user) => {
              // if there are any errors, return the error
              if (err) {
                return done(err);
              }
              // check to see if theres already a user with that username
              if (user) {
                return done(null, false, req.flash('signupMessage',
                            'That username is already taken.'));
              }
              // if there is no user with that username
                    // create the user
              const newUser = new User();

              // set the user's local credentials
              newUser.username = username;
              newUser.password = newUser.generateHash(password);
              newUser.address = req.body.address;
              newUser.bloodtype = req.body.bloodtype;
              if ((new Date(req.body.birthday) !== 'Invalid Date' && !isNaN(new Date(req.body.birthday)))) {
                newUser.birthday = req.body.birthday;
              }

              // save the user
              newUser.save((err, user) => {
                if (err) {
                  return done(req.flash('signupMessage', err));
                }
                return done(null, user);
              });
            });
          });
        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with username
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true, // allows us to pass back the entire request to the callback
  },
        (req, username, password, done) => {
          // callback with username and password from our form

          // find a user whose username is the same as the forms username
          // we are checking to see if the user trying to login already exists
          User.findOne(username, (err, user) => {
                // if there are any errors, return the error before anything else
            if (err) {
              return done(err);
            }
                // if no user is found, return the message
            if (!user) {
              return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }
                // if the user is found but the password is wrong
            if (!user.validPassword(password)) {
              return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            }
                // all is well, return successful user
            return done(null, user);
          });
        }));
};
