import Board from './board';
import Rook from './rook';
import Knight from './knight';
import Bishop from './bishop';
import Queen from './queen';
import King from './king';
import Pawn from './pawn';

export default class GameState {
    constructor() {
        this.board = new Board()
        this.moveList = [];
        this.currentMove = ['white', 'black'];
        this.currentState = [
            { player: 'white', pieceTotal: 0 },
            { player: 'black', pieceTotal: 0 }
        ]
    }

    generateStartPosition() {
        let pieces = [];

        pieces.push(new Rook('white', [0, 0], this.board));
        pieces.push(new Rook('white', [0, 7], this.board));
        pieces.push(new Knight('white', [0, 1], this.board));
        pieces.push(new Knight('white', [0, 6], this.board));
        pieces.push(new Bishop('white', [0, 2], this.board));
        pieces.push(new Bishop('white', [0, 5], this.board));
        pieces.push(new Queen('white', [0, 3], this.board));
        pieces.push(new King('white', [0, 4], this.board));
        for (let i = 0; i < this.board.getDims(); i++) {
            pieces.push(new Pawn('white', [1, i], this.board));
        }
        pieces.push(new Rook('black', [7, 0], this.board));
        pieces.push(new Rook('black', [7, 7], this.board));
        pieces.push(new Knight('black', [7, 1], this.board));
        pieces.push(new Knight('black', [7, 6], this.board));
        pieces.push(new Bishop('black', [7, 2], this.board));
        pieces.push(new Bishop('black', [7, 5], this.board));
        pieces.push(new Queen('black', [7, 3], this.board));
        pieces.push(new King('black', [7, 4], this.board));
        for (let i = 0; i < this.board.getDims(); i++) {
            pieces.push(new Pawn('black', [6, i], this.board));
        }
        pieces.forEach(piece => {
            this.board.playArea[piece.position[0]][piece.position[1]].setPiece(piece);
        });
    }

    // move(piece, dest) {
    //     let piecePos = piece.getPosition();
    //     if (piece.getColor() !== this.currentMove[0]) {
    //         return 'invalid move, please try again';

    //     }
    //     piece.valid_moves().forEach(possDest => {
    //         if (this.moveComparator(possDest, dest)) {
    //             if (this.board.getSquare(dest[0], dest[1]).getPiece() !== null) {
    //                 this.board.getSquare(dest[0], dest[1]).removePiece();
    //                 this.board.getSquare(dest[0], dest[1]).setPiece(piece);
    //                 this.board.getSquare(piecePos[0], piecePos[1]).removePiece()
    //                 this.currentMove.reverse();
    //                 return 'successful move'
    //             } else {
    //                 this.board.getSquare(dest[0], dest[1]).setPiece(piece);
    //                 this.board.getSquare(piecePos[0], piecePos[1]).removePiece()
    //                 this.currentMove.reverse();
    //                 return 'successful move'
    //             }
    //         }
    //     })
    // }




    /**
     * 
     * @param {string} color - 'white' or 'black'
     * @returns {array} array of arrays with all possible moves for the color selected
     * 
     */

    generateAllMovesByColor(color) {
        let allMoves = [];
        this.board.playArea.forEach(row => row.forEach(col => {
            const p = col.getPiece();
            if (p !== null && p.getColor() === color) {
                allMoves.push(p.valid_moves());
            }
        }));
        return allMoves.flat();
    }

    /**
     * 
     * @param {string} color -'white' or 'black'
     * @returns {array} - returns an arrray of objects containing info for all pieces and their moves of the selected color
     */

    generateAllMoveInfo(color) {
        let allMoves = [];

        this.board.playArea.forEach(row => row.forEach(col => {
            if (col.getPiece() !== null && col.getPiece().getColor() === color) {
                allMoves.push({ piece: col.getPiece(), name: col.getPiece().name, position: col.getPiece().position, moves: col.getPiece().valid_moves() });
            }
        }));
        return allMoves;
    }

    moveComparator(firstPos, secondPos) { return (firstPos[0] === secondPos[0] && firstPos[1] === secondPos[1]); }





    /**
     * 
     * @param {array} kingPos - array indicating the king's position on the board 
     * @param {string} attackColor - 'white' or 'black'
     */

    checkForCheck(kingPos, attackColor) {
        let attackingMoves = this.generateAllMovesByColor(attackColor);

        attackingMoves = attackingMoves.filter(move => this.moveComparator(move, kingPos));

        if (attackingMoves.length === 1) {
            return 1;
        } else if (attackingMoves.length === 2) {
            return 2;
        } else {
            return 0;
        }
    }


    /**
     * 
     * @param {object} piece - the piece object that will be making the move
     * @param {array} move -array indicating the move to be made - given as [3, 4] or [7, 7] or what have you
     * @param {array} kingPos - array indicating the king's position on the board given as [0, 4], [2, 2], etc.
     * @param {string} attackColor -'white' or 'black'
     * @returns {boolean} - returns true if the move puts the moving piece's king in check, false otherwise
     */


    moveResultsInCheck(piece, move, kingPos, attackColor) {
        let piecePos = piece.position;
        let check;
        let pieceHolder;

        kingPos = piece.name === 'king' ? move : kingPos;
        pieceHolder = this.board.getSquare(move[0], move[1]).getPiece();

        this.board.getSquare(move[0], move[1]).setPiece(piece.piece);
        this.board.getSquare(piecePos[0], piecePos[1]).removePiece();

        check = this.checkForCheck(kingPos, attackColor);

        this.board.getSquare(piecePos[0], piecePos[1]).setPiece(piece.piece);
        this.board.getSquare(move[0], move[1]).setPiece(pieceHolder);

        if (check === 1 || check === 2) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 
     * @param {string} color -'white' or 'black'
     * @returns {array} - returns an array of objects containing each piece and their legal moves
     */

    generateAllLegalMoves(color) {
        let enemyColor = (color === 'white' ? 'black' : 'white');
        let allMoves = this.generateAllMoveInfo(color);

        let king = allMoves.find(piece => piece.name === 'king');

        allMoves.forEach(piece => piece.moves = piece.moves.filter(move => {
            return !this.moveResultsInCheck(piece, move, king.position, enemyColor)
        }));

        console.log(allMoves)
        return allMoves;
    }
}



let gameState = new GameState();
gameState.board.createBoard();
gameState.board.assignNotation();
gameState.board.assignColor();
gameState.generateStartPosition();



//console.log(gameState.board.playArea);

gameState.generateAllLegalMoves('black');