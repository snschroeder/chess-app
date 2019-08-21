class Piece {
    constructor(color, position, name, value) {
        this.color = color;
        this.position = position;
        this.name = name;
        this.value = value;
    }
    valid_moves() {
        console.log("Generated move sequences:");
        console.log(this._generate_move_sequences());
        return [];
    }
    _generate_move_sequences() {return [];}
}


class Rook extends Piece {
    constructor(color, position) {
        super(color, position, 'rook', 5);
    }
    _generate_move_sequences() {
        let rankLeft = [], rankRight = [], fileUp = [], fileDown = [];
        let file = this.position[0];
        let rank = Number(this.position[1]);

        if (rank < board.getDims()) {
            for (let i = rank + 1; i <= board.getDims(); i++) {
                fileUp.push(file + i);
            }
        }

        if (rank > 1) {
            for (let i = rank - 1; i >= 1; i--) {
                fileDown.push(file + i);
            }
        }
        if (file !== board.getAlpha()[board.getAlpha().length - 1]) {
            for (let i = board.getAlpha().indexOf(file) + 1; i < 8; i++)
            rankRight.push(board.getAlpha()[i] + rank);
        }
        if (file !== board.getAlpha()[0]) {
            for (let i = board.getAlpha().indexOf(file) - 1; i >= 0; i--) {
                rankLeft.push(board.getAlpha()[i] + rank);
            }
        }
        return [
            fileUp,
            fileDown,
            rankLeft,
            rankRight
        ]
    }
    
}

class Bishop extends Piece {
    constructor(color, position) {
        super(color, position, 'bishop', 3);
    }
    _generate_move_sequences() {
        let upRight = [], upLeft = [], downRight = [], downLeft = [];
        let file = this.position[0];
        this.rank = Number(this.position[1]);


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

const white_pawn = new Pawn('white', 'B2');
console.log(white_pawn.valid_moves())