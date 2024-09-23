const http = require('http');
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

server.listen(3001, () => {
    console.log('Server listening on port 3001, waiting for instruction');
});


const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./Database.db", (err) => {
    if (err) console.warn("Error occured while trying to open database");
});








io.on("connection", socket => {
    socket.on("log_in_request", (username, TSC) => {
        console.log("hi :)");
    });
});