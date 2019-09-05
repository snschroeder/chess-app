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

        // pieces.push(new Rook('white', [0, 0], this.board));
        // pieces.push(new Rook('white', [0, 7], this.board));
        // pieces.push(new Knight('white', [0, 1], this.board));
        // pieces.push(new Knight('white', [0, 6], this.board));
        // pieces.push(new Bishop('white', [0, 2], this.board));
        // pieces.push(new Bishop('white', [0, 5], this.board));
        // pieces.push(new Queen('white', [0, 3], this.board));
        pieces.push(new King('white', [0, 4], this.board));
        // for (let i = 0; i < this.board.getDims(); i++) {
        //     pieces.push(new Pawn('white', [1, i], this.board));
        // }
        // pieces.push(new Rook('black', [2, 0], this.board));
        // pieces.push(new Rook('black', [7, 7], this.board));
        // pieces.push(new Knight('black', [7, 1], this.board));
        // pieces.push(new Knight('black', [7, 6], this.board));
        // pieces.push(new Bishop('black', [7, 2], this.board));
        // pieces.push(new Bishop('black', [7, 5], this.board));
        pieces.push(new Queen('black', [3, 3], this.board));
        // pieces.push(new King('black', [7, 4], this.board));
        // for (let i = 0; i < this.board.getDims(); i++) {
        //     pieces.push(new Pawn('black', [6, i], this.board));
        // }
        pieces.forEach(piece => {
            this.board.playArea[piece.position[0]][piece.position[1]].setPiece(piece);
        });
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
        let attackingMoves = this.generateAllMovesByColor(attackSide);

        attackingMoves = attackingMoves.filter(move => this.moveComparator(move, kingPos))

        if (attackingMoves.length === 1) {
            return 1;
        } else if (attackingMoves.length === 2) {
            return 2;
        } else {
            return 0;
        }
    }

    checkForCheckmate(attackSide, defSide) {
        let defKing = this.board.findPieceByName('king', defSide);
        let kingPos = defKing.position;

        let attackInfo = this.generateAllAttackerInfo(attackSide);

        let defMoves = this.generateAllMovesByColor(defSide);
        let blockMoves = this.generateAllMovesByColor(defSide);

        console.log(defMoves)

        let attackers = [];

        for (let i = 0; i < attackInfo.length; i++) {
            for (let j = 0; j < attackInfo[i].moves.length; j++) {
                if (this.moveComparator(attackInfo[i].moves[j], kingPos)) {
                    attackers.push(attackInfo[i])
                }
            }
        }
        console.log(attackers);

        if (attackers.length === 2) {
            console.log('inside double check')
            console.log(this.checkForMoves(attackers, defKing))
            return this.checkForMoves(attackers, defKing);
        } else {
            if (attackers[0].name === 'knight' || attackers[0].name === 'pawn') {
                console.log(this.checkForCapture(attackers[0].origin, defMoves && this.checkForMoves(attackers, defKing)))
                return this.checkForCapture(attackers[0].origin, defMoves && this.checkForMoves(attackers, defKing))

            } else {
                console.log('inside rook or queen or bishop')
                let blocks = this.generateBlockingSquares(attackers[0], kingPos);
                blockMoves = blockMoves.filter(move => {
                    blocks.forEach(block => {
                        return this.moveComparator(move, block)
                    })
                })
                console.log(defMoves);
                return !this.checkForCapture(attackers[0].origin, defMoves) && !this.checkForMoves(attackers, defKing) && blockMoves.length === 0
            }
        }
    }

    /**
     * 
     * @param {Array} attackerPos - coord position of the attacker [1, 1], etc.
     * @param {Nested Array} defMoves - nest array of possible defensive moves [1, 1], [3, 5] etc.
     * @returns {boolean} - false if there are no moves that capture the attacking piece, true otherwise
     */

    checkForCapture(attackerPos, defMoves) {
        defMoves = defMoves.filter(move => this.moveComparator(move, attackerPos));
        return defMoves.length === 0 ? false : true;
    }

    /**
     * 
     * @param {object} attacker -object containing attacker name, origin, valid moves
     * @param {array} kingPos - array coords of king's position in the form of [1, 1], etc.
     * @returns {array} - returns array of all eligible blocking moves that the defending side can make
     */
    generateBlockingSquares(attacker, kingPos) {
        let blocks = [];

        let direction = [Math.sign(kingPos[0] - attacker.origin[0]), Math.sign(kingPos[1] - attacker.origin[1])];
        let dist = Math.max(Math.abs(attacker.origin[0] - kingPos[0]), Math.abs(attacker.origin[1] - kingPos[1]))

        for (let i = 1; i < dist; i++) {
            blocks.push([attacker.origin[0] + (i * direction[0]), attacker.origin[1] + (i * direction[1])]);
        }
        return blocks;
    }

    checkForMoves(attackers, king) {
        let attackingMoves = this.generateAllMovesByColor(attackers[0].color);
        let kingMoves = king.valid_moves();
        let kingPos = king.position;
        let direction = [];

        kingMoves = kingMoves.filter(move => {
            attackingMoves.forEach(attackingMove => {
                return (!this.moveComparator(move, attackingMove))
            })
        })

        if (kingMoves.length === 0) {
            return false;
        }
        direction.push(attackers.forEach(attacker => [Math.sign(kingPos[0] - attacker.origin[0]), Math.sign(kingPos[1] - attacker.origin[1])]));

        direction = direction.map(dir => [kingPos[0] + dir[0], kingPos[1] + dir[1]]);

        kingMoves = kingMoves.filter(move => {
            direction.forEach(dir => {
                return (!this.moveComparator(move, dir))
            })
        })
        
        if (kingMoves.length === 0) {
            return false;
        } else {
            return true;
        }

    }

    moveResultsInCheck(piece, move, kingPos, attackColor) {
        let piecePos = piece.position;
        
        this.board.getSquare(move[0], move[1]).setPiece(piece);
        this.board.getSquare(piecePos[0], piecePos[1]).removePiece();

        let check = this.checkForCheck(kingPos, attackColor);

        this.board.getSquare(piecePos[0], piecePos[1]).setPiece(piece);
        this.board.getSquare(move[0], move[1]).removePiece();

        if (check === 1 || check === 2) {
            return true;
        } else {
            return false;
        }
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
        if (col.getPiece() !== null && col.getPiece().getColor() === color) {
            allMoves.push(col.getPiece().valid_moves());
        }
    }));
    return allMoves.flat();
}

generateAllAttackerInfo(color) {
    let allMoves = [];

    this.board.playArea.forEach(row => row.forEach(col => {
        if (col.getPiece() !== null && col.getPiece().getColor() === color) {
            allMoves.push({ name: col.getPiece().name, origin: col.getPiece().position, moves: col.getPiece().valid_moves() });
        }
    }));
    return allMoves;
}

moveComparator(firstPos, secondPos) { return (firstPos[0] === secondPos[0] && firstPos[1] === secondPos[1]); }
}






let gameState = new GameState();
gameState.board.createBoard();
gameState.board.assignNotation();
gameState.board.assignColor();
gameState.generateStartPosition();



console.log(gameState.board.playArea);




if (gameState.checkForCheck([0, 4], 'black') === 1 || gameState.checkForCheck([0, 4], 'black') === 2) {
    console.log(gameState.checkForCheckmate('black', 'white'));
}