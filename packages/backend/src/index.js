import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import Database from "better-sqlite3";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

server.listen(3001, () => {
  console.log("Server listening on port 3001, waiting for instruction");
});

const db = new Database("./database.db");

db.prepare("CREATE TABLE IF NOT EXISTS User(username VARCHAR(20), TSC VARCHAR(20) NOT NULL)").run();

io.on("connection", socket => {
  socket.on("log_in_request", (username, TSC, method) => {
    const row = db.prepare("SELECT * FROM User WHERE TSC = ?").get(TSC);
    const success = method == "log_in";
    socket.emit("log_in_response", success);
    if (success) console.log("Successfully connected User");
    if (!row && method == "sign_in") {
      db.prepare("INSERT INTO User VALUES(?, ?, 0, 0)").run(username, TSC);
      console.log("User successfully created");
    }
  });

  socket.on("get_stats", TSC => {
    const row = db.prepare("SELECT * FROM User WHERE TSC = ?").get(TSC);
    if (row) socket.emit("stats_answer", row.username, row.simulation_failed, row.simulation_success);
  });
});
