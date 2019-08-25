let gameState;

class GameState {
    constructor() {
        this.board = new Board()
        this.moveList = [];
        this.currentMove = ['white', 'black'];
    }

    move(piece, dest) {
        let piecePosition = piece.getPosition();
        if (piece.getColor() !== this.currentMove[0]) {
            return 'invalid move, please try again';

        }
        piece.valid_moves().forEach(possDest => {
            if (this.arrayComparator(possDest, dest)) {
                console.log('inside valid moves')
                if (this.board.getSquare(dest[0], dest[1]).getPiece() !== null) {
                    this.board.getSquare(dest[0], dest[1]).removePiece();
                    this.board.getSquare(dest[0], dest[1]).setPiece(piece);
                    this.board.getSquare(piecePosition[0], piecePosition[1]).removePiece()
                    this.currentMove.reverse();
                    return 'successful move'
                } else {
                    this.board.getSquare(dest[0], dest[1]).setPiece(piece);
                    this.board.getSquare(piecePosition[0], piecePosition[1]).removePiece()
                    this.currentMove.reverse();
                    return 'successful move'
                }
            }
        }) 
    }

    arrayComparator (possibleDest, desiredDest) {return (possibleDest[0] === desiredDest[0] && possibleDest[1] === desiredDest[1]);}
}






gameState = new GameState();
gameState.board.createBoard();
gameState.board.assignNotation();
gameState.board.assignColor();
gameState.board.populatePieces();
console.log(gameState.board.playArea);

gameState.move(gameState.board.playArea[1][3].getPiece(), [2, 3]);
gameState.move(gameState.board.playArea[6][3].getPiece(), [4, 3]);
console.log(gameState.board.playArea);

//console.log(board.playArea[0][0].getPiece().valid_moves());  

// const white_rook = new Rook('white', [3, 3]);

// const white_bishop = new Bishop('white', [2, 3]);

// const white_queen = new Queen('white', [0, 0]);


// console.log(white_rook.valid_moves());
// console.log(white_bishop.valid_moves());
// console.log(white_queen.valid_moves());

