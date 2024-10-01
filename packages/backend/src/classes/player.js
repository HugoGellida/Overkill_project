class player {
    constructor(TSC, socket, username, game){
        this.score = game.score;
        this.TSC = TSC;
        this.socket = socket;
        this.username = username;
        this.game = game;
        this.stay = false;
        this.cards = {
            "red": [],
            "black": []
        }
    }

    overkill_amount(){
        // overkill_count = 0;
        // this.cards.forEach((color) => {
        //     let count = 0;
        //     this.cards[color].forEach((card) => {
        //         count += card.value;
        //     });
        //     if (count >= this.game.objective) overkill_count ++;
        // });

        return Object.values(this.cards).reduce((overkill_count, color_card) => {
            const total = color_card.reduce((count, card) => count + card, 0)
            if (total > this.game.objective) return overkill_count + 1;
            else return overkill_count;
        }
        , 0);
        // return overkill_count;
    }

    point_amount(){
        return Object.values(this.cards).reduce((totalPoints, colorCards) => 
            totalPoints + colorCards.reduce((sum, card) => sum + card.value, 0)
        , 0);
    }

    play(){}
}

module.exports = player;