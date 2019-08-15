class GameState {
    constructor() {
        this.board = new Board()
        this.moveList = [];
    }
}

class Square {
    constructor(letter, number) {
        this.letter = letter;
        this.number = number;
    }
}

class Board {
    constructor() {
        this.dims = 8;
        this.board = new Array(this.dims);
        this.alpha = 'ABCDEFGH';
    }

    createBoard() {
        for (let i = 0; i < this.dims; i++) {
            this.board[i] = new Array(this.dims);
        }
    }
    assignNotation() {
        for (let i = 0; i < this.dims; i++) {
            for (let j = this.dims; j > 0; j--) {
                this.board[i][j] = new Square(this.alpha[i], j)
            }
        }
    }
}

let board = new Board();
board.createBoard();
board.assignNotation();
console.log(board.board);