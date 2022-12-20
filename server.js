import express, { json } from "express";
import postgress from "postgres";
import expressWs from "express-ws";
import { v4 as uuidv4 } from "uuid";

const server = express();
expressWs(server);
const port = 3000;

const sql = postgress({
  database: process.env.CHATTERABI_DB,
  username: process.env.CHATTERABI_DB_USERNAME,
  password: process.env.CHATTERABI_DB_PASSWORD,
});

const clients = new Map();

server.use(express.json());
server.use(express.static("Public"));

server.use(function (req, res, next) {
  console.log("middleware");
  req.testing = "testing";
  return next();
});

server.get("/", (req, res, next) => {
  res.set("Content-Type", "text/plain");
  res.status(200);
  res.send("Welcome");
});

server.ws("/", (ws, req) => {
  clients.set(ws);
  console.log("connection");

  ws.on("message", function (msg) {
    console.log({ msg });
    [...clients.keys()].forEach((client) => {
      client.send(msg);
    });
  });
  console.log("socket", req.testing);
});

server.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});
server.use((req, res, next) => {
  res.contentType("text/plain").status(404).send("Not Found");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
