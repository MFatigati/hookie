DROP TABLE IF EXISTS bin;

CREATE TABLE bin (
  id serial UNIQUE NOT NULL,
  key varchar NOT NULL
);