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
        let overkill_count = 0;
        Object.keys(this.cards).forEach((color) => {
            let count = 0;
            this.cards[color].forEach((card) => {
                count += card.value;
            });
            if (count >= this.game.objective) overkill_count ++;
        });
        return overkill_count;
    }

    point_amount(){
        return Object.values(this.cards).reduce((totalPoints, colorCards) => 
            totalPoints + colorCards.reduce((sum, card) => sum + card.value, 0)
        , 0);
    }

    async play(){
        return new Promise((resolve, reject) => {
            let has_played = false;
            setTimeout(() => {
                if (!has_played) reject("Timeout, play faster next time");
            }, 30000);
            setTimeout(() => {
                if (!has_played) console.log("HURRY UP!!!!!");
            }, 20000);
            this.socket.emit("play", this.cards);
            this.socket.on("play_answer", (choice) => {
                has_played = true;
                if (choice == "stay"){
                    this.stay = true;
                    resolve(true);
                } else {
                    this.game.give_card_to(this);
                    resolve(true);
                }
            });
        });
    }
}

export default player;