const pg = require('pg');
const connectionString = require('./url');

const client = new pg.Client(connectionString);
client.connect();
let endedQueries = 0;

const queries = [];

function closeConnection() {
  endedQueries += 1;
  if (endedQueries >= queries.length) {
    client.end();
  }
}

queries.push(client.query('CREATE TABLE users(id BIGSERIAL PRIMARY KEY ,username VARCHAR(200) NOT NULL UNIQUE,birthday DATE, address text, bloodtype varchar(255), password varchar(200), arquicoins INTEGER)'));
queries[queries.length - 1].on('end', () => {
        // client.end();
  console.log('Table users created');
  closeConnection();
});

queries.push(client.query('CREATE TABLE kreditcards(id BIGSERIAL PRIMARY KEY ,number VARCHAR(200) NOT NULL,name_on_card text, expire_date date, user_id BIGINT references users(id) ) '));
queries[queries.length - 1].on('end', () => {
        // client.end();
  console.log('Table kreditcards created');
  closeConnection();
});
