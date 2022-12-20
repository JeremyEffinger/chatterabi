import express, { json } from "express";
import postgress from "postgres";
import expressWs from "express-ws";
import { v4 as uuidv4 } from "uuid";
//import cookieParser from "cookie-parser";

const server = express();
expressWs(server);
const port = 3000;

const sql = postgress({
  database: process.env.CHATTERABI_DB,
  username: process.env.CHATTERABI_DB_USERNAME,
  password: process.env.CHATTERABI_DB_PASSWORD,
});

const clients = new Map();

// server.use(cookieParser());
server.use(express.json());
server.use(express.static("Public"));

server.use(function (req, res, next) {
  console.log("middleware");
  req.testing = "testing";
  return next();
});

// server.use(function (req, res, next) {
//   const id = uuidv4();
//   var cookie = req.cookies.chatterabi;
//   if (cookie === undefined) {
//     res.cookie("chatterabi", id, {
//       maxAge: 900000,
//       httpOnly: true,
//     });
//     console.log("cookie created");
//   } else {
//     console.log("cookie exists", cookie);
//   }
//   next();
// });

server.get("/", (req, res, next) => {
  res.set("Content-Type", "text/plain");
  res.status(200);
  res.send("Welcome");
});

server.ws("/", (ws, req) => {
  const id = uuidv4();
  const color = Math.floor(Math.random() * 360);
  const metadata = { id, color };

  clients.set(ws, metadata);

  ws.on("message", function (msg) {
    console.log({ metadata, msg });
    [...clients.keys()].forEach((client) => {
      client.send(JSON.stringify({ metadata, msg }));
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
