const http = require('http');
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new require("socket.io")(server, {
    cors: { origin: "http://localhost:3000" }
});

server.listen(3001, () => {
    console.log('Server listening on port 3001, waiting for instruction');
});


const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./Database.db", (err) => { if (err) console.error(err); });

db.run("CREATE TABLE IF NOT EXISTS User(username VARCHAR(20), TSC VARCHAR(20) NOT NULL)", (err) => { if (err) console.error(err); });

io.on("connection", socket => {
    socket.on("log_in_request", (username, TSC, method) => {
        db.get("SELECT * FROM User WHERE TSC = ?", [TSC], (err, row) => {
            if (err) console.error(err);
            else {
                const success = method == "log_in"? !!row: !row;
                socket.emit("log_in_response", success);
                if (success && method == "log_in") console.log("Successfully connected User");
                if (!row && method == "sign_in") db.run("INSERT INTO User VALUES(?, ?, 0, 0)", [username, TSC], (err) => {
                    if (err) console.warn("Error while creating a user");
                    else console.log("User successfully created");
                });
            }
        });
    });

    socket.on("get_stats", (TSC) => {
        db.get("SELECT * FROM User WHERE TSC = ?", [TSC], (err, row) => {
            if (err) console.error(err);
            else if (row) socket.emit("stats_answer", row.username, row.simulation_failed, row.simulation_success);
        });
    });
});