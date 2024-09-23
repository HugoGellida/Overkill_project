class Overkill_player{

    constructor(username, game_master, score=10){
        this.username = username;
        this.game_master = game_master;
        this.card_lists = {
            "red": [],
            "black": []
        }
        this.undercovered_cards = {
            "red": null,
            "black": null
        }
        this.score = score;
        this.staying_state = false;
        this.inventory_assets = [];
        this.passive_played_assets = [];
    }

    give_card_to_game_master(selected_card){
        if (!selected_card){
            console.warn("Cannot give a non existing card to game master");
            return false;
        } else if (!this.game_master){
            console.warn("Cannot give card to null");
        } else if (!this.card_lists[selected_card.color].includes(selected_card)){
            console.warn("Cannot give a not owned card to game_master");
            return false;
        }

        this.game_master.cards.push(selected_card);
        this.card_lists[selected_card.color] = this.card_lists[selected_card.color].filter((card) => card != selected_card);
        return true;
    }

    
}

module.exports = Overkill_player;