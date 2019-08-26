let gameState;

class GameState {
    constructor() {
        this.board = new Board()
        this.moveList = [];
        this.currentMove = ['white', 'black'];
    }

    move(piece, dest) {
        let piecePos = piece.getPosition();
        if (piece.getColor() !== this.currentMove[0]) {
            return 'invalid move, please try again';

        }
        piece.valid_moves().forEach(possDest => {
            if (this.moveComparator(possDest, dest)) {
                if (this.board.getSquare(dest[0], dest[1]).getPiece() !== null) {
                    this.board.getSquare(dest[0], dest[1]).removePiece();
                    this.board.getSquare(dest[0], dest[1]).setPiece(piece);
                    this.board.getSquare(piecePos[0], piecePos[1]).removePiece()
                    this.currentMove.reverse();
                    return 'successful move'
                } else {
                    this.board.getSquare(dest[0], dest[1]).setPiece(piece);
                    this.board.getSquare(piecePos[0], piecePos[1]).removePiece()
                    this.currentMove.reverse();
                    return 'successful move'
                }
            }
        }) 
    }

    checkForCheck() {

    }



/*
look at the currentMove's king -
    run a check for all opposite color pieces, pulling in their valid moves. Combine these into one array
    if one of the moves hits the king, king can move, or a piece can block

    if two options hit the king's current square, can only move the king

    after current move player has made a move, check again
        if still under attack, move is invalid

*/





    checkForCheckmate() {
        let attackingMoves = [];

        gameState.board.playArea.forEach(row => row.forEach(col => {
            if (col.getPiece() !== null && col.getPiece().getColor() === this.currentMove[1]) {
                attackingMoves.push(col.getPiece().valid_moves())
            }
        }))
        let king = gameState.board.findPieceByName('king', this.currentMove[0]);
        let kingMoves = king.valid_moves();
        console.log(kingMoves);
        

        kingMoves.filter(move => {
            attackingMoves.forEach(attackingMove => {
                return (!this.moveComparator(move, attackingMove))
            })
        })
        if (kingMoves.length === 0) {
            return 'checkmate'
        }

    }
/*
look at currentMove's king
    if king is in check and all valid moves are covered by enemy moves AND no pieces can block the check, return checkmate
*/

    moveComparator (possibleDest, desiredDest) {return (possibleDest[0] === desiredDest[0] && possibleDest[1] === desiredDest[1]);}
}






gameState = new GameState();
gameState.board.createBoard();
gameState.board.assignNotation();
gameState.board.assignColor();
gameState.board.populatePieces();
console.log(gameState.board.playArea);
console.log(gameState.board.playArea);
console.log(gameState.checkForCheckmate())

//console.log(board.playArea[0][0].getPiece().valid_moves());  

// const white_rook = new Rook('white', [3, 3]);

// const white_bishop = new Bishop('white', [2, 3]);

// const white_queen = new Queen('white', [0, 0]);


// console.log(white_rook.valid_moves());
// console.log(white_bishop.valid_moves());
// console.log(white_queen.valid_moves());


// gameState.move(gameState.board.playArea[1][3].getPiece(), [2, 3]);
// gameState.move(gameState.board.playArea[6][3].getPiece(), [4, 3]);

//  getSquareByCoord(rank, file) {return this.board.getSquare(rank, file);}

