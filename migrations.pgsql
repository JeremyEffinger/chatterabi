
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

CREATE TABLE messages
(
  id        serial NOT NULL,
  message   text   NOT NULL,
  timeSent  TIMESTAMP   NOT NULL,
  sender_id text NOT NULL,
  PRIMARY KEY (id)
);
