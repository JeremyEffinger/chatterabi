import * as dotenv from "dotenv";
dotenv.config();
import express, { json } from "express";
import postgress from "postgres";
import expressWs from "express-ws";

const server = express();
expressWs(server);
const port = 3000;

const sql = postgress({
  database: process.env.CHATTERABI_DB,
  username: process.env.CHATTERABI_DB_USERNAME,
  password: process.env.CHATTERABI_DB_PASSWORD,
});

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

const clients = new Map();

server.use(express.json());
server.use(express.static("Public"));

server.use(function (req, res, next) {
  console.log("middleware");
  req.testing = "testing";
  return next();
});

server.get("/history", (req, res, next) => {
  sql`SELECT * FROM messages;`.then((history) => {
    res.json(history);
  });
});

server.ws("/", (ws, req) => {
  clients.set(ws);
  console.log("connection");

  ws.on("message", function (msg) {
    const { id, color, text } = JSON.parse(msg);
    console.log(`${id} sent "${text}" at time ${formatDate(new Date())}`);
    const now = new Date();
    sql`INSERT INTO messages (message, timesent, sender_id) VALUES (${text}, ${now}, ${id}) RETURNING *`.then(
      (result) => console.log(result)
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
