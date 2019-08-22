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
    getDims() {
        return this.dims;
    }
    getAlpha() {
        return this.alpha;
    }
}