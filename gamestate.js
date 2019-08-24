class GameState {
    constructor() {
        this.board = new Board()
        this.moveList = [];
        this.currentMove = 'white';
    }
}

board = new Board();
board.createBoard();

board.assignNotation();
board.assignColor();
board.populatePieces();
console.log(board.playArea);

console.log(board.playArea[7][2].getPiece().valid_moves());  

// const white_rook = new Rook('white', [3, 3]);

// const white_bishop = new Bishop('white', [2, 3]);

// const white_queen = new Queen('white', [0, 0]);


// console.log(white_rook.valid_moves());
// console.log(white_bishop.valid_moves());
// console.log(white_queen.valid_moves());