DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;

CREATE TABLE messages
(
  id        serial NOT NULL,
  message   text   NOT NULL,
  timeSent  date   NOT NULL,
  sender_id serial NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE users
(
  id          serial NOT NULL,
  displayName text   NOT NULL,
  PRIMARY KEY (id)
);

ALTER TABLE messages
  ADD CONSTRAINT FK_users_TO_messages
    FOREIGN KEY (sender_id)
    REFERENCES users (id);