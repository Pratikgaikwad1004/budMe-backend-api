const express = require("express");
const cors = require("cors");
const connect = require("./db");
const { log } = require("console");

connect();
const app = express();

app.use("", express.static("images"));

const host = "localhost";
const port = 3000;

app.use(cors());
app.use(express.json());


app.use("/api/v1/auth", require("./routes/UserAuth"));
app.use("/api/v1/msg", require("./routes/Chat"));
app.use("/api/v1/event", require("./routes/Events"));
app.use("/api/v1/project", require("./routes/Events"));
const server = app.listen(port, () => {
  console.log(`App is running on http://${host}:${port}`);
});

const users = {};
// const http = require('http').Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

// log(server)

io.on('connection', socket => {
  socket.on('login', (data) => {
    log("New User", data);
    users[socket.id] = data;
    log(users)
  })
  socket.on('join', function (data) {
    socket.join(data); // We are using room of socket io
  });
  socket.on('send', (myid ,anotherSocketId, msg) => {
    log(`Sending message from ${myid}`);
    log(`Sending message to ${anotherSocketId}`);
    io.sockets.in(myid).emit('receive', {message: msg, from: myid, to: anotherSocketId});
    // socket.broadcast.emit("receive", msg);
  });
})