import socketIO from "socket.io";
import * as ReportController from "./../controller/ReportController.js";
exports.sio = (server) => {
  return socketIO(server, {
    transports: ["polling"],
    cors: {
      origin: "*",
    },
  });
};

exports.connection = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("join", function (id) {
      socket.join(id);
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("chat message", (msg) => {
      io.emit("chat message", msg);
    });
  });
};
