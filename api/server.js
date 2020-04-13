const express = require("express");

const accountsRouter = require("./accountsRouter");

const server = express();

server.use(express.json());
server.use(logger);

server.use('/api/accounts', accountsRouter);

function logger(req, res, next) {
  console.log(`\n=== LOG ===\nRequest method: ${req.method}\nRequest URL: ${req.originalUrl}\nTimestamp: ${new Date()}\n`);

  next();
}

module.exports = server;
