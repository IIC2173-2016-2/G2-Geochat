module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/geochat',
    migrations: {
      directory: `${__dirname}/database/sql/migrations`,
    },
    seeds: {
      directory: `${__dirname}/database/sql/seeds/development`,
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost:5432/geochat',
    migrations: {
      directory: `${__dirname}/database/sql/migrations`,
    },
    seeds: {
      directory: `${__dirname}/database/sql/seeds/production`,
    },
  },
};
