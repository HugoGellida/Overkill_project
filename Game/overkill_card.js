class Overkill_card{

    constructor(value, color){
        this.value = value;
        this.color = color;
    }

    toString(){
        return `${this.value} of ${this.color}`;
    }
}

module.exports = Overkill_card;