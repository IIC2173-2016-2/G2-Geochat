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

queries.push(client.query('CREATE TABLE users(id BIGSERIAL PRIMARY KEY ,username VARCHAR(200) NOT NULL, password varchar(200), arquicoins INTEGER)'));
queries[queries.length - 1].on('end', () => {
        // client.end();
  console.log('Table users created');
  closeConnection();
});
