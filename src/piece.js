import GameState from './gamestate';

export default class Piece {
    constructor(color, position, name, value) {
        this.color = color;
        this.position = position;
        this.name = name;
        this.value = value;
        this.board = GameState.board;
    }

    valid_moves() {

        let generatedMoves = this._generate_move_sequences();

        generatedMoves = generatedMoves.map(direction => direction.filter(pos => !(pos[0] < 0 || pos[0] > 7 -1 || pos[1] < 0 || pos[1] > 7 -1)));

        console.log(this.board)

        generatedMoves.forEach((direction) => direction.forEach((pos, index) => {
            if (this.board.getSquare(pos[0], pos[1]).getPiece() !== null && this.board.getSquare(pos[0], pos[1]).getPiece().getColor() === this.color) {
                direction.splice(index);
            } else if (this.board.getSquare(pos[0], pos[1]).getPiece() !== null && this.board.getSquare(pos[0], pos[1]).getPiece().getColor() !== this.color) {
                direction.splice(index + 1);
            }
        }))

        return generatedMoves.filter(move => move.length !== 0);
    }

    _generate_move_sequences() {return [];}
    getColor() {return this.color;}
    getPosition() {return this.position;}
    getName() {return this.name;}
}
















// export class Rook extends Piece {
//     constructor(color, position) {
//         super(color, position, 'rook', 5);
//         this.hasNotMoved = true;
//     }
//     _generate_move_sequences() {
//         let moves = [], rankUp = [], rankDown = [], fileRight = [], fileLeft = [];
//         let file = this.position[0], rank = this.position[1];

//         for (let i = 1; i < gameState.board.getDims(); i++) {
//             fileRight.push([file + i, rank]);
//             fileLeft.push([file - i, rank]);
//             rankUp.push([file, rank + i]);
//             rankDown.push([file, rank - i]);
//         }
//         moves.push(fileRight), moves.push(fileLeft), moves.push(rankUp), moves.push(rankDown);
//         return moves;
//     }
//     getHasNotMoved() {return this.hasNotMoved;}
// }

// export class Bishop extends Piece {
//     constructor(color, position) {
//         super(color, position, 'bishop', 3);
//     }
//     _generate_move_sequences() {
//         const moves = [], upRight = [], upLeft = [], downRight = [], downLeft = [];
//         let file = this.position[0], rank = this.position[1];

//         for (let i = 1; i < gameState.board.getDims(); i++) {
//             upRight.push([file + i, rank + i]);
//             upLeft.push([file + i, rank - i]);
//             downRight.push([file - i, rank + i]);
//             downLeft.push([file -i, rank - i]);
//         }
//         moves.push(upRight), moves.push(upLeft), moves.push(downRight), moves.push(downLeft);
//         return {name: this.name, origin: this.position, moves: moves};
//     }
// }

// export class Knight extends Piece {
//     constructor(color, position) {
//         super(color, position, 'knight', 3);
//     }
//     _generate_move_sequences() {
//         const moves = [];
//         let file = this.position[0], rank = this.position[1];
//         moves.push([file + 2, rank + 1])
//         moves.push([file + 2, rank - 1])
//         moves.push([file + 1, rank + 2])
//         moves.push([file + 1, rank - 2])
//         moves.push([file - 2, rank + 1])
//         moves.push([file - 2, rank -1])
//         moves.push([file - 1, rank + 2])
//         moves.push([file - 1, rank - 2])

//         return {name: this.name, origin: this.position, moves: moves};
//     }

//     valid_moves() {
//         let generatedMoves = this._generate_move_sequences().moves;
//         let origin = this._generate_move_sequences().origin;

//         generatedMoves = generatedMoves.filter(pos => !(pos[0] < 0 || pos[0] > gameState.board.getDims() -1 || pos[1] < 0 || pos[1] > gameState.board.getDims() -1));
//         generatedMoves = generatedMoves.filter(move => gameState.board.getSquare(move[0], move[1]).getPiece() === null || gameState.board.getSquare(move[0], move[1]).getPiece().getColor() !== this.color);
//         return {origin: origin, moves: generatedMoves};
//     }
// }

// export class Queen extends Piece {
//     constructor(color, position) {
//         super(color, position, 'queen', 9);
//     }
//     _generate_move_sequences() {
//         const moves = [], upRight = [], upLeft = [], downRight = [], downLeft = [], rankUp = [],rankDown = [], fileRight = [], fileLeft = [];
//         let file = this.position[0], rank = this.position[1];

//         for (let i = 1; i < gameState.board.getDims(); i++) {
//             upRight.push([file + i, rank + i]);
//             upLeft.push([file + i, rank - i]);
//             downRight.push([file - i, rank + i]);
//             downLeft.push([file -i, rank - i]);
//             rankUp.push([file + i, rank]);
//             rankDown.push([file - i, rank]);
//             fileRight.push([file, rank + i]);
//             fileLeft.push([file, rank - i]);
//         }
//         moves.push(upRight), moves.push(upLeft), moves.push(downRight), moves.push(downLeft);
//         moves.push(rankUp), moves.push(rankDown), moves.push(fileRight), moves.push(fileLeft);
//         return {name: this.name, origin: this.position, moves: moves};
//     }
// }

// export class King extends Piece {
//     constructor(color, position) {
//         super(color, position, 'king', Number.POSITIVE_INFINITY);
//         this.hasNotMoved = true;
//     }
//     _generate_move_sequences() {
//         const moves = [], upRight = [], upLeft = [], downRight = [], downLeft = [], rankUp = [],rankDown = [], fileRight = [], fileLeft = [];
//         let file = this.position[0], rank = this.position[1];

//         upRight.push([file + 1, rank + 1]);
//         upLeft.push([file + 1, rank - 1]);
//         downRight.push([file - 1, rank + 1]);
//         downLeft.push([file -1, rank - 1]);
//         rankUp.push([file + 1, rank]);
//         rankDown.push([file - 1, rank]);
//         fileRight.push([file, rank + 1]);
//         fileLeft.push([file, rank - 1]);

//         moves.push(upRight), moves.push(upLeft), moves.push(downRight), moves.push(downLeft);
//         moves.push(rankUp), moves.push(rankDown), moves.push(fileRight), moves.push(fileLeft);
//         return {name: this.name, origin: this.position, moves: moves};
//     }

//     castle(direction) {

//     }

//     getHasNotMoved() {return this.hasNotMoved;}
// }

// // Pawn validate moves will take a second to update - look at this closer after class

// class Pawn extends Piece {
//     constructor(color, position) {
//         super(color, position, 'pawn', 1);
//             this.hasNotMoved = true;
//     }
//     _generate_move_sequences() {

//         let file = this.position[0], rank = this.position[1];

//         const white_moves = {
//             forward: [file + 1, rank],
//             twoSquares: [file + 2, rank],
//             capRight: [file + 1, rank + 1],
//             capLeft: [file + 1, rank - 1],
//         }

//         const black_moves = {
//             forward: [file - 1, rank],
//             twoSquares: [file - 2, rank],
//             capRight: [file - 1, rank + 1],
//             capLeft: [file - 1, rank - 1],
//         }

//         if (this.color === 'white') {
//             return {name: this.name, origin: this.position, moves: white_moves};
//         } else {
//             return {name: this.name, black_moves: this.position, moves: black_moves};
//         }
//     }

//     valid_moves() {
//         let generatedMoves = this._generate_move_sequences().moves;
//         let origin = this._generate_move_sequences().origin;
//         //if moving forward one space would put the pawn off the board in either direction, delete both 
//         if (generatedMoves.forward[0] > gameState.board.getDims() - 1 || generatedMoves.forward[0] < 0) {
//             delete generatedMoves.forward;
//             delete generatedMoves.twoSquares;
//         }
//         //if forward one space hits a same color piece, delete both forward options
//         if (gameState.board.getSquare(generatedMoves.forward[0], generatedMoves.forward[1]).getPiece() !== null && gameState.board.getSquare(generatedMoves.forward[0], generatedMoves.forward[1]).getPiece().getColor() === this.color) {
//             delete generatedMoves.forward;
//             delete generatedMoves.twoSquares;
//         }
//         //if forward one space is okay, we need to verify forward 2 spaces is also okay. If not, we delete forward two
//         if (generatedMoves.twoSquares !== undefined) {
//             if (gameState.board.getSquare(generatedMoves.twoSquares[0], generatedMoves.twoSquares[1]).getPiece() !== null && gameState.board.getSquare(generatedMoves.twoSquares[0], generatedMoves.twoSquares[1]).getPiece().getColor() === this.color) {
//                 delete generatedMoves.twoSquares;
//             }
//         }
//         //check if capturing right is still on the board. If not, remove capRight
//         if (generatedMoves.capRight[0]> gameState.board.getDims() - 1 || generatedMoves.capRight[0] < 0 || generatedMoves.capRight[1]> gameState.board.getDims() - 1 || generatedMoves.capRight[1] < 0) {
//             delete generatedMoves.capRight;
//         }
//         //check if capturing left would is still on the board. If not, remove capLeft
//         if (generatedMoves.capLeft[0]> gameState.board.getDims() - 1 || generatedMoves.capLeft[0] < 0 || generatedMoves.capLeft[1]> gameState.board.getDims() - 1 || generatedMoves.capLeft[1] < 0) {
//             delete generatedMoves.capLeft;
//         }
//         if (generatedMoves.capRight !== undefined) {
//         //check that an enemy piece is present to capture right. If not, remove capRight
//             if (gameState.board.getSquare(generatedMoves.capRight[0], generatedMoves.capRight[1]).getPiece() === null || gameState.board.getSquare(generatedMoves.capRight[0], generatedMoves.capRight[1]).getPiece().getColor() === this.color) {
//                 delete generatedMoves.capRight;
//             }
//         }
//         if (generatedMoves.capLeft !== undefined) {
//             //check that an enemy piece is present to capture left. If not, remove capLeft
//             if (gameState.board.getSquare(generatedMoves.capLeft[0], generatedMoves.capLeft[1]).getPiece() === null || gameState.board.getSquare(generatedMoves.capLeft[0], generatedMoves.capLeft[1]).getPiece().getColor() === this.color) {
//                 delete generatedMoves.capLeft;
//             }
//         }

//         return {origin: origin, moves: Object.values(generatedMoves)};
//         }

//     getHasNotMoved() {return this.hasNotMoved;}
// }