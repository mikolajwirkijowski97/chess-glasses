// piece enum
const Pieces = {
    WPawn: 1,
    WKnight: 2,
    WBishop: 3,
    WRook: 4,
    WQueen: 5,
    WKing: 6,
    BPawn: 7,
    BKnight: 8,
    BBishop: 9,
    BRook: 10,
    BQueen: 11,
    BKing: 12
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

// MAIN LOGIC STARTS HERE

// get the main board element
var board = document.getElementsByClassName("board");
// board state is contained in this variable, 
var boardState = new Array(8);
for(var i=0;i<boardState.length;i++){
    boardState[i] = new Array(8);
}
updateBoardState(board, boardState);