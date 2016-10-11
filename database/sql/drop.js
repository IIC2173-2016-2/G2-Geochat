const pg = require('pg');
const connectionString = require('./url');

const client = new pg.Client(connectionString);
client.connect();
const query = client.query('DROP SCHEMA public CASCADE;');
query.on('end', () => {
  const queryCreate = client.query('CREATE SCHEMA public;');
  queryCreate.on('end', () => {
    client.end();
  });
});
