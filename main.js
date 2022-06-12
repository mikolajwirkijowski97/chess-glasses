// piece enum
const Pieces = {
    Pawn: 1,
    Knight: 2,
    Bishop: 3,
    Rook: 4,
    Queen: 5,
    King: 6
}

// define color strings
const colors = {
    "BLUE":"(255,0,0)",
    "ORANGE":"(255,127,0)"
}

function createHighlightSquare(color, row, column){
    var highlightsq = document.createElement("div")
    highlightsq.classList.add("highlight")
    var classString = "square-"+row+column
    highlightsq.classList.add(classString)
    highlightsq.style = "background-color: rgb"+color+";"

    return highlightsq
}

function clearBoard(boardState){
    for(var x=0;x<boardState.length;x++){
        for(var y=0; y< boardState[x].length; y++){
            boardState[x][y] = null
        }
    }
}
function updateBoardState(board, boardState){
    clearBoard(boardState)
    pieces = document.getElementsByClassName("piece")
    console.log(pieces)

}

// MAIN LOGIC !!!
// get the main board element
var board = document.getElementsByClassName("board")
// board state is contained in this variable, 
var boardState = new Array(8)
for(var i=0;i<boardState.length;i++){
    boardState[i] = new Array(8)
}
updateBoardState(board, boardState);