// config/database.js
const connectionString = process.env.DATABASE_URL || 'postgres://postgres@localhost:5432/geochat';

module.exports = connectionString;
