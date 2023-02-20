require("dotenv").config();

const { DB_CONNECTION_STRING } = process.env;

module.exports = {
  development: {
    client: "mysql",
    connection: DB_CONNECTION_STRING,
    migrations: {
      tableName: "knex_migrations",
      directory: `${__dirname}/db/migrations`,
    },
    seeds: {
      directory: `${__dirname}/db/seeds`,
    },
  },
};
