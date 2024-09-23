class Overkill_game_master{

    constructor(game_master_id, game_max_timer, game_cards, game_assets){
        this.id = game_master_id;
        this.timer = game_max_timer;
        this.cards = this.shuffle(game_cards);
        this.assets = this.shuffle(game_assets);
        this.bet = 1;
        this.objective = 21;
        this.players = [];
    }

    add_player(player){
        if (this.players.length >= 2){
            console.warn("Cannot add more than 2 players");
            return false;
        }

        this.players.push(player);
    }

    shuffle(list){
        return list.sort(() => 0.5 - Math.random());
    }

    give_card_to_player(player, specified_color = null, hidden=false){
        if (!player){
            console.warn("Cannot give a card to null");
            return false;
        } else if (this.cards.length == 0){
            console.warn("No more cards to give");
            return false;
        } else if (specified_color && specified_color != "red" && specified_color != "black"){
            console.warn("Cannot give a card with unknown color");
            return false;
        }

        if (specified_color){
            const selected_card = this.cards.filter((card) => card.color == specified_color)[0];
            if (!selected_card){
                console.warn(`No more ${specified_color} cards to give`);
                return false;
            }

            this.cards = this.cards.filter((card) => card != selected_card);
            if (hidden) player.undercovered_cards[specified_color] = selected_card;
            else player.card_lists[specified_color].push(selected_card);
            console.log(`I gave the specified color card ${selected_card.toString()} to ${player.username} ${hidden?"Hidden stated":"Reveal stated"}`);
        } else {
            const selected_card = this.cards.shift();
            if (hidden) player.undercovered_cards[selected_card.color] = selected_card;
            else player.card_lists[selected_card.color].push(selected_card);
            console.log(`I gave the card ${selected_card.toString()} to ${player.username} ${hidden?"Hidden stated":"Reveal stated"}`);
        }
        return true;
    }

    give_asset_to_player(player, number){
        if (!player){
            console.warn("Cannot give an asset to null");
            return false;
        } else if (player.inventory_assets.length >= 1){
            console.warn("Cannot add assets when player have one asset or more");
            return false;
        } else if (this.assets.length < number){
            console.warn("Not enough assets are remaining");
            return false;
        }

        for (i = 0; i < number; i++){
            player.inventory_assets.push(this.assets[0]);
            this.assets = this.assets.shift();
        }

        return true;
    }

    reset_deck(player, color){
        if (!player){
            console.warn("Cannot reset deck of null");
            return false
        } else if (!color || (color != "red" && color != ("black"))){
            console.warn("Cannot reset deck of unknown color");
            return false;
        }

        player.card_lists[color].forEach(card => player.give_card_to_game_master(card));
        player.give_card_to_game_master(player.undercovered_cards[color]);
        this.shuffle(this.cards);
        this.give_card_to_player(player, color, true);
        this.give_card_to_player(player, color);
        return true;
    }

    start_game(){
        if (this.players.length != 2){
            console.warn("We need a total of 2 players");
            return false;
        }
        while(this.players.filter((player) => player.score <= 0).length == 0){
            this.start_round();
        }
    }

    start_round(){
        this.players.forEach((player) => {
            player.card_lists["red"].forEach((card) => player.give_card_to_game_master(card));
            player.card_lists["black"].forEach((card) => player.give_card_to_game_master(card));
            player.give_card_to_game_master(player.undercovered_cards["red"]);
            player.give_card_to_game_master(player.undercovered_cards["black"]);
            this.reset_deck(player, "red");
            this.reset_deck(player, "black");
        });
        console.dir(this.players[0].cards);
        let currentPlayer;
        let i = 0;
        while(this.players.filter((player) => player.staying_state).length != 2){
            currentPlayer = this.players[i];
            ["red", "black"].forEach((color) => console.log(`Hidden Card: ${currentPlayer.undercovered_cards[color].toString()} | Revealed Cards: ${currentPlayer.card_lists[color].map((card) => card.toString())}`));
        }
    }
}

module.exports = Overkill_game_master;