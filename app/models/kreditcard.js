const pg = require('pg');
const conString = require('../../database/sql/url');


function KreditCard() {
  this.id = 0;
  // this.name ='';
  // this.photo ='';
  this.number = null;
  this.name_on_card = null;
  this.user_id = null;
  this.expire_date = null;
  this.operator = null;

  this.save = function saveUser(callback) {
    const client = new pg.Client(conString);
    client.connect();


    client.query('INSERT INTO kreditcards(number, name_on_card, user_id, expire_date, operator) VALUES($1, $2, $3, $4, $5) RETURNING *', [this.number, this.name_on_card, this.user_id, this.expire_date, this.operator], (err, result) => {
      if (err) {
        console.error('error running query', err);
        return callback(err, null);
      }

      const card = new KreditCard();
      card.setAttributes(result.rows[0]);
      client.end();
      // no error
      return callback(null, card);
    });
  };

  this.isValid = function () {
    const now = new Date();
    if (!this.expire_date || !this.name_on_card || this.number || !this.operator) {
      return false;
    }
    return (now.getTime() > this.expire_date.getTime());
  };

  this.setAttributes = function (attributes) {
    Object.keys(attributes).forEach((key) => {
      this[key] = attributes[key];
    });
  };
}

function parseJsonToParams(json) {
  const params = {
    keys: [],
    values: [],
  };
  // try, it will fail if json is not a json
  try {
    for (let i = 0; i < Object.keys(json).length; i++) {
      params.keys.push(Object.keys(json)[i]);
      params.values.push(json[Object.keys(json)[i]]);
    }
  } catch (e) {
    return params;
  }
  return params;
}

KreditCard.update = function (id, attributes, callback) {
  if (attributes.id) {
    delete attributes.id;
  }
  const params = parseJsonToParams(attributes);
  let query = 'UPDATE  users SET';
  for (let j = 0; j < params.keys.length; j++) {
    query += ` ${params.keys[j]} =($${(j + 1)}),`;
  }
  // delete the last ","
  query = query.substring(0, query.length - 1);

  query += ` WHERE id=($${(params.keys.length + 1)}`;
  query += ') RETURNING *;';
  const client = new pg.Client(conString);
  client.connect();

  params.values.push(id);
  client.query(query, params.values, (err, result) => {
    if (err) {
      console.error('error running query', err);
      return callback(err, null);
    }

    const card = new KreditCard();
    card.setAttributes(result.rows[0]);
    client.end();
    // no error
    return callback(null, card);
  });
};

KreditCard.findFromUser = function (id, callback) {
  const client = new pg.Client(conString);

  // check if there is a user available for this username;
  client.connect();

  client.query('SELECT * from kreditcards where user_id=$1', [id], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    const cards = [];
    // if no rows were returned from query, then new user
    for (let i = 0; i < result.rows.length; i++) {
      const card = new KreditCard();
      card.setAttributes(result.rows[i]);
      cards.push(card);
    }
    client.end();
    // no error
    return callback(null, cards);
  });
  // });
};

KreditCard.findById = function (id, callback) {
  const client = new pg.Client(conString);

  client.connect();
  client.query('SELECT * from kreditcards where id=$1', [id], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    // if no rows were returned from query, then new user
    if (result.rows.length > 0) {
      const card = new KreditCard();
      card.setAttributes(result.rows[0]);
      return callback(null, card);
    }
    return callback('No card found', null);
  });
};


module.exports = KreditCard;
