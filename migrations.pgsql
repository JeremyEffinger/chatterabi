DROP TABLE IF EXISTS messages;

CREATE TABLE messages
(
  id        serial NOT NULL,
  message   text   NOT NULL,
  timeSent  TIMESTAMP   NOT NULL,
  sender_id text NOT NULL,
  PRIMARY KEY (id)
);
