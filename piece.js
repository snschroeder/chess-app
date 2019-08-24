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