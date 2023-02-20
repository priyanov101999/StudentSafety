import Knex from "knex";

const {
  DB_CONNECTION_STRING = "",
  DB_HOST = "",
  DB_PORT = "",
  DB_NAME = "",
  DB_USER = "",
  DB_PASS = "",
  DB_POOL_MIN = "2",
  DB_POOL_MAX = "100",
} = process.env;

let connection;
if (DB_HOST) {
  connection = {
    host: DB_HOST,
    port: parseInt(DB_PORT, 10),
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
  };
} else {
  const props = DB_CONNECTION_STRING.split("/");
  const database = props[3];
  const [host, port] = props[2].split("@")[1].split(":");
  const [user, password] = props[2].split("@")[0].split(":");
  connection = {
    database,
    host,
    port: parseInt(port, 10),
    user,
    password,
  };
}

const knex = Knex({
  client: "mysql",
  connection,
  pool: {
    min: parseInt(DB_POOL_MIN, 10),
    max: parseInt(DB_POOL_MAX, 10),
  },
});

export default knex;
