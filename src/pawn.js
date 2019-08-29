import Piece from './piece';

export default class Pawn extends Piece {
    constructor(color, position) {
        super(color, position, 'pawn', 1);
            this.hasNotMoved = true;
    }
    _generate_move_sequences() {

        let file = this.position[0], rank = this.position[1];

        const white_moves = {
            forward: [file + 1, rank],
            twoSquares: [file + 2, rank],
            capRight: [file + 1, rank + 1],
            capLeft: [file + 1, rank - 1],
        }

        const black_moves = {
            forward: [file - 1, rank],
            twoSquares: [file - 2, rank],
            capRight: [file - 1, rank + 1],
            capLeft: [file - 1, rank - 1],
        }

        if (this.color === 'white') {
            return white_moves;
        } else {
            return black_moves;
        }
    }

    valid_moves() {
        let generatedMoves = this._generate_move_sequences();

        //if moving forward one space would put the pawn off the board in either direction, delete both 
        if (generatedMoves.forward[0] > gameState.board.getDims() - 1 || generatedMoves.forward[0] < 0) {
            delete generatedMoves.forward;
            delete generatedMoves.twoSquares;
        }
        //if forward one space hits a same color piece, delete both forward options
        if (gameState.board.getSquare(generatedMoves.forward[0], generatedMoves.forward[1]).getPiece() !== null && gameState.board.getSquare(generatedMoves.forward[0], generatedMoves.forward[1]).getPiece().getColor() === this.color) {
            delete generatedMoves.forward;
            delete generatedMoves.twoSquares;
        }
        //if forward one space is okay, we need to verify forward 2 spaces is also okay. If not, we delete forward two
        if (generatedMoves.twoSquares !== undefined) {
            if (gameState.board.getSquare(generatedMoves.twoSquares[0], generatedMoves.twoSquares[1]).getPiece() !== null && gameState.board.getSquare(generatedMoves.twoSquares[0], generatedMoves.twoSquares[1]).getPiece().getColor() === this.color) {
                delete generatedMoves.twoSquares;
            }
        }
        //check if capturing right is still on the board. If not, remove capRight
        if (generatedMoves.capRight[0]> gameState.board.getDims() - 1 || generatedMoves.capRight[0] < 0 || generatedMoves.capRight[1]> gameState.board.getDims() - 1 || generatedMoves.capRight[1] < 0) {
            delete generatedMoves.capRight;
        }
        //check if capturing left would is still on the board. If not, remove capLeft
        if (generatedMoves.capLeft[0]> gameState.board.getDims() - 1 || generatedMoves.capLeft[0] < 0 || generatedMoves.capLeft[1]> gameState.board.getDims() - 1 || generatedMoves.capLeft[1] < 0) {
            delete generatedMoves.capLeft;
        }
        if (generatedMoves.capRight !== undefined) {
        //check that an enemy piece is present to capture right. If not, remove capRight
            if (gameState.board.getSquare(generatedMoves.capRight[0], generatedMoves.capRight[1]).getPiece() === null || gameState.board.getSquare(generatedMoves.capRight[0], generatedMoves.capRight[1]).getPiece().getColor() === this.color) {
                delete generatedMoves.capRight;
            }
        }
        if (generatedMoves.capLeft !== undefined) {
            //check that an enemy piece is present to capture left. If not, remove capLeft
            if (gameState.board.getSquare(generatedMoves.capLeft[0], generatedMoves.capLeft[1]).getPiece() === null || gameState.board.getSquare(generatedMoves.capLeft[0], generatedMoves.capLeft[1]).getPiece().getColor() === this.color) {
                delete generatedMoves.capLeft;
            }
        }

        return Object.values(generatedMoves);
        }

    getHasNotMoved() {return this.hasNotMoved;}
}