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
            { player: 'white', pieceTotal: 0, checkmate: false, stalemate: false },
            { player: 'black', pieceTotal: 0, checkmate: false, stalemate: false }
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

    calculatePieceTotal(color) {
        let newPieceTotal = 0;

        this.board.playArea.forEach(row => row.forEach(col => {
            if (col.getPiece() !== null) {
                if (col.getPiece().getColor() === color) {
                    newPieceTotal += col.getPiece().getValue()
                }
            }
        })) 
        this.currentState =this.currentState.map(val => {
            if (val.player === color) {
                val.pieceTotal = newPieceTotal;
                return val;
            } else {
                return val;
            }
        })
    }




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

    posComparator(firstPos, secondPos) { return (firstPos[0] === secondPos[0] && firstPos[1] === secondPos[1]); }





    /**
     * 
     * @param {array} kingPos - array indicating the king's position on the board 
     * @param {string} attackColor - 'white' or 'black'
     */

    checkForCheck(kingPos, attackColor) {
        let attackingMoves = this.generateAllMovesByColor(attackColor);

        attackingMoves = attackingMoves.filter(move => this.posComparator(move, kingPos));

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
        return allMoves;
    }


    move(piecePos, move) {
        let legalMoves = this.generateAllLegalMoves(this.currentState[0].player);
        let pieceObj = legalMoves.find(piece => this.posComparator(piecePos, piece.position));

        if (pieceObj.piece.color !== this.currentState[0].player) {
            return 'invalid move, please try again';
        }

        pieceObj.moves.forEach(possDest => {
            if (this.posComparator(possDest, move)) {
                if (this.board.getSquare(move[0], move[1]).getPiece() !== null) {

                    this.currentState[1].pieceTotal -= this.board.getSquare(move[0], move[1]).getPiece().value;
                    this.board.getSquare(move[0], move[1]).removePiece();
                    this.board.getSquare(move[0], move[1]).setPiece(pieceObj.piece);
                    this.board.getSquare(piecePos[0], piecePos[1]).removePiece()
                    this.currentState.reverse();
                    return 'successful move'
                } else {
                    this.board.getSquare(move[0], move[1]).setPiece(pieceObj.piece);
                    this.board.getSquare(piecePos[0], piecePos[1]).removePiece()
                    this.currentState.reverse();
                    return 'successful move'
                }
            }
        })
    }


    turn(piece, move) {
        let currPlayer = this.currentState[0].player;
        let king = this.board.findKing(currPlayer);
        let check = this.checkForCheck(king.position, this.currentState[1].player)
        let legalMoves = this.generateAllLegalMoves(currPlayer)
        let legalMovesCount = 0;

        legalMoves.forEach(piece => {
            legalMovesCount+=piece.moves.length;
        })


        if (legalMovesCount === 0) {
            if (check === 1 || check === 2) {
                this.currentState[0].checkmate = true;
                return `${currPlayer} player is in checkmate`
            } else {
                this.currentState[0].stalemate = true;
                return `${currPlayer} player is in stalemate`
            }
        }
        this.move(piece, move);
    }
}



let gameState = new GameState();
gameState.board.createBoard();
gameState.board.assignNotation();
gameState.board.assignColor();
gameState.generateStartPosition();



//console.log(gameState.board.playArea);

console.log(gameState.turn([0, 4], [1, 4]))
//gameState.turn([6, 2], [4, 4])

console.log(gameState.board.playArea);

gameState.calculatePieceTotal('white')
console.log(gameState.currentState[0].pieceTotal)