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








/*
Movement structure:
    rooks can move vertically or horizontally any number of spaces.
    for instance, a rook on A1 can move all the way to H1 or A8, so long as there are no pieces in his way
*/
class Rook extends Piece {
    constructor(color, position) {
        super(color, position, 'rook', 5);
    }
    _generate_move_sequences() {
        return [
            ["E4", "E5", "E6", "E7", "E8"],
            ["E3", "E2", "E1"],
        ];
    }
}





class Pawn extends Piece {
    constructor() {super("Pawn", color, position);}
    valid_moves() {
        const moves = [];
        if (!board["E4"]) moves.push("E4");
        if (board["F4"].owner = "opponent") moves.push("E4");
    }
}

const white_left_rook = new Rook('white', 'A1');

console.log(white_left_rook.value);

//white_left_rook.valid_moves();