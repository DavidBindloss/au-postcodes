"use strict";
import express from "express";
import paginate from "express-paginate";
import { readFileSync } from "fs";
import hash from "object-hash";

const PORT = process.env.PORT || 1337;

// Import the postcode data from file.
const json = JSON.parse(
  readFileSync(
    new URL(
      "./submodules/australianpostcodes/australian_postcodes.json",
      import.meta.url
    )
  )
);

// Take the hash of the json file for use in the hash end point
// we only want to do this on startup to avoid unecessary overhead
// of hashing the object every request.
const objHash = hash(json);

const app = express();

app.use(paginate.middleware(20, 50));

app.all(function (req, res, next) {
  // set default or minimum is 10 (as it was prior to v0.2.0)
  if (req.query.limit <= 20) req.query.limit = 20;
  next();
});

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.get("/ping", (req, res) => {
  res.sendStatus(200);
});

app.get("/hash", (_, res) => {
  res.send({ md5Hash: objHash });
});

app.get("/postcodes/:postcode?", (req, res) => {
  if (req.params.postcode) {
    const pcData = json.find((obj) => obj.postcode === req.params.postcode);
    if (typeof pcData !== "undefined") {
      res.send(pcData);
    } else {
      res.sendStatus(404);
    }
  } else {
    const results = json.slice(req.skip, req.skip + req.query.limit);
    const pageCount = Math.ceil(json.length / req.query.limit);

    if (req.accepts("json")) {
      res.json({
        pageCount,
        results,
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
