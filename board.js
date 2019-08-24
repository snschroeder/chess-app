let board;

class Board {
    constructor() {
        this.dims = 8;
        this.playArea = new Array(this.dims);
        this.alpha = 'ABCDEFGH';
    }

    createBoard() {
        for (let i = 0; i < this.dims; i++) {
            this.playArea[i] = new Array(this.dims);
        }
    }

    assignNotation() {
        for (let i = 0; i < this.dims; i++) {
            for (let j = 0; j < this.dims; j++) {
                this.playArea[i][j] = new Square(i, j);
            }
        }
    }

    assignColor() {
        for (let i = 0; i < this.dims; i ++) {
            if (i % 2 === 0) {
                for (let j = 0; j < this.dims; j+=2) {
                    this.playArea[i][j].setColor('dark');
                    this.playArea[i][j + 1].setColor('light');
                }
            } else {
                for (let k = 0; k < this.dims; k +=2) {
                    this.playArea[i][k].setColor('light');
                    this.playArea[i][k + 1].setColor('dark');
                }
            }
        }
    }

    populatePieces() {
        let pieces = [];
        pieces.push(new Rook('white', [0, 0]));
        pieces.push(new Rook('white', [0, 7]));
        pieces.push(new Knight('white', [0, 1]));
        pieces.push(new Knight('white', [0, 6]));
        pieces.push(new Bishop('white', [0, 2]));
        pieces.push(new Bishop('white', [0, 5]));
        pieces.push(new Queen('white', [0, 3]));
        pieces.push(new King('white', [0, 4]));
        pieces.push(new Pawn('white', [1, 0]));
        pieces.push(new Pawn('white', [1, 1]));
        pieces.push(new Pawn('white', [1, 2]));
        pieces.push(new Pawn('white', [1, 3]));
        pieces.push(new Pawn('white', [1, 4]));
        pieces.push(new Pawn('white', [1, 5]));
        pieces.push(new Pawn('white', [1, 6]));
        pieces.push(new Pawn('white', [1, 7]));

        pieces.push(new Rook('black', [7, 0]));
        pieces.push(new Rook('black', [7, 7]));
        pieces.push(new Knight('black', [7, 1]));
        pieces.push(new Knight('black', [7, 6]));
        pieces.push(new Bishop('black', [7, 2]));
        pieces.push(new Bishop('black', [7, 5]));
        pieces.push(new Queen('black', [7, 3]));
        pieces.push(new King('black', [7, 4]));
        pieces.push(new Pawn('black', [6, 0]));
        pieces.push(new Pawn('black', [6, 1]));
        pieces.push(new Pawn('black', [6, 2]));
        pieces.push(new Pawn('black', [6, 3]));
        pieces.push(new Pawn('black', [6, 4]));
        pieces.push(new Pawn('black', [6, 5]));
        pieces.push(new Pawn('black', [6, 6]));
        pieces.push(new Pawn('black', [6, 7]));

        pieces.forEach(piece => {
            board.getPlayArea()[piece.position[0]][piece.position[1]].setPiece(piece);
        });
    }

    getDims() {return this.dims;}
    getAlpha() {return this.alpha;}
    getSquare(rank, file) {return this.playArea[rank][file];}
    getPlayArea() {return this.playArea;}
}













class Piece {
    constructor(color, position, name, value) {
        this.color = color;
        this.position = position;
        this.name = name;
        this.value = value;
    }
    valid_moves() {

        let generatedMoves = this._generate_move_sequences();
        generatedMoves = generatedMoves.map(direction => direction.filter(pos => !(pos[0] < 0 || pos[0] > board.getDims() -1 || pos[1] < 0 || pos[1] > board.getDims() -1)));

        generatedMoves.forEach((direction) => direction.forEach((pos, index) => {
            if (board.getSquare(pos[0], pos[1]).getPiece() !== null && board.getSquare(pos[0], pos[1]).getPiece().getColor() === this.color) {
                direction.splice(index);
            } else if (board.getSquare(pos[0], pos[1]).getPiece() !== null && board.getSquare(pos[0], pos[1]).getPiece().getColor() !== this.color) {
                direction.splice(index + 1);
            }
        }))

        return generatedMoves;

    }
    _generate_move_sequences() {return [];}
    getColor() {return this.color;}
}


class Rook extends Piece {
    constructor(color, position) {
        super(color, position, 'rook', 5);
    }
    _generate_move_sequences() {
        let moves = [];
        let rankUp = [];
        let rankDown = [];
        let fileRight = [];
        let fileLeft = [];
        let file = this.position[0];
        let rank = this.position[1];
        for (let i = 1; i < board.getDims(); i++) {
            fileRight.push([file + i, rank]);
            fileLeft.push([file - i, rank]);
            rankUp.push([file, rank + i]);
            rankDown.push([file, rank - i]);
        }
        moves.push(fileRight), moves.push(fileLeft), moves.push(rankUp), moves.push(rankDown);
        return moves;
    }   
}

class Bishop extends Piece {
    constructor(color, position) {
        super(color, position, 'bishop', 3);
    }
    _generate_move_sequences() {
        let moves = [];
        let upRight = [];
        let upLeft = [];
        let downRight = [];
        let downLeft = [];
        let file = this.position[0];
        let rank = this.position[1];
        for (let i = 1; i < board.getDims(); i++) {
            upRight.push([file + i, rank + i]);
            upLeft.push([file + i, rank - i]);
            downRight.push([file - i, rank + i]);
            downLeft.push([file -i, rank - i]);
        }
        moves.push(upRight), moves.push(upLeft), moves.push(downRight), moves.push(downLeft);
        return moves;
    }
}

class Knight extends Piece {
    constructor(color, position) {
        super(color, position, 'knight', 3);
    }
    _generate_move_sequences() {
        let moves = [];
        let file = this.position[0];
        let rank = this.position[1];
        moves.push([file + 2, rank + 1])
        moves.push([file + 2, rank - 1])
        moves.push([file + 1, rank + 2])
        moves.push([file + 1, rank - 2])
        moves.push([file - 2, rank + 1])
        moves.push([file - 2, rank -1])
        moves.push([file - 1, rank + 2])
        moves.push([file - 1, rank - 2])

        return moves;
    }
}

class Queen extends Piece {
    constructor(color, position) {
        super(color, position, 'queen', 9);
    }
    _generate_move_sequences() {
        let moves = [];
        let upRight = [];
        let upLeft = [];
        let downRight = [];
        let downLeft = [];
        let rankUp = [];
        let rankDown = [];
        let fileRight = [];
        let fileLeft = [];
        let file = this.position[0];
        let rank = this.position[1];
        for (let i = 1; i < board.getDims(); i++) {
            upRight.push([file + i, rank + i]);
            upLeft.push([file + i, rank - i]);
            downRight.push([file - i, rank + i]);
            downLeft.push([file -i, rank - i]);
            rankUp.push([file + i, rank]);
            rankDown.push([file - i, rank]);
            fileRight.push([file, rank + i]);
            fileLeft.push([file, rank - i]);
        }
        moves.push(upRight), moves.push(upLeft), moves.push(downRight), moves.push(downLeft);
        moves.push(rankUp), moves.push(rankDown), moves.push(fileRight), moves.push(fileLeft);
        return moves;
    }
}

class King extends Piece {
    constructor(color, position) {
        super(color, position, 'king', Number.POSITIVE_INFINITY);
    }
    _generate_move_sequences() {
        let moves = [];
        let file = this.position[0];
        let rank = this.position[1];
        moves.push([file + 1, rank + 1]);
        moves.push([file + 1, rank - 1]);
        moves.push([file - 1, rank + 1]);
        moves.push([file -1, rank - 1]);
        moves.push([file + 1, rank]);
        moves.push([file - 1, rank]);
        moves.push([file, rank + 1]);
        moves.push([file, rank - 1]);
        return moves;
    }
}

class Pawn extends Piece {
    constructor(color, position) {super(color, position, 'pawn', 1);} //how would we declare a hasMoved boolean?
    // valid_moves() {
    //     const moves = [];
    //     if (!board["E4"]) moves.push("E4");
    //     if (board["F4"].owner = "opponent") moves.push("E4");
    // }
    _generate_move_sequences() {
        let moves = [];
        let file = this.position[0];
        let rank = this.position[1];

        moves.push([file, rank + 1]);
        moves.push([file, rank + 2]); //can move 2 square if the pawn has not moved this game
        moves.push([file + 1, rank + 1]); //capture
        moves.push([file - 1, rank + 1]); //capture

        return moves;
    }
}