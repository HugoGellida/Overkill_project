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
    else console.log("Database opened");
});

db.run("CREATE TABLE IF NOT EXISTS User(username VARCHAR(20), TSC VARCHAR(20) NOT NULL)", (err) => {
    if (err) console.warn("Error occured while creating table User");
    else console.log("Successfully created table User or table User already exists");
});

io.on("connection", socket => {
    socket.on("log_in_request", (username, TSC, method) => {
        db.get("SELECT * FROM User WHERE TSC = ?", [TSC], (err, row) => {
            if (err) console.warn("Error while trying to check log in");
            else {
                const success = method == "log_in"? !!row: !row;
                socket.emit("log_in_response", success);
                if (success && method == "log_in") console.log("Successfully connected User");
                if (!row && method == "sign_in") db.run("INSERT INTO User VALUES(?, ?)", [username, TSC], (err) => {
                    if (err) console.warn("Error while creating a user");
                    else console.log("User successfully created");
                });
            }
        });
    });
});