// Import required modules
import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import { default as routes } from "./src/routes/Routes";

// Create express and http servers
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const server = http.createServer(app);
const socketUtils = require("./src/utils/socketUtils");
export const io = socketUtils.sio(server);
socketUtils.connection(io);

const PORT = process.env.PORT || 4000;
initializeApplication();

module.exports = app;

async function initializeApplication() {
  routes(app);
  server.listen(PORT, () => {
    console.log("App Started!!");
  });
  return;
}
