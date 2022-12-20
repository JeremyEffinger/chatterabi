import * as dotenv from "dotenv";
dotenv.config();
import express, { json } from "express";
import path from "path";
import postgress from "postgres";
import expressWs from "express-ws";

const server = express();
expressWs(server);
const port = 3000;

const db_url = process.env.CHATTERABI_DB_URL;
const sql = postgress(db_url);
const __dirname = path.resolve();
const clients = new Map();

server.use(express.json());
server.use(express.static("Public"));

server.use(function (req, res, next) {
  req.testing = "setup";
  return next();
});

server.get("/api/history", (req, res, next) => {
  sql`SELECT * FROM messages;`.then((history) => {
    res.json(history);
  });
});

server.get("/api/history/user/:id", (req, res, next) => {
  let id = req.params.id;
  sql`SELECT * FROM messages WHERE sender_id=${id};`.then((message) => {
    if (message.length === 0) {
      res.set("Content-Type", "text/plain");
      res.status(404);
      res.send("Not Found");
    }
    res.json(message);
  });
});

server.get("/history", (req, res, next) => {
  res.sendFile(`${__dirname}/Public/history.html`);
});

server.ws("/", (ws, req) => {
  clients.set(ws);
  console.log("connection", req.testing);

  ws.on("message", function (msg) {
    const { id, text } = JSON.parse(msg);
    const now = new Date();
    sql`INSERT INTO messages (message, timesent, sender_id) VALUES (${text}, ${now}, ${id}) RETURNING *`.then(
      (result) => console.log(result[0])
    );
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
