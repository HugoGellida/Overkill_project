import assert from "assert";
import { Card, Color } from "./card.js";
import Player from "./player.js";

/**
 *
 */
class Game {
  /**
   *
   * @param {number} game_id
   * @param {number} initial_score
   * @param {number} timer
   */
  constructor(game_id, initial_score, timer) {
    assert(initial_score >= 5 && initial_score <= 10, "initial score must be between 5 and 10");
    assert(timer >= 30 && timer <= 60, "timer must be between 30 and 60");

    /**
     * @type {number}
     */
    this.game_id = game_id;

    /**
     * @type {number}
     */
    this.score = initial_score;

    /**
     * @type {number}
     */
    this.timer = timer;

    /**
     * @type {Player[]}
     */
    this.players = [];

    /**
     * @type {number}
     */
    this.bet = 1;

    /**
     * @type {Card[]}
     */
    this.draw = this.generateCards();

    /**
     * @type {number}
     */
    this.objective = 21;
  }

  /**
   *
   * @param {Player} player
   */
  addPlayer(player) {
    assert(this.players.length != 2, "Cannot add another player because game is full");
    this.players.push(player);
  }

  /**
   *
   * @param {Card[]} list
   * @returns {Card[]}
   */
  static shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]]; // Swap elements
    }
    return list;
  }

  /**
   *
   * @returns {Card[]}
   */
  generateCards() {
    const cards = new Array(18).fill().map(a => new Card(a % 2 ? Color.BLACK : Color.RED, Math.floor(i / 2) + 1));
    return Game.shuffle(cards);
  }

  /**
   *
   * @param {Player} player
   * @param {boolean} hidden
   * @param {Color} specified_color
   */
  giveCardTo(player, hidden = false, specified_color = null) {
    let next_card;
    if (!specified_color) next_card = this.draw.pop(0);
    else {
      const color_draw = this.draw.filter(card => card.color == specified_color);
      next_card = color_draw[0];
      this.draw = this.draw.filter(card => card != next_card);
    }
    if (hidden) next_card.is_hidden = true;
    else next_card.is_hidden = false;
    player.cards[next_card.color].push(next_card);
  }

  /**
   *
   * @param {Player} player
   */
  expurgate(player) {
    player.cards[Color.RED].push(new Card(Color.RED, 99));
    player.cards[Color.BLACK].push(new Card(Color.BLACK, 99));
  }

  /**
   *
   */
  async startGame() {
    assert(this.players.length === 2, "Cannot start the game with less than 2 players");
    while (!this.gameOver()) {
      console.log("round_begin");
      await this.startRound();
      console.log("round_end");
    }
  }

  /**
   *
   */
  async startRound() {
    this.players.forEach(player => {
      Object.keys(player.cards).forEach(color => {
        this.draw.push(...player.cards[color].filter(card => card.value != 99));
        player.cards[color] = [];
      });
    });

    Game.shuffle(this.draw);
    this.players.forEach(player => {
      this.giveCardTo(player, true, Color.RED);
      this.giveCardTo(player, false, Color.RED);
      this.giveCardTo(player, true, Color.BLACK);
      this.giveCardTo(player, false, Color.BLACK);
      player.stay = false;
    });

    let i = 0;

    while (!this.round_over()) {
      let current_player = this.players[i];
      try {
        const ended_turn = await current_player.play();
        if (ended_turn) {
          i = (i + 1) % 2;
        }
      } catch {
        this.expurgate(current_player);
      }
    }
    if (this.roundWinner()) {
      console.log(this.roundWinner().username);
      this.roundWinner().score += this.bet;
      this.players.filter(player => player != this.roundWinner())[0].score -= this.bet;
      this.players.reverse();
    } else console.log("draw");
    this.bet++;
  }

  /**
   *
   * @returns {boolean}
   */
  gameOver() {
    return this.players.filter(player => player.score <= 0).length == 1;
  }

  /**
   *
   * @returns {boolean}
   */
  round_over() {
    return (
      this.players.filter(player => player.stay).length == 2 ||
      this.players.filter(player => player.overkill_amount() == 2).length >= 1
    );
  }

  /**
   *
   * @returns {Player?}
   */
  roundWinner() {
    const [player1, player2] = this.players;
    if (player1.overkill_amount() == player2.overkill_amount()) {
      if (player1.point_amount() == player2.point_amount()) return null;
      if (player1.point_amount() > player2.point_amount()) return player1;
      return player2;
    }
    if (player1.overkill_amount() > player2.overkill_amount()) return player2;
    return player1;
  }
}

export { Game };
