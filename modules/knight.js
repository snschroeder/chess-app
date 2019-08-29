export default class Knight extends Piece {
    constructor(color, position) {
        super(color, position, 'knight', 3);
    }
    _generate_move_sequences() {
        const moves = [];
        let file = this.position[0], rank = this.position[1];
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