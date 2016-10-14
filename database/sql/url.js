// config/database.js
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:127.0.0.1/geochat';

module.exports = connectionString;
