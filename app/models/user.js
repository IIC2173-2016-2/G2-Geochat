const pg = require('pg');
const bcrypt = require('bcrypt-nodejs');
const conString = require('../../config/database');


function User() {
  this.id = 0;
    // this.name ='';
    // this.photo ='';
  this.username = '';
  this.password = ''; // need to declare the things that i want to be remembered for each user in the database
  this.arquicoins = 0;

  this.save = function saveUser(callback) {
    const client = new pg.Client(conString);
    client.connect();


    client.query('INSERT INTO users(username, password, arquicoins) VALUES($1, $2, $3) RETURNING *', [this.username, this.password, this.arquicoins], (err, result) => {
      if (err) {
        console.error('error running query', err);
        return callback(err, null);
      }

      const user = new User();
      user.username = result.rows[0].username;
      user.password = result.rows[0].password;
      user.id = result.rows[0].id;
      client.end();
            // no error
      return callback(null, user);
    });
  };


    // Passwords methods
  this.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

    // checking if password is valid
  this.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
}

User.findOne = function (username, callback) {
  const client = new pg.Client(conString);

    // check if there is a user available for this username;
  client.connect();

  client.query('SELECT * from users where username=$1', [username], (err, result) => {
    if (err) {
      return callback(err, null);
    }
        // if no rows were returned from query, then new user
    if (result.rows.length > 0) {
      const user = new User();
      user.username = result.rows[0].username;
      user.password = result.rows[0].password;
      user.id = result.rows[0].id;
      client.end();
      // no error
      return callback(null, user);
    }

    client.end();
    return callback(null, null);
  });
    // });
};

User.findById = function (id, callback) {
  const client = new pg.Client(conString);

  client.connect();
  client.query('SELECT * from users where id=$1', [id], (err, result) => {
    if (err) {
      return callback(err, null);
    }
        // if no rows were returned from query, then new user
    if (result.rows.length > 0) {
      const user = new User();
      user.username = result.rows[0].username;
      user.password = result.rows[0].password;
      user.id = result.rows[0].id;
      return callback(null, user);
    }
    return callback('No user found', null);
  });
};


module.exports = User;
