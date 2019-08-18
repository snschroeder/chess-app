The aim of this project is to create a web based chess application


phase one: chess logic and gamestate storage

    board: 
        generating the 2D array that will store the board state
        applying chess notation to the board - i.e., A1, B3, C4, etc- to indicate which square is selected. This notation will serve as the basis for finding pieces and eligible moves
        applying color information to each square - light or dark

    pieces:
        each piece will have a few attributes:
            color = is this piece light or dark?
            value = point value for each piece (pawns have value of 1, bishops and knights 3, rooks 5, etc.)
            eligibleMoves = array storing all eligible moves

        each piece will have a couple methods:
            move(attempted move) = if the attempted move is an eligible move, move to the squre. Capture any enemy pieces if the are on the destination tile

            pawns:
                have a special attribute:
                    hasMoved = boolean indicating whether or not the piece has moved. If the piece has not moved, the pawn can move forward 2 squares, or one

                have two special methods:
                    en passant - special capture method applicable when an enemy pawn moves forward 2 squares, placing them side by side with the current pawn
                    promote() - when the pawn makes it to the end of the board, it can promote to a knight, bishop, rook, or queen

            kings: 
                have special attributes:
                    inCheckmate = boolean value when checkmated, the game ends and the player whose king is checkmated loses
                    inCheck = boolean value for when in check. When in check, the only eligible moves are moves that take the king out of check - i.e., king moves to a square where he would not be in check, or a piece blocks the checking piece
                    hasMoved = boolean value indicating whether or not the king has moved. If he has, he is unable to castle

                have a special method:
                    castle(direction) - if the king has not moved and the rook in the direction the king wishes to castle has not moved, the king may castle -moves over two squares in the direction of the rook, rook moves to the other side of the king

     gameplay:
        attributes:
            currentMove - starts on white. once white moves, black is able to move. Cycle repeats

        methods:   
            gameStart() - all pieces placed in starting position, white takes the first move
            makeMove(piece, destination) - check if the destination is an eligible move. If so, moves the piece there. Capture enemy piece that is there, if any. Check for check and checkmate
            logMove() - logs the played move to the algebraic notation

Phase two: rendering

    board:
        create a function that displays the board
            this will include displaying the chess notation and square color

    pieces:
        create a function that displays the pieces in their current positions
        each piece should be clearly distinguishable
        update the piece locations as they move
        must be able to determine which piece has been selected

    long term additions:
        turn timer - countdown timer for both players that tracks the move they spend on moves. If the timer makes it to zero and the enemy has enough pieces on board to checkmate the enemy king, the player who ran out of time loses. Otherwise it is a tie
        changeable board color palettes and pieces appearances
        clean animation for piece moves
        display eligible moves
        highlight last moved piece

Phase three: connectivity and usability

    create websocket to allow users to play over the web
    create a rudimentary AI - can I use an engine for this?