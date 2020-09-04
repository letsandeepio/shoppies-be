DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id serial PRIMARY KEY NOT NULL,
  name varchar(255) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nominations text,
  uuid varchar(255) UNIQUE
);

