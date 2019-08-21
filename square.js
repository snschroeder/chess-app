class Square {
    constructor(number, letter) {
        this.letter = letter;
        this.number = number;
        this.notation = this.letter + this.number;
        this.color;
        this.piece = null;
    }
    setColor(color) {
        this.color = color;
    }
    setPiece(piece) {
        this.piece = piece;
    }
}