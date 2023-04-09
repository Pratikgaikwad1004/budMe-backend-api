const express = require("express");
const cors = require("cors");
const connect = require("./db");
connect();
const app = express();
app.use("", express.static("images"));

const host = "localhost";
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", require("./routes/UserAuth"));
app.use("/api/v1/event", require("./routes/Events"));


app.listen(port, () => {
  console.log(`App is running on http://${host}:${port}`);
});