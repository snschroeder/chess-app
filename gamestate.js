class GameState {
    constructor() {
        this.board = new Board()
        this.moveList = [];
    }
}

class Square {
    constructor(number, letter) {
        this.letter = letter;
        this.number = number;
        this.notation = this.letter + this.number;
        this.color;
    }
    setColor(color) {
        this.color = color;
    }
}

class Board {
    constructor() {
        this.dims = 8;
        this.playArea = new Array(this.dims);
        this.alpha = 'ABCDEFGH';
    }

    createBoard() {
        for (let i = 0; i < this.dims; i++) {
            this.playArea[i] = new Array(this.dims);
        }
    }

    assignNotation() {
        for (let i = 0; i < this.dims; i++) {
            for (let j = this.dims - 1; j >= 0; j--) {
                this.playArea[i][j] = new Square(j + 1, this.alpha[i]);
            }
        }
    }

    assignColor() {
        for (let i = 0; i < this.dims; i ++) {
            if (i % 2 === 0) {
                for (let j = 0; j < this.dims; j+=2) {
                    this.playArea[i][j].setColor('dark');
                    this.playArea[i][j + 1].setColor('light');
                }
            } else {
                for (let k = 0; k < this.dims; k +=2) {
                    this.playArea[i][k].setColor('light');
                    this.playArea[i][k + 1].setColor('dark');
                }
            }
        }
    }
}

let board = new Board();
board.createBoard();

board.assignNotation();
board.assignColor();
console.log(board.playArea);