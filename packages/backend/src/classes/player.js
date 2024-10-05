import { Socket } from "socket.io";
import { Game } from "./game.js";
import { Color, Card } from "./card.js";

/**
 *
 */
class Player {
  /**
   *
   * @param {*} TSC
   * @param {Socket} socket
   * @param {string} username
   * @param {Game} game
   */
  constructor(TSC, socket, username, game) {
    /**
     * @type {number}
     */
    this.score = game.score;

    /**
     * @type {string}     //! TSC is a string. It stands for Torture Subject Code
     */
    this.TSC = TSC;

    /**
     * @type {Socket}
     */
    this.socket = socket;

    /**
     * @type {string}
     */
    this.username = username;

    /**
     * @type {Game}
     */
    this.game = game;

    /**
     * @type {boolean}
     */
    this.stay = false;

    /**
     * @type {{red: Card[], black: Card[]}}
     */
    this.cards = {
      red: [],
      black: [],
    };
  }

  /**
   * 
   * @returns {number}
   */
  overkill_amount() {
    let overkill_count = 0;
    Object.keys(this.cards).forEach(color => {
      let count = 0;
      this.cards[color].forEach(card => {
        count += card.value;
      });
      if (count >= this.game.objective) overkill_count++;
    });
    return overkill_count;
  }

  /**
   * 
   * @returns {number}
   */
  point_amount() {
    return Object.values(this.cards).reduce(
      (totalPoints, colorCards) => totalPoints + colorCards.reduce((sum, card) => sum + card.value, 0),
      0,
    );
  }

  /**
   * 
   * @returns {Promise<boolean | string>}
   */
  async play() {
    return new Promise((resolve, reject) => {
      const warningTimeout = setTimeout(() => console.log("HURRY UP!!!!!"), 20000);
      const timeout = setTimeout(() => reject("Timeout, play faster next time"), 30000);

      this.socket.emit("play", this.cards);
      this.socket.on("play_answer", choice => {
        clearTimeout(warningTimeout);
        clearTimeout(timeout);

        if (choice === "stay") {
          this.stay = true;
        } else {
          this.stay = false;
          this.game.giveCardTo(this);
        }
        resolve(true);
      });
    });
  }
}

export { Player };
