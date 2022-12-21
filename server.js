import * as dotenv from "dotenv";
dotenv.config();
import express, { json } from "express";
import path from "path";
import postgress from "postgres";
import expressWs from "express-ws";

//Setup express server
const server = express();
expressWs(server);
const port = 3000;

//SQL config
const db_url = process.env.CHATTERABI_DB_URL;
const sql = postgress(db_url);

const __dirname = path.resolve(); //ensure we have access to __dirname for mapping files to static html.

const clients = new Map(); //create map to hold clients

//Setup middleware
server.use(express.json());
server.use(express.static("Public"));

//Used for testing
server.use(function (req, res, next) {
  req.testing = "setup";
  return next();
});

//Start of api routes
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

//Static server history page
server.get("/history", (req, res, next) => {
  res.sendFile(`${__dirname}/Public/history.html`); //use __dirname to give entire path for file.
});

//Setup websocket connection on /index.html connection.
server.ws("/", (ws, req) => {
  clients.set(ws);
  console.log("connection", req.testing);

  //On message recieved event
  ws.on("message", function (msg) {
    const { id, text } = JSON.parse(msg); //parse id and text from the message
    const now = new Date(); //create a new date to pass to database
    sql`INSERT INTO messages (message, timesent, sender_id) VALUES (${text}, ${now}, ${id}) RETURNING *`.then(
      (result) => console.log(result[0]) //Commit message to db and log result.
    );
    //Send each message to each client in the client map.
    [...clients.keys()].forEach((client) => {
      client.send(msg);
    });
  });

  console.log("socket", req.testing); //log out that the socket has been setup.
});

//fail over routes
server.use((req, res, next) => {
  res.contentType("text/plain").status(404).send("Not Found");
});

server.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

//Run the express/ws server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
