const Table = require('./table'); // eslint-disabled-this-line no-unused-vars
const bcrypt = require('bcrypt-nodejs');
// const knex = require('../../database/sql/knex');


class Users extends Table {


  constructor() {
    const table_name = 'users';
    super(table_name);
  }

  // Passwords methods
  //eslint-disable-next-line
  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  // checking if password is valid
  //eslint-disable-next-line
  validPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
  }

  // setAttributes(attributes) {
  //   this.parseAttributesForUpsert(attributes, true).then((filteredAttributes) => {
  //     Object.keys(filteredAttributes).forEach((key) => {
  //       this[key] = filteredAttributes[key];
  //     });
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // }

  findByUsername(username) {
    const attributes = {
      username,
    };
    return new Promise((resolve, reject) => {
      super.find(attributes).then((users) => {
        if (users.length !== 0) {
          return resolve(users[0]);
        }
        resolve(null);
      })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

const instance = new Users();


module.exports = instance;

//
// function User() {
//   this.id = 0;
//   // this.name ='';
//   // this.photo ='';
//   this.username = '';
//   this.password = ''; // need to declare the things that i want to be remembered for each user in the database
//   this.arquicoins = 0;
//   this.address = '';
//   this.bloodtype = '';
//   this.birthday = null;
//
//   this.save = function saveUser(callback) {
//     const client = new pg.Client(conString);
//     client.connect();
//
//
//     client.query('INSERT INTO users(username, password, address, bloodtype, birthday, arquicoins) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [this.username, this.password, this.address, this.bloodtype, this.birthday, this.arquicoins], (err, result) => {
//       if (err) {
//         console.error('error running query', err);
//         return callback(err, null);
//       }
//
//       const user = new User();
//       user.setAttributes(result.rows[0]);
//       client.end();
//       // no error
//       return callback(null, user);
//     });
//   };
//
//
//   this.setAttributes = function (attributes) {
//     Object.keys(attributes).forEach((key) => {
//       this[key] = attributes[key];
//     });
//   };
//
//   // Passwords methods
//   this.generateHash = function (password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
//   };
//
//   // checking if password is valid
//   this.validPassword = function (password) {
//     return bcrypt.compareSync(password, this.password);
//   };
// }
//
// function parseJsonToParams(json) {
//   const params = {
//     keys: [],
//     values: [],
//   };
//   // try, it will fail if json is not a json
//   try {
//     for (let i = 0; i < Object.keys(json).length; i++) {
//       params.keys.push(Object.keys(json)[i]);
//       params.values.push(json[Object.keys(json)[i]]);
//     }
//   } catch (e) {
//     return params;
//   }
//   return params;
// }
//
// User.update = function (id, attributes, callback) {
//   if (attributes.id) {
//     delete attributes.id;
//   }
//   const params = parseJsonToParams(attributes);
//   let query = 'UPDATE  users SET';
//   for (let j = 0; j < params.keys.length; j++) {
//     query += ` ${params.keys[j]} =($${(j + 1)}),`;
//   }
//   // delete the last ","
//   query = query.substring(0, query.length - 1);
//
//   query += ` WHERE id=($${(params.keys.length + 1)}`;
//   query += ') RETURNING *;';
//   const client = new pg.Client(conString);
//   client.connect();
//
//   params.values.push(id);
//   client.query(query, params.values, (err, result) => {
//     if (err) {
//       console.error('error running query', err);
//       return callback(err, null);
//     }
//
//     const user = new User();
//     user.setAttributes(result.rows[0]);
//     client.end();
//     // no error
//     return callback(null, user);
//   });
// };
//
// User.findOne = function (username, callback) {
//   const client = new pg.Client(conString);
//
//   // check if there is a user available for this username;
//   client.connect();
//
//   client.query('SELECT * from users where username=$1', [username], (err, result) => {
//     if (err) {
//       return callback(err, null);
//     }
//     // if no rows were returned from query, then new user
//     if (result.rows.length > 0) {
//       const user = new User();
//       user.setAttributes(result.rows[0]);
//       client.end();
//       // no error
//       return callback(null, user);
//     }
//
//     client.end();
//     return callback(null, null);
//   });
//   // });
// };
//
// User.findById = function (id, callback) {
//   const client = new pg.Client(conString);
//
//   client.connect();
//   client.query('SELECT * from users where id=$1', [id], (err, result) => {
//     if (err) {
//       return callback(err, null);
//     }
//     // if no rows were returned from query, then new user
//     if (result.rows.length > 0) {
//       const user = new User();
//       user.setAttributes(result.rows[0]);
//       return callback(null, user);
//     }
//     return callback('No user found', null);
//   });
// };
