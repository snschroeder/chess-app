class GameState {
    constructor() {
        this.board = new Board()
        this.moveList = [];
        this.currentMove = 'white';
    }
}

let board = new Board();
board.createBoard();

board.assignNotation();
board.assignColor();
console.log(board.playArea);