const { createServer } = require("http");
const socketIo = require("socket.io");
const { message, session, avatar } = require("./services/watson");

const PORT = 8080;
let server;
let io;
let port;
let sessionId;

class ChatServer {
  constructor(app) {
    this.app = app;
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
  }

  createServer() {
    server = createServer(this.app);
  }

  config() {
    port = process.env.PORT || PORT;
  }

  sockets() {
    io = socketIo(server);
  }

  listen() {
    server.listen(port, () => {
      console.log("Running chat-server on port %s", port);
    });

    io.on("connect", socket => {
      console.log("Connected client on port %s.", port);
      socket.on("message", async m => {
        console.log("[server](message): %s", JSON.stringify(m));
        io.emit("message", m);

        if (m.action === 0) {
          sessionId = await session();
          console.log({sessionId})
          io.emit("message", {
            from: { id: 666, avatar, name: "Watson" },
            content: 'Olá, em que posso ajudar?'
          });
        }
        if (m.content && sessionId) {
          console.log({sessionId})
          const response = await message(m.content, sessionId, io);
          io.emit("message", {
            from: { id: 666, avatar, name: "Watson" },
            content: response
          });
        }
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }
}

module.exports = ChatServer;
