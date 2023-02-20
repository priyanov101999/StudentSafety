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

// const express = require("express");
// const http = require("http");
// const socketio = require("socket.io");
// import bodyParser from "body-parser";
// const app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// const server = http.createServer(app);
// const io = socketio(server, {
//   transports: ["polling"],
//   cors: {
//     origin: "*",
//   },
// });

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });

//   socket.on("chat message", (msg) => {
//     console.log("message: " + msg);
//     io.emit("chat message", msg);
//   });
// });

// const port = process.env.PORT || 4000;
// server.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
