const Overkill_player = require("./overkill_player");
const Overkill_card = require("./overkill_card");
const Overkill_game_master = require("./overkill_game_master");


let cards = [];
for (i = 1; i < 10; i++){
    ["red", "black"].forEach((c) => cards.push(new Overkill_card(i, c)))
}

let Game_master = new Overkill_game_master(1, 30, cards, []);
let Player1 = new Overkill_player("killerfishfromsandiego", Game_master);
let Player2 = new Overkill_player("amogus", Game_master);
Game_master.start_game()
Game_master.add_player(Player2);

const rooms = {};

io.on("connection", () => {

    
});