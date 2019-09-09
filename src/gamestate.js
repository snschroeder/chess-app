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
            if (col.getPiece() !== null && col.getPiece().getName() !== 'king') {
                if (col.getPiece().getColor() === color) {
                    newPieceTotal += col.getPiece().getValue();
                }
            }
        }))
        this.currentState = this.currentState.map(val => {
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
                col.getPiece().valid_moves();
                allMoves.push(col.getPiece());
            }
        }));
        return allMoves;
    }

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

        this.board.getSquare(move[0], move[1]).setPiece(piece);
        this.board.getSquare(piecePos[0], piecePos[1]).removePiece();

        check = this.checkForCheck(kingPos, attackColor);

        this.board.getSquare(piecePos[0], piecePos[1]).setPiece(piece);
        this.board.getSquare(move[0], move[1]).setPiece(pieceHolder);

        if (check === 1 || check === 2) {
            return true;
        } else {
            return false;
        }
    }

    checkForCastle(king, rooks, color, enemyColor) {
        let enemyMoves = [];

        if (gameState.checkForCheck(king.position, enemyColor) === 0) {
            if (king.getHasNotMoved()) {

                if (rooks[0].getHasNotMoved()) {
                    enemyMoves = this.generateAllMovesByColor(enemyColor);
                    enemyMoves = enemyMoves.filter(move => {
                        if (color === 'white') {
                            return this.posComparator(move, [0, 2]) || this.posComparator(move, [0, 3])
                        } else {
                            return this.posComparator(move, [7, 2]) || this.posComparator(move, [7, 3])
                        }
                    })
                    if (enemyMoves.length === 0
                        && this.board.getPieceBySquare([0, 1]) === null
                        && this.board.getPieceBySquare([0, 2]) === null
                        && this.board.getPieceBySquare([0, 3]) === null) {

                        color === 'white' ? king.moves.push([0, 2]) : king.moves.push([7, 2])
                    }
                }
                if (rooks[1].getHasNotMoved()) {
                    enemyMoves = this.generateAllMovesByColor(enemyColor);
                    enemyMoves = enemyMoves.filter(move => {
                        if (color === 'white') {
                            return this.posComparator(move, [0, 5]) || this.posComparator(move, [0, 6])
                        } else {
                            return this.posComparator(move, [7, 5]) || this.posComparator(move, [7, 6])
                        }
                    })
                    if (enemyMoves.length === 0
                        && this.board.getPieceBySquare([0, 6]) === null
                        && this.board.getPieceBySquare([0, 5]) === null) {

                        color === 'white' ? king.moves.push([0, 6]) : king.moves.push([7, 6])
                    }
                }
            }
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
        let rooks = allMoves.filter(piece => piece.name === 'rook');

        this.checkForCastle(king, rooks, color, enemyColor)

        allMoves.forEach(piece => piece.moves = piece.moves.filter(move => {
            return !this.moveResultsInCheck(piece, move, king.position, enemyColor)
        }));
        return allMoves;
    }

    handleCastle(king, move) {
        let rook;

        if (king.color === 'white' && move[1] === 2) {
            rook = this.board.getSquare(0, 0).getPiece();
            this.board.getSquare(move[0], move[1]).setPiece(king)
            this.board.getSquare(0, 3).setPiece(rook);
            this.board.getSquare(0, 0).removePiece();
            this.board.getSquare(0, 4).removePiece();

        } else if (king.piece.color === 'white' && move[1] === 6) {
            rook = this.board.getSquare(0, 7).getPiece();
            this.board.getSquare(move[0], move[1]).setPiece(king)
            this.board.getSquare(0, 5).setPiece(rook);
            this.board.getSquare(0, 7).removePiece();
            this.board.getSquare(0, 4).removePiece();

        } else if (king.piece.color === 'black' && move[1] === 2) {
            rook = this.board.getSquare(7, 0).getPiece();
            this.board.getSquare(move[0], move[1]).setPiece(king)
            this.board.getSquare(7, 3).setPiece(rook);
            this.board.getSquare(7, 0).removePiece();
            this.board.getSquare(7, 4).removePiece();

        } else if (king.piece.color === 'black' && move[1] === 6) {
            rook = this.board.getSquare(0, 7).getPiece();
            this.board.getSquare(move[0], move[1]).setPiece(king)
            this.board.getSquare(0, 5).setPiece(rook);
            this.board.getSquare(0, 7).removePiece();
            this.board.getSquare(7, 4).removePiece();
        }
    }

    move(piecePos, move) {
        let legalMoves = this.generateAllLegalMoves(this.currentState[0].player);
        let pieceObj = legalMoves.find(piece => this.posComparator(piecePos, piece.position));

        if (pieceObj.color !== this.currentState[0].player) {
            return 'invalid move, please try again';
        }

        if (pieceObj.name === 'king' && Math.abs(piecePos[1] - move[1]) === 2) {
            this.handleCastle(pieceObj, move)
        } else {

            pieceObj.moves.forEach(possDest => {
                if (this.posComparator(possDest, move)) {
                    if (this.board.getSquare(move[0], move[1]).getPiece() !== null) {

                        this.currentState[1].pieceTotal -= this.board.getSquare(move[0], move[1]).getPiece().value;
                        this.board.getSquare(move[0], move[1]).removePiece(); //try removing later
                        this.board.getSquare(move[0], move[1]).setPiece(pieceObj);
                        this.board.getSquare(piecePos[0], piecePos[1]).removePiece();
                        this.currentState.reverse();

                        if (pieceObj.name === 'king'
                            || pieceObj.name === 'rook'
                            || pieceObj.name === 'pawn') {
                                pieceObj.hasMoved();
                        }
                        return 'successful move'
                    } else {
                        this.board.getSquare(move[0], move[1]).setPiece(pieceObj);
                        this.board.getSquare(piecePos[0], piecePos[1]).removePiece();
                        this.currentState.reverse();

                        if (pieceObj.name === 'king'
                        || pieceObj.name === 'rook'
                        || pieceObj.name === 'pawn') {
                            pieceObj.hasMoved();
                    }
                        return 'successful move'
                    }
                }
            })
        }
    }

    turn(piece, move) {
        let currPlayer = this.currentState[0].player;
        let opponent = this.currentState[1].player;

        let king = this.board.findKing(currPlayer);
        let check = this.checkForCheck(king.position, opponent)
        let legalMoves = this.generateAllLegalMoves(currPlayer)
        let legalMovesCount = 0;

        legalMoves.forEach(piece => {
            legalMovesCount += piece.moves.length;
        })


        if (legalMovesCount === 0) {
            if (check > 0) {
                this.currentState[0].checkmate = true;
                return `${currPlayer} player is in checkmate`
            } else {
                this.currentState[0].stalemate = true;
                return `${currPlayer} player is in stalemate`
            }
        }
        this.move(piece, move);
        this.calculatePieceTotal(currPlayer);
        this.calculatePieceTotal(opponent);
    }

    posComparator(firstPos, secondPos) { return (firstPos[0] === secondPos[0] && firstPos[1] === secondPos[1]); }
}



let gameState = new GameState();
gameState.board.createBoard();
gameState.board.assignNotation();
gameState.board.assignColor();
gameState.generateStartPosition();



gameState.turn([1, 4], [3, 4])
gameState.turn([6, 2], [4, 2])

console.log(gameState.board.playArea);