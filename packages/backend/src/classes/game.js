import assert from "assert";
import card from "./card.js";

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

    add_player(player){
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
        for(let v = 1; v <= 9; v++){
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
        if (hidden) next_card.is_hidden = true;
        else next_card.is_hidden = false;
        player.cards[next_card.color].push(next_card);
    }

    expurgate(player){
        player.cards["red"].push(new card("red", 99));
        player.cards["black"].push(new card("black", 99));
    }

    async start_game(){
        assert(this.players.length === 2, "Cannot start the game with less than 2 players");
        while (!this.game_over()){
            console.log("round_begin");
            await this.start_round();
            console.log("round_end");
        }
    }

    async start_round() {
        this.players.forEach((player) => {
            Object.keys(player.cards).forEach((color) => {
                this.draw.push(...player.cards[color].filter((card) => card.value != 99));
                player.cards[color] = [];
            });
        });

        game.shuffle(this.draw);
        this.players.forEach((player) => {
            this.give_card_to(player, true, "red");
            this.give_card_to(player, false, "red");
            this.give_card_to(player, true, "black");
            this.give_card_to(player, false, "black");
            player.stay = false;
        });

        let i = 0;

        while (!this.round_over()){
            let current_player = this.players[i];
            try {
                const ended_turn = await current_player.play();
                if (ended_turn){
                    i = (i + 1) % 2;
                }
            } catch {
                this.expurgate(current_player);
            }
        }
        if (this.round_winner()){
            console.log(this.round_winner().username);
            this.round_winner().score += this.bet;
            this.players.filter((player) => player != this.round_winner())[0].score -= this.bet;
            this.players.reverse();
        }
        else console.log("draw");
        this.bet ++;
    }

    game_over(){
        return this.players.filter(player => player.score <= 0).length == 1;
    }

    round_over(){
        return this.players.filter((player) => player.stay).length == 2 || this.players.filter((player) => player.overkill_amount() == 2).length >= 1;
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

export default game;