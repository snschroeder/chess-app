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
        for (let i = 0; i < gameState.board.getDims(); i++) {
            pieces.push(new Pawn('white', [1, i]));
        }
        pieces.push(new Rook('black', [7, 0]));
        pieces.push(new Rook('black', [7, 7]));
        pieces.push(new Knight('black', [7, 1]));
        pieces.push(new Knight('black', [7, 6]));
        pieces.push(new Bishop('black', [7, 2]));
        pieces.push(new Bishop('black', [7, 5]));
        pieces.push(new Queen('black', [7, 3]));
        pieces.push(new King('black', [7, 4]));
        for (let i = 0; i < gameState.board.getDims(); i++) {
            pieces.push(new Pawn('black', [6, i]));
        }
        pieces.forEach(piece => {
            gameState.board.getPlayArea()[piece.position[0]][piece.position[1]].setPiece(piece);
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

    //validates moves for rook, bishop, queen, and king - removes squares off the board, and stops trajectories one square short of same colored piece or on opposite colored piece
    valid_moves() {
        let generatedMoves = this._generate_move_sequences();
        generatedMoves = generatedMoves.map(direction => direction.filter(pos => !(pos[0] < 0 || pos[0] > gameState.board.getDims() -1 || pos[1] < 0 || pos[1] > gameState.board.getDims() -1)));

        generatedMoves.forEach((direction) => direction.forEach((pos, index) => {
            if (gameState.board.getSquare(pos[0], pos[1]).getPiece() !== null && gameState.board.getSquare(pos[0], pos[1]).getPiece().getColor() === this.color) {
                direction.splice(index);
            } else if (gameState.board.getSquare(pos[0], pos[1]).getPiece() !== null && gameState.board.getSquare(pos[0], pos[1]).getPiece().getColor() !== this.color) {
                direction.splice(index + 1);
            }
        }))
        return generatedMoves.flat();

    }

    _generate_move_sequences() {return [];}
    getColor() {return this.color;}
    getPosition() {return this.position;}
}


class Rook extends Piece {
    constructor(color, position) {
        super(color, position, 'rook', 5);
        this.hasNotMoved = true;
    }
    _generate_move_sequences() {
        let moves = [], rankUp = [], rankDown = [], fileRight = [], fileLeft = [];
        let file = this.position[0], rank = this.position[1];

        for (let i = 1; i < board.getDims(); i++) {
            fileRight.push([file + i, rank]);
            fileLeft.push([file - i, rank]);
            rankUp.push([file, rank + i]);
            rankDown.push([file, rank - i]);
        }
        moves.push(fileRight), moves.push(fileLeft), moves.push(rankUp), moves.push(rankDown);
        return moves;
    }
    getHasNotMoved() {return this.hasNotMoved;}
}

class Bishop extends Piece {
    constructor(color, position) {
        super(color, position, 'bishop', 3);
    }
    _generate_move_sequences() {
        const moves = [], upRight = [], upLeft = [], downRight = [], downLeft = [];
        let file = this.position[0];
        let rank = this.position[1];

        for (let i = 1; i < gameState.board.getDims(); i++) {
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
        const moves = [];
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

    valid_moves() {
        let generatedMoves = this._generate_move_sequences();
        generatedMoves = generatedMoves.filter(pos => !(pos[0] < 0 || pos[0] > gameState.board.getDims() -1 || pos[1] < 0 || pos[1] > gameState.board.getDims() -1));
        generatedMoves = generatedMoves.filter(move => gameState.board.getSquare(move[0], move[1]).getPiece() === null || gameState.board.getSquare(move[0], move[1]).getPiece().getColor() !== this.color);
        return generatedMoves;
    }
}

class Queen extends Piece {
    constructor(color, position) {
        super(color, position, 'queen', 9);
    }
    _generate_move_sequences() {
        const moves = [];
        const upRight = [], upLeft = [], downRight = [], downLeft = [], rankUp = [],rankDown = [], fileRight = [], fileLeft = [];
        let file = this.position[0], rank = this.position[1];

        for (let i = 1; i < gameState.board.getDims(); i++) {
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
        this.hasNotMoved = true;
    }
    _generate_move_sequences() {
        const moves = [];
        const upRight = [], upLeft = [], downRight = [], downLeft = [], rankUp = [],rankDown = [], fileRight = [], fileLeft = [];
        let file = this.position[0], rank = this.position[1];

        upRight.push([file + 1, rank + 1]);
        upLeft.push([file + 1, rank - 1]);
        downRight.push([file - 1, rank + 1]);
        downLeft.push([file -1, rank - 1]);
        rankUp.push([file + 1, rank]);
        rankDown.push([file - 1, rank]);
        fileRight.push([file, rank + 1]);
        fileLeft.push([file, rank - 1]);

        moves.push(upRight), moves.push(upLeft), moves.push(downRight), moves.push(downLeft);
        moves.push(rankUp), moves.push(rankDown), moves.push(fileRight), moves.push(fileLeft);
        return moves;
    }
    getHasNotMoved() {return this.hasNotMoved;}
}

class Pawn extends Piece {
    constructor(color, position) {
        super(color, position, 'pawn', 1);
            this.hasNotMoved = true;
    }
    _generate_move_sequences() {

        let file = this.position[0];
        let rank = this.position[1];


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
            return black_moves
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
        //check that an enemy piece is present to capture right. If not, remove capRight
        if (gameState.board.getSquare(generatedMoves.capRight[0], generatedMoves.capRight[1]).getPiece() === null || gameState.board.getSquare(generatedMoves.capRight[0], generatedMoves.capRight[1]).getPiece().getColor() === this.color) {
            delete generatedMoves.capRight;
        }
        //check that an enemy piece is present to capture left. If not, remove capLeft
        if (gameState.board.getSquare(generatedMoves.capLeft[0], generatedMoves.capLeft[1]).getPiece() === null || gameState.board.getSquare(generatedMoves.capLeft[0], generatedMoves.capLeft[1]).getPiece().getColor() === this.color) {
            delete generatedMoves.capLeft;
        }

        return Object.values(generatedMoves);
        }

    getHasNotMoved() {return this.hasNotMoved;}
}