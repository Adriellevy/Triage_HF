const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const connectedUsers = new Set();

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);
  connectedUsers.add(socket.id);
  io.emit("users", Array.from(connectedUsers)); // emitimos lista actual

  socket.on("signal", ({ to, from, data }) => {
    console.log(`➡️ Enviando señal de ${from} a ${to}`);
    io.to(to).emit("signal", { from, data });
  });

  socket.on("disconnect", () => {
    console.log("Desconectado:", socket.id);
    connectedUsers.delete(socket.id);
    io.emit("users", Array.from(connectedUsers));
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor señalizando en http://localhost:${PORT}`);
});
