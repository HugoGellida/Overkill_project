/**
 * @enum {string}
 */
const Color = {
  RED: "red",
  BLACK: "black",
};

/**
 *
 */
class Card {
  /**
   *
   * @param {Color} color
   * @param {number} value
   * @param {boolean} is_hidden
   */
  constructor(color, value, is_hidden = false) {
    /**
     * @type {Color}
     */
    this.color = color;

    /**
     * @type {number}
     */
    this.value = value;

    /**
     * @type {boolean}
     */
    this.is_hidden = is_hidden;
  }
}

export { Card, Color };
