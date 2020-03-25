const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = "ChatCord Bot";

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", socket => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin();
    socket.join();

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // Broadcast when a user connects
    // io.emit tells everyone whilst broadcast.emit doesn't
    // bother telling the user that's connecting
    // socket.emit only messages one person
    socket.broadcast.emit(
      "message",
      formatMessage(botName, "A user has joined the chat")
    );
  });

  // Listen for chatMessage
  socket.on("chatMessage", msg => {
    io.emit("message", formatMessage("USER:", msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat"));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
