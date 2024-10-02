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
db.pragma('journal_mode = WAL');
db.prepare("CREATE TABLE IF NOT EXISTS User(username VARCHAR(20), TSC VARCHAR(20) NOT NULL)").run();


import game from "./classes/game.js";
import player from "./classes/player.js";

const Game1 = new game(0, 10, 30);
const Games = [];

io.on("connection", socket => {

  socket.on("log_in_request", (username, TSC, method) => {
    const row = db.prepare("SELECT * FROM User WHERE TSC = ?").get(TSC);
    const success = method == "log_in"? !!row: !row;
    socket.emit("log_in_response", success);
    if (success) console.log("Successfully connected User");
    if (!row && method == "sign_in") {
      db.prepare("INSERT INTO User(username, TSC) VALUES(?, ?)").run(username, TSC);
      console.log("User successfully created");
    }
  });

  socket.on("get_stats", TSC => {
    const row = db.prepare("SELECT * FROM User WHERE TSC = ?").get(TSC);
    if (row) socket.emit("stats_answer", row.username, row.simulation_failed, row.simulation_success);
  });

  socket.on("join_game", (TSC) => {
    const row = db.prepare("SELECT username FROM User WHERE TSC = ?").get(TSC);
    if (row){
      const Player = new player(TSC, socket, row.username, Game1);
      Game1.add_player(Player);
    } else {
      console.log(TSC);
      console.log(row);
    }
  });

  socket.on("ask_start_game", () => {
    io.emit("start_game_allowed");
    Game1.start_game();
  });
});
