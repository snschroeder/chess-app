class Piece {
    constructor(color, position, name, value) {
        this.color = color;
        this.position = position;
        this.name = name;
        this.value = value;
    }
    valid_moves() {

        let generatedMoves = this._generate_move_sequences();
        return generatedMoves.filter(pos => !(pos[0] < 0 || pos[0] > 7 || pos[1] < 0 || pos[1] > 7))

    }
    _generate_move_sequences() {return [];}
}


class Rook extends Piece {
    constructor(color, position) {
        super(color, position, 'rook', 5);
    }
    _generate_move_sequences() {
        let moves = [];
        let file = this.position[0];
        let rank = this.position[1];
        for (let i = 1; i < board.getDims(); i++) {
            moves.push([file + i, rank]);
            moves.push([file - i, rank]);
            moves.push([file, rank + i]);
            moves.push([file, rank - i]);
        }
        return moves;
    }   
}

class Bishop extends Piece {
    constructor(color, position) {
        super(color, position, 'bishop', 3);
    }
    _generate_move_sequences() {
        let moves = [];
        let file = this.position[0];
        let rank = this.position[1];
        for (let i = 1; i < board.getDims(); i++) {
            moves.push([file + i, rank + i]);
            moves.push([file + i, rank - i]);
            moves.push([file - i, rank + i]);
            moves.push([file -i, rank - i]);
        }
        return moves;
    }
}



class Knight extends Piece {
    constructor(color, position) {
        super(color, position, 'knight', 3);
    }
    _generate_move_sequences() {
        return [];
    }
}

class Queen extends Piece {
    constructor(color, position) {
        super(color, position, 'queen', 9);
    }
    _generate_move_sequences() {
        return [];
    }
}

class King extends Piece {
    constructor(color, position) {
        super(color, position, 'king', Number.POSITIVE_INFINITY);
    }
    _generate_move_sequences() {
        return [];
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
        let firstMove = [], normalMove = [], capture = [];
        let file = this.position[0];
        let rank = Number(this.position[1]);

        if (rank < 8) {
            normalMove.push(file + (rank + 1))
        }

        if (true) { //change to !hasMoved later
            firstMove.push(file + (rank + 2));
        }
        if (board.getAlpha().indexOf(file) > 0) {
            capture.push(board.getAlpha()[board.getAlpha().indexOf(file) + 1] + (rank + 1));
        }

        if (board.getAlpha().indexOf(file) < board.getDims() - 1) {
            capture.push(board.getAlpha()[board.getAlpha().indexOf(file) - 1] + (rank + 1));
        }

        return [
            firstMove,
            normalMove,
            capture,
        ]
    }
}

// const white_left_rook = new Rook('white', 'C3');

// console.log(white_left_rook.valid_moves());

const white_rook = new Rook('white', [3, 3]);
console.log(white_rook.valid_moves())

const white_bishop = new Bishop('white', [3, 3]);
console.log(white_bishop.valid_moves());

// for (d = 1; d<8; ++d)

// rank_up.push([rank - d, file])

// rank_down.push([rank + d, file])

// file_left.push([rank, file + d])

// file_right.push([rank, file - d])

// rank + d, file + d

// rank + d, file - d

// rank - d, file + d

// rank - d, file - d

// if spaceAhead contains sameColorPiece || isOffBoard
//     move is invalid

