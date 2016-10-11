// config/database.js
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/geochat';

module.exports = connectionString;
