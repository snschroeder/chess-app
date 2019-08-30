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
        pieces.push(new Rook('black', [1, 0], this.board));
        pieces.push(new Rook('black', [7, 7], this.board));
        pieces.push(new Knight('black', [7, 1], this.board));
        pieces.push(new Knight('black', [7, 6], this.board));
        pieces.push(new Bishop('black', [7, 2], this.board));
        pieces.push(new Bishop('black', [7, 5], this.board));
        pieces.push(new Queen('black', [0, 0], this.board));
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
        let attackMoves = this.generateAllMovesByColor(attackSide);
        let defMoves = this.generateAllMovesByColor(defSide);

        // attackInfo.filter(piece => piece.moves.some(move => this.moveComparator(move, kingPos)));
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
            return this.checkForMove(attackMoves, kingPos);
        } else {
            if (attackers[0].name === 'knight' || attackers[0].name === 'pawn') {
                return this.checkForCapture(attackers[0].origin, defMoves && this.checkForMoves(attackMoves, kingPos))

            } else {
                let blocks = this.generateBlockingSquares(attackers[0], kingPos);
                defMoves.filter(move => {
                    blocks.forEach(block => {
                        return this.moveComparator(move, block)
                    })
                })
                return this.checkForCapture(attackers[0].origin, defMoves) && this.checkForMoves(attackers[0], kingPos) && defMoves.length === 0
            }
        }
    }

    checkForCapture(attackerPos, defMoves) {
        defMoves = defMoves.filter(move => !this.moveComparator(move, attackerPos));
        return defMoves.length === 0 ? true : false;
    }

    generateBlockingSquares(attacker, kingPos) {
        let direction;
        let blocks = [];

        if (attacker.origin[0] === kingPos[0]) {
            direction = Math.sign(attacker.origin[1] - kingPos[1]);
            for (let i = 1; i < Math.abs(attacker.origin[1] - kingPos[1]); i++) {
                blocks.push([attacker.origin[0], i * direction]);
            }

        } else if (attacker.origin[1] === kingPos[1]) {
            direction = Math.sign(attacker.origin[0] - kingPos[0]);
            for (let i = 1; i < Math.abs(attacker.origin[0] - kingPos[0]); i++) {
                blocks.push([i * direction, attacker.origin[1]]);
            }

        } else {
            if (attacker.origin[0] > kingPos[0] && attacker.origin[1] > kingPos[1]) {
                direction = [Math.sign(kingPos[0] - attacker.origin[0]), Math.sign(kingPos[1] - attacker.origin[1])];
            } else {
                direction = [Math.sign(attacker.origin[0] - kingPos[0]), Math.sign(attacker.origin[1] - kingPos[1])];
            }
            for (let i = 1; i < Math.abs(attacker.origin[0] - kingPos[0]); i++) {
                blocks.push([attacker.origin[0] + (i * direction[1]), attacker.origin[1] + (i * direction[0])]);
            }
        }

        return blocks.map(pair => pair.map(val => val = Math.abs(val)));
    }

    checkForMove(attackers, king) {

        let attackingMoves = this.generateAllMovesByColor(attackers[0].color);
        let kingMoves = king.valid_moves();

        let direction;

        kingMoves = kingMoves.filter(move => {
            attackingMoves.forEach(attackingMove => {
                return (!this.moveComparator(move, attackingMove))
            })
        })
        if (kingMoves.length === 0) {
            return false;
        }

        if (attacker.origin[0] === kingPos[0]) {
            direction = Math.sign(attacker.origin[1] - kingPos[1]);
            kingMoves.filter(move => !(this.moveComparator(move, [attacker.origin[0], kingPos[1] + direction])))

        } else if (attacker.origin[1] === kingPos[1]) {
            direction = Math.sign(attacker.origin[0] - kingPos[0]);
            kingMoves.filter(move => !(this.moveComparator(move, [kingPos[0] + direction, attacker.orgin[1]])))

        } else {
            if (attacker.origin[0] > kingPos[0] && attacker.origin[1] > kingPos[1]) {
                direction = [Math.sign(kingPos[0] - attacker.origin[0]), Math.sign(kingPos[1] - attacker.origin[1])];
            } else {
                direction = [Math.sign(attacker.origin[0] - kingPos[0]), Math.sign(attacker.origin[1] - kingPos[1])];
            }
            kingMoves.filter(move => !(this.moveComparator(move, [kingPos[0] + direction, kingPos[1] + direction])))
        }
        return kingMoves.length === 0 ? false : true;



        //determine traj, if escape is same direction, not valid



        // kingMoves.filter(move => {
        //     attackingMoves.forEach(attackingMove => {
        //         return (!this.moveComparator(move, attackingMove))
        //     })
        // })
        // if (kingMoves.length === 0) {
        //     return false;
        // } else {
        //     kingMoves.forEach(move => {
        //         king.position = move;
        //         attackingMoves = 
        //         if (this.checkForCheck(move, attackSide) === 1 || this.checkForCheck(move, attackSide) === 2) {
        //             return false;
        //         }
        //     })
        // }
        // return true;
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

    moveComparator(possibleDest, desiredDest) { return (possibleDest[0] === desiredDest[0] && possibleDest[1] === desiredDest[1]); }
}






let gameState = new GameState();
gameState.board.createBoard();
gameState.board.assignNotation();
gameState.board.assignColor();
gameState.generateStartPosition();



console.log(gameState.board.playArea);


// console.log(gameState.board.playArea[7][3].getPiece().name); 

// console.log(gameState.checkForCheck([0, 4], 'black'));




// // console.log(gameState.board.getSquare(1, 1).getPiece().valid_moves());
// console.log(gameState.generateAllMovesByColor('black'));



console.log(gameState.checkForCheckmate('black', 'white'));


// console.log(gameState.board.playArea);
// console.log(gameState.checkForCheckmate())



// const white_rook = new Rook('white', [3, 3]);

// const white_bishop = new Bishop('white', [2, 3]);

// const white_queen = new Queen('white', [0, 0]);



// console.log(white_bishop.valid_moves());
// console.log(white_queen.valid_moves());


// gameState.move(gameState.board.playArea[1][3].getPiece(), [2, 3]);
// gameState.move(gameState.board.playArea[6][3].getPiece(), [4, 3]);

//  getSquareByCoord(rank, file) {return this.board.getSquare(rank, file);}




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


            // generateAllMoveOriginObjs(color) {
    //     let moveOrigin = [];
    //         gameState.board.playArea.forEach(row => row.forEach(col => {
    //             if (col.getPiece() !== null && col.getPiece().getColor()) {
    //                 moveOrigin.push(col.getPiece().valid_moves())
    //             }
    // }
