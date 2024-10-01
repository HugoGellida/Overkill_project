class card {
    constructor(color, value, is_hidden=false){
        this.color = color;
        this.value = value;
        this.is_hidden = is_hidden;
    }
}

module.exports = card;