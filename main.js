const VERBOSE = true;
var addedElements = [];


// piece enum
const Pieces = {
    WPawn: 0,
    BPawn: 1,

    WKnight: 2,
    BKnight: 3,
    
    WBishop: 4,
    BBishop: 5,
    
    WRook: 6,
    BRook: 7,
    
    WQueen: 8,
    BQueen: 9,
    
    WKing: 10,
    BKing: 11
}

// define color strings
const colors = {
    "BLUE":"(255,0,0)",
    "ORANGE":"(255,127,0)"
}

function createHighlightSquare(color, row, column, AddElements){
    var highlightsq = document.createElement("div");
    highlightsq.classList.add("highlight");
    var classString = "square-"+row+column;
    
    highlightsq.classList.add(classString);
    highlightsq.style = "background-color: rgb"+color+"; opacity: 0.4;";
    addedElements.push(highlightsq);
    return highlightsq;
}

function clearBoard(boardState, attackedStateWhite, attackedStateBlack){
    for(var x=0;x<boardState.length;x++){
        for(var y=0; y< boardState[x].length; y++){
            boardState[x][y] = null;
        }
    }

    for(var x=0;x<attackedStateWhite.length;x++){
        for(var y=0; y< attackedStateWhite[x].length; y++){
            attackedStateWhite[x][y] = false;
        }
    }

    for(var x=0;x<attackedStateBlack.length;x++){
        for(var y=0; y< attackedStateBlack[x].length; y++){
            attackedStateBlack[x][y] = false;
        }
    }

    for(var i=0;i<addedElements.length;i++){
        addedElements[i].remove();
    }
    addedElements.length = 0;
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
function updateBoardState(boardState,attackedStateWhite,attackedStateBlack){
    clearBoard(boardState,attackedStateWhite,attackedStateBlack);

    pieces = document.getElementsByClassName("piece");
    var squareXY = "";
    var pieceType = "";

    for(piece_ix = 0; piece_ix<pieces.length; piece_ix++){
        var pieceClassList = pieces.item(piece_ix).classList;
        for(classItem_ix = 0; classItem_ix<pieceClassList.length; classItem_ix++){
            if(pieceClassList.item(classItem_ix).startsWith("square")){
                squareXY = pieceClassList.item(classItem_ix).match(/[0-9]/g);
            }
            else if(pieceClassList.item(classItem_ix).startsWith("piece")){
                continue;

            }
            else{
               
                pieceType = classToPiece(pieceClassList.item(classItem_ix));
            }
        }

        try{
            boardState[parseInt(squareXY[0])-1][parseInt(squareXY[1])-1] = pieceType
        }
        catch(err){
            console.log(err);
        }
        
    }
    
    if(VERBOSE)console.table(boardState);
}

function getPieceAttackDirections(piece){
    switch(piece){
        case Pieces.WPawn:
            return [[1,1],[-1,1]];
        case Pieces.BPawn:
            return [[1,-1],[-1,-1]];
        case Pieces.WKnight:
            return [[-2,1],[-1,2],[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1]];
        case Pieces.BKnight:
            return [[-2,-1],[-1,-2],[1,-2],[2,-1],[2,1],[1,2],[-1,2],[-2,1]];
        case Pieces.WBishop:
            return [[-1,1],[1,1],[-1,-1],[1,-1]];
        case Pieces.BBishop:
            return [[-1,-1],[1,-1],[-1,1],[1,1]];
        case Pieces.WRook:
            return [[-1,0],[0,1],[1,0],[0,-1]];
        case Pieces.BRook:
            return [[-1,0],[0,-1],[1,0],[0,1]];
        case Pieces.WQueen:
            return [[-1,0],[0,1],[1,0],[0,-1],[-1,1],[1,1],[-1,-1],[1,-1]];
        case Pieces.BQueen:
            return [[-1,0],[0,-1],[1,0],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]];
        case Pieces.WKing:
            return [[-1,0],[0,1],[1,0],[0,-1],[-1,1],[1,1],[-1,-1],[1,-1]];
        case Pieces.BKing:
            return [[-1,0],[0,-1],[1,0],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]];
    }
}

function markSquare(column,row,attackedStateWhite,attackedStateBlack, isWhite){
    if(column >= 0 && column < 8 && row >= 0 && row < 8){
        if(isWhite){
            attackedStateWhite[column][row] = true;
        }
        else
        {
            attackedStateBlack[column][row] = true;
        }
        
    }
}

function isInBounds(col,row){
    return col >= 0 && col < 8 && row >= 0 && row < 8
}

function isSingleMovePiece(piece){
    return piece == Pieces.WPawn || piece == Pieces.BPawn 
    || piece == Pieces.WKnight || piece == Pieces.BKnight || piece == Pieces.WKing || piece == Pieces.BKing;
}

function attackSquares(piece,column,row,boardState, attackedStateWhite,attackedStateBlack){
    var attackDirections = getPieceAttackDirections(piece);
    var isWhite = piece%2 == 0;

    for(var i=0; i<attackDirections.length; i++){
        var attackColumn = column + attackDirections[i][0];
        var attackRow = row + attackDirections[i][1];

        while(true){
            if(attackColumn >= 0 && attackColumn < 8 && attackRow >= 0 && attackRow < 8){
                markSquare(attackColumn,attackRow,attackedStateWhite,attackedStateBlack,isWhite);
                // if the square is non-empty OR its a single move piece, break the loop.
                if(boardState[attackColumn][attackRow] != null || isSingleMovePiece(piece)){
                    break;
                }
                attackColumn += attackDirections[i][0];
                attackRow += attackDirections[i][1];
            }
            else{break;}
            }
        }
    
}

function updateAttackState(boardState, attackedStateWhite, attackedStateBlack){
    for(var x=0;x<boardState.length;x++){
        for(var y=0; y< boardState[x].length; y++){
            if(boardState[x][y] != null){
                attackSquares(boardState[x][y],x,y,boardState,attackedStateWhite,attackedStateBlack);
            }
        }
    }
}

function highlightAttackedSquaresAroundKing(board, boardState, attackedStateWhite,attackedStateBlack){
    var whiteKingPosition = Array(2);
    var blackKingPosition = Array(2);
    if(VERBOSE) console.log("Highlighting king squares");

    for(var x=0;x<boardState.length;x++){
        for(var y=0; y< boardState[x].length; y++){
            if(boardState[x][y] == Pieces.WKing){
                whiteKingPosition[0] = x;
                whiteKingPosition[1] = y;
            }
            if(boardState[x][y] == Pieces.BKing){
                blackKingPosition[0] = x;
                blackKingPosition[1] = y;
        }
    }
    }
    var kingDirections = getPieceAttackDirections(Pieces.WKing);
    console.log("king directions: "+ kingDirections);
    // mark white king's attacked squares
    for(var j=0;j<kingDirections.length;j++){
        var attackColumn = whiteKingPosition[0] + kingDirections[j][0];
        var attackRow = whiteKingPosition[1] + kingDirections[j][1];
        if(attackColumn >= 0 && attackColumn < 8 && attackRow >= 0 && attackRow < 8){
            if(attackedStateBlack[attackColumn][attackRow]){
                board[0].prepend(createHighlightSquare(colors.BLUE,attackColumn+1,attackRow+1));
            }
        }
    }
    // mark black king's attacked squares
    for(var j=0;j<kingDirections.length;j++){
        var attackColumn = blackKingPosition[0] + kingDirections[j][0];
        var attackRow = blackKingPosition[1] + kingDirections[j][1];
        
        if(attackColumn >= 0 && attackColumn < 8 && attackRow >= 0 && attackRow < 8){
            if(attackedStateWhite[attackColumn][attackRow]){
                board[0].prepend(createHighlightSquare(colors.BLUE,attackColumn+1,attackRow+1));
            }
            
        }
    }
}

// get users most played openings from chess.com
function getUserGames(username){
    var url = "https://api.chess.com/pub/player/"+username+"/games/2022/5/pgn";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function(){
    }
}

// returns an array of size x by y
    function makeArray(x,y){
        var newArr = new Array(8);
        for(var i=0;i<newArr.length;i++){
            newArr[i] = new Array(8);
        }
        return newArr;
    }

function addKingHighlightsCheckbox(gameSettings){
    var khoCheckBox = document.createElement("INPUT");
    khoCheckBox.setAttribute("type", "checkbox");
    khoCheckBox.setAttribute("name","king highlights");
    khoCheckBox.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
          gameSettings["kingHighlightsOn"] = true;
        } else {
            gameSettings["kingHighlightsOn"] = false;
        }
      });
    
    var playerBottom = document.getElementById("board-layout-player-bottom");
    playerBottom.prepend(khoCheckBox);
}
// contains the main looping logic
function mainLoop(gameSettings){

    // get the main board element
    var board = document.getElementsByClassName("board");

    // initialize board states to empty arrays
    var boardState = makeArray(8,8);
    var attackedStateWhite = makeArray(8,8);
    var attackedStateBlack = makeArray(8,8)

   
    // update where the pieces are on board
    updateBoardState(boardState,attackedStateWhite,attackedStateBlack);

    // update of whether a square is attacked by a white or a black piece
    updateAttackState(boardState, attackedStateWhite, attackedStateBlack);
    // if option is on, highlight kings' neighboring squares which are attacked by enemy pieces
    if(gameSettings["kingHighlightsOn"]){highlightAttackedSquaresAroundKing(board, boardState, attackedStateWhite, attackedStateBlack);}

    if(VERBOSE) {console.table(attackedStateWhite); console.table(attackedStateBlack);}
    
}

function main(){
    var gameSettings = {
        kingHighlightsOn : false
    }

    addKingHighlightsCheckbox(gameSettings);
    // run the main loop at set interval(in ms)
    setInterval(function () {mainLoop(gameSettings)}, 350);
}


// script start
main();
