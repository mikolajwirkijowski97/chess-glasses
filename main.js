// piece enum
const Pieces = {
    //Pawns
    WPawn: 0,
    BPawn: 1,
    //Knights
    WKnight: 2,
    BKnight: 3,
    //Bishops
    WBishop: 4,
    BBishop: 5,
    //Rooks
    WRook: 6,
    BRook: 7,
    //Queens
    WQueen: 8,
    BQueen: 9,
    //Kings
    WKing: 10,
    BKing: 11
}

// define color strings
const colors = {
    "BLUE":"(255,0,0)",
    "ORANGE":"(255,127,0)"
}

function createHighlightSquare(color, row, column){
    var highlightsq = document.createElement("div");
    highlightsq.classList.add("highlight");
    var classString = "square-"+row+column;
    highlightsq.classList.add(classString);
    highlightsq.style = "background-color: rgb"+color+";";

    return highlightsq;
}

function clearBoard(boardState){
    for(var x=0;x<boardState.length;x++){
        for(var y=0; y< boardState[x].length; y++){
            boardState[x][y] = null;
        }
    }
}

function classToPiece(pieceClass){
    switch(pieceClass){
        case 'wp':
            return Pieces.WPawn;
        case 'bp':
            return Pieces.BPawn;
        case 'wr':
            return Pieces.WRook;
        case 'br':
            return Pieces.BRook;
        case 'wn':
            return Pieces.WKnight;
        case 'bn':
            return Pieces.BKnight;
        case 'wb':
            return Pieces.WBishop;
        case 'bb':
            return Pieces.BBishop;
        case 'wq':
            return Pieces.WQueen;
        case 'bq':
            return Pieces.BQueen;
        case 'wk':
            return Pieces.WKing;
        case 'bk':
            return Pieces.BKing;
    }
}

function getDirections(pieceType){
    switch(pieceType){
        case Pieces.WPawn:
            return[[1,1],[1,-1]];
        case Pieces.BPawn:
            return[[-1,1],[-1,-1]];
        case Pieces.WRook:
            return[[1,0],[0,1],[-1,0],[0,-1]];
        case Pieces.BRook:
            return[[-1,0],[0,-1],[1,0],[0,1]];
        case Pieces.WKnight:
            return[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
        case Pieces.BKnight:
            return[[-2,1],[-2,-1],[2,1],[2,-1],[-1,2],[-1,-2],[1,2],[1,-2]];
        case Pieces.WBishop:
            return[[1,1],[-1,1],[1,-1],[-1,-1]];
        case Pieces.BBishop:
            return [[-1,1],[1,-1],[1,1],[-1,-1]];
        case Pieces.WQueen:
            return [[1,0],[0,1],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
        case Pieces.BQueen:
            return [[-1,0],[0,-1],[1,0],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
        case Pieces.WKing:
            return [[1,0],[0,1],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
        case Pieces.BKing:
            return [[-1,0],[0,-1],[1,0],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
    }
}

            
function updateBoardState(board, boardState){
    clearBoard(boardState);
    pieces = document.getElementsByClassName("piece");
    
    for(piece_ix = 0; piece_ix<pieces.length; piece_ix++){
        var pieceClassList = pieces.item(piece_ix).classList;
        var pieceType = classToPiece(pieceClassList.item(1));
        var squareXY = pieceClassList.item(2).match(/[0-9]/g);
        boardState[parseInt(squareXY[0])-1][parseInt(squareXY[1])-1] = pieceType
    }

    console.table(boardState)

}

function attackSquares(boardState,attackedSquares,piece,row,column){
    var pieceType = boardState[row][column];
    var pieceColor = pieceType % 2;
    var directions
}

function isOccupied(boardState, row, column){
    return boardState[row][column] != null;
}


// MAIN LOGIC STARTS HERE
// get the main board element
var board = document.getElementsByClassName("board");
// board state is contained in this variable, 
var boardState = new Array(8);
for(var i=0;i<boardState.length;i++){
    boardState[i] = new Array(8);
}
// attacked squares are contained in this variable
var attackedSquares = new Array(8);
for(var i=0;i<attackedSquares.length;i++){
    attackedSquares[i] = new Array(8);
}

setInterval(function(){updateBoardState(board,boardState)},250);

