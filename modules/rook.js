module.export.Rook = class Rook extends Piece {
    constructor(color, position) {
        super(color, position, 'rook', 5);
        this.hasNotMoved = true;
    }
    _generate_move_sequences() {
        let moves = [], rankUp = [], rankDown = [], fileRight = [], fileLeft = [];
        let file = this.position[0], rank = this.position[1];

        for (let i = 1; i < gameState.board.getDims(); i++) {
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