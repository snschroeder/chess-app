import Board from './modules/board';

class GameState {
    constructor() {
        this.board = new Board()
        this.moveList = [];
        this.currentMove = ['white', 'black'];
        this.currentState = [
            {player: 'white', pieceTotal: 0},
            {player: 'black', pieceTotal: 0}
        ]
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

    checkForCheck(kingPos, attackSide) {
        let attackingMoves = gameState.generateAllMovesByColor(attackSide).flat();
        attackingMoves = attackingMoves.filter(move => this.moveComparator(move, kingPos))
        
        if (attackingMoves.length === 1) {
            return 1;
        } else if (attackingMoves.length === 2) {
            return 2;
        } else {
            return 0;
        }
    }




/*
    turn sequence
        check for check
            if check, check for checkmate
                if checkmate, game ends
            if not checkmate, player must move to get out of check
        if not check
            take a move input
                if move is valid - i.e., must be within valid moves array, must not put your king in check
        
        check for opponent check
            if check, check for checkmate
*/


/*
look at the currentMove's king -
    run a check for all opposite color pieces, pulling in their valid moves. Combine these into one array
    if one of the moves hits the king, king can move, or a piece can block

    if two options hit the king's current square, can only move the king

    after current move player has made a move, check again
        if still under attack, move is invalid



    is it better to pull all moves as one array, or to pull an array contain each piece on side and then checking their valid moves one by one as we sequence through the array of objs?

*/





    checkForCheckmate(attackSide, defSide) {
        let check = this.checkForCheck(attackSide, defSide);
        let defKing = gameState.board.findPieceByName('king', defSide);
        let kingMoves = defKing.valid_moves();
        let kingPos = defKing.position;

        let attackingMoves = gameState.generateAllMovesByColor(attackSide).flat();
        let defMoves = gameState.generateAllMovesByColor(defSide).flat();

        console.log(kingPos)
        console.log(attackingMoves);
        console.log(defMoves)

        if (check === 2) {
            kingMoves.filter(move => {
                attackingMoves.forEach(attackingMove => {
                    return (!this.moveComparator(move, attackingMove))
                })
            })
            if (kingMoves.length === 0) {
            return 'checkmate'
            } else {
                kingMoves.forEach(move => {
                    if (this.checkForCheck(move, attackSide, defSide) === 1 || this.checkForCheck(move, attackSide, defSide) === 2) {
                        return 'checkmate'
                    }
                })
            }
        } else {



        }

        // let attackingMoves = gameState.generateAllMovesByColor(this.currentState[1].color);
        // let king = gameState.board.findPieceByName('king', this.currentMove[0]);
        // let kingMoves = king.valid_moves();
        // console.log(kingMoves);
        

        // kingMoves.filter(move => {
        //     attackingMoves.forEach(attackingMove => {
        //         return (!this.moveComparator(move, attackingMove))
        //     })
        // })
        // if (kingMoves.length === 0) {
        //     return 'checkmate'
        // }

    }
/*
look at currentMove's king
    if king is in check and all valid moves are covered by enemy moves AND no pieces can block the check, return checkmate
*/
    /**
     * 
     * @param {string} color - 'white' or 'black'
     * @returns {array} array of arrays with all possible moves for the color selected
     * 
     */


     // add origin here
    generateAllMovesByColor(color) {
        let allMoves = [];

        gameState.board.playArea.forEach(row => row.forEach(col => {
            if (col.getPiece() !== null && col.getPiece().getColor() === color && ['queen', 'bishop', 'rook'].includes(col.getPiece().getName())) {
                allMoves.push(col.getPiece().valid_moves().moves.flat())
            } else if (col.getPiece() !== null && col.getPiece().getColor()) {
                allMoves.push(col.getPiece().valid_moves().moves)
            }
        }))
        return allMoves;
    }


    // generateAllMoveOriginObjs(color) {
    //     let moveOrigin = [];
    //         gameState.board.playArea.forEach(row => row.forEach(col => {
    //             if (col.getPiece() !== null && col.getPiece().getColor()) {
    //                 moveOrigin.push(col.getPiece().valid_moves())
    //             }
    // }





    moveComparator (possibleDest, desiredDest) {return (possibleDest[0] === desiredDest[0] && possibleDest[1] === desiredDest[1]);}
}






gameState = new GameState();
gameState.board.createBoard();
gameState.board.assignNotation();
gameState.board.assignColor();
gameState.board.populatePieces();
console.log(gameState.board.playArea);

console.log(gameState.checkForCheck([0, 4], 'white'));




// console.log(gameState.board.getSquare(1, 1).getPiece().valid_moves());
//console.log(gameState.generateAllMovesByColor('black'));



// console.log(gameState.checkForCheckmate('black', 'white'));


// console.log(gameState.board.playArea);
// console.log(gameState.checkForCheckmate())

//console.log(board.playArea[0][0].getPiece().valid_moves());  

// const white_rook = new Rook('white', [3, 3]);

// const white_bishop = new Bishop('white', [2, 3]);

// const white_queen = new Queen('white', [0, 0]);



// console.log(white_bishop.valid_moves());
// console.log(white_queen.valid_moves());


// gameState.move(gameState.board.playArea[1][3].getPiece(), [2, 3]);
// gameState.move(gameState.board.playArea[6][3].getPiece(), [4, 3]);

//  getSquareByCoord(rank, file) {return this.board.getSquare(rank, file);}

