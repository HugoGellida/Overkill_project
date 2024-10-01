import assert from "assert";
const card = require("./card");
const player = require("./player");

class game {
    constructor(game_id, initial_score, timer){

        assert(initial_score >= 5 && initial_score <= 10, "initial score must be between 5 and 10");
        assert(timer >= 30 && timer <= 60, "timer must be between 30 and 60");

        this.game_id = game_id;
        this.score = initial_score;
        this.timer = timer;
        this.players = [];
        this.bet = 1;
        this.draw = this.generate_cards();
        this.objective = 21;
    }

    addPlayer(player){
        assert(this.players.length != 2, "Cannot add another player because game is full");
        this.players.push(player);
    }

    static shuffle(list) {
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];  // Swap elements
        }
        return list;
    }

    generate_cards(){
        let cards = [];
        for(v = 0; v <= 9; v++){
            ["black", "red"].forEach((c) => {
                cards.push(new card(c, v));
            });
        }
        return game.shuffle(cards);
    }

    give_card_to(player, hidden=false, specified_color = null){
        let next_card;
        if (!specified_color) next_card = this.draw.pop(0);
        else {
            const color_draw = this.draw.filter((card) => card.color == specified_color);
            next_card = color_draw[0];
            this.draw = this.draw.filter((card) => card != next_card);
        }
        if (hidden) next_card.hidden = true;
        else next_card.hidden = false;
        player.cards[next_card.color].push(next_card);
    }

    start_game(){
        assert(players.length === 2);
        while (!this.game_over){
            this.start_round();
        }
    }

    start_round() {
        this.players.forEach((player) => {
            player.forEach((color) => {
                this.draw.push(...player.cards[color]);
            });
        });

        game.shuffle(this.draw);
        this.players.forEach((player) => {
            this.give_card_to(player, true, "red");
            this.give_card_to(player, false, "red");
            this.give_card_to(player, true, "black");
            this.give_card_to(player, false, "black");
            console.dir(player.cards);
        });

        let i = 0;

        while (!this.round_over){
            let current_player = player[i];
            current_player.play();
            i = (i + 1) % 2;
        }
        console.dir(this.round_winner());
        this.round_winner().score += this.bet;
        this.players.filter((player) => player != this.round_winner())[0].score -= this.bet;
        this.bet ++;
    }

    game_over(){
        return this.players.filter(player => player.score <= 0).length == 1;
    }

    round_over(){
        return this.players.filter((player) => player.stay).length == 2;
    }

    round_winner(){
        const player1 = this.players[0];
        const player2 = this.players[1];
        if (player1.overkill_amount() == player2.overkill_amount()){
            if (player1.point_amount() == player2.point_amount()) return null;
            else if (player1.point_amount() > player2.point_amount()) return player1;
            else return player2;
        } else if (player1.overkill_amount() > player2.overkill_amount()) return player2;
        else return player1;
    }
}

module.exports = game;