import express from "express";
import postgress from "postgres";

const server = express();
const port = 42055;

const sql = postgress({
  database: process.env.CHATTERABI_DB,
  username: process.env.CHATTERABI_DB_USERNAME,
  password: process.env.CHATTERABI_DB_PASSWORD,
});

server.use(express.json);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
