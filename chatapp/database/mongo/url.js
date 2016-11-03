// config/database.js

const connectionString = process.env.DATABASE_URL || 'mongodb://localhost/geochat';


module.exports = connectionString;
