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

function clearBoard(boardState){
    for(var x=0;x<boardState.length;x++){
        for(var y=0; y< boardState[x].length; y++){
            boardState[x][y] = null;
        }
    }
    for(var i=0;i<addedElements.length;i++){
        addedElements[i].remove();
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
function updateBoardState(boardState){
    clearBoard(boardState);
    pieces = document.getElementsByClassName("piece");
    
    for(piece_ix = 0; piece_ix<pieces.length; piece_ix++){
        var pieceClassList = pieces.item(piece_ix).classList;
        var pieceType = classToPiece(pieceClassList.item(1));
        var squareXY = pieceClassList.item(2).match(/[0-9]/g);
        try{
            boardState[parseInt(squareXY[0])-1][parseInt(squareXY[1])-1] = pieceType
        }
        catch(err){
            console.log(err);
            console.log("Failed adding piece:" + pieceType + " to square: " + squareXY);
        }
        
    }

    console.table(boardState)

}

function getPieceAttackDirections(piece){
    switch(piece){
        case Pieces.WPawn:
            return [[-1,-1],[1,-1]];
        case Pieces.BPawn:
            return [[-1,1],[1,1]];
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

function attackSquares(piece,column,row,boardState, attackedStateWhite,attackedStateBlack){
    var attackDirections = getPieceAttackDirections(piece);
    var isWhite = piece%2 == 0;

    var singleMovePiece = piece == Pieces.WPawn || piece == Pieces.BPawn 
    || piece == Pieces.WKnight || piece == Pieces.BKnight || piece == Pieces.WKing || piece == Pieces.BKing;

    if(singleMovePiece){
        for(var i=0; i<attackDirections.length; i++){
            var attackColumn = column + attackDirections[i][0];
            var attackRow = row + attackDirections[i][1];
            if(attackColumn >= 0 && attackColumn < 8 && attackRow >= 0 && attackRow < 8){
                if(isWhite){
                    attackedStateWhite[attackColumn][attackRow] = true;
                }
                else{
                    attackedStateBlack[attackColumn][attackRow] = true;
                }
                
            }
        }
    }else
    {
        for(var i=0; i<attackDirections.length; i++){
            var attackColumn = column + attackDirections[i][0];
            var attackRow = row + attackDirections[i][1];
            while(true){
                if(attackColumn >= 0 && attackColumn < 8 && attackRow >= 0 && attackRow < 8){
                    if(isWhite){
                        attackedStateWhite[attackColumn][attackRow] = true;
                    }
                    else{
                        attackedStateBlack[attackColumn][attackRow] = true;
                    }

                    if(boardState[attackColumn][attackRow] != null){
                        break;
                    }
                    attackColumn += attackDirections[i][0];
                    attackRow += attackDirections[i][1];
                }else{
                    break;
                }
            
             }
         }
    }
}

function updateAttackState(boardState, attackedStateWhite, attackedStateBlack){
    for(var x=0;x<boardState.length;x++){
        for(var y=0; y< boardState[x].length; y++){
            if(boardState[x][y]){
                attackSquares(boardState[x][y],x,y,boardState,attackedStateWhite,attackedStateBlack);
            }
        }
    }
}

function highlightAttackedSquaresAroundKing(board, boardState, attackedStateWhite,attackedStateBlack){
    var whiteKingPosition = Array(2);
    var blackKingPosition = Array(2);

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
        console.log("attack column is:" + attackColumn + " attack row is:" + attackRow);

        if(attackColumn >= 0 && attackColumn < 8 && attackRow >= 0 && attackRow < 8){
            if(attackedStateBlack[attackColumn][attackRow]){
                console.log("highlighting square: " + attackColumn + "," + attackRow);
                board[0].appendChild(createHighlightSquare(colors.BLUE,attackColumn+1,attackRow+1));
            }
        }
    }
    // mark black king's attacked squares
    for(var j=0;j<kingDirections.length;j++){
        var attackColumn = blackKingPosition[0] + kingDirections[j][0];
        var attackRow = blackKingPosition[1] + kingDirections[j][1];
        
        if(attackColumn >= 0 && attackColumn < 8 && attackRow >= 0 && attackRow < 8){
            if(attackedStateWhite[attackColumn][attackRow]){
                console.log("highlighting square: " + attackColumn + "," + attackRow);
                board[0].appendChild(createHighlightSquare(colors.BLUE,attackColumn+1,attackRow+1));
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


// MAIN LOGIC STARTS HERE

function mainFunction(){

    // get the main board element
    var board = document.getElementsByClassName("board");

    // board state is contained in this variable, 
    var boardState = new Array(8);
    for(var i=0;i<boardState.length;i++){
        boardState[i] = new Array(8);
    }

    var attackedStateWhite = new Array(8);
    for(var i=0;i<attackedStateWhite.length;i++){
        attackedStateWhite[i] = new Array(8);
    }

    var attackedStateBlack = new Array(8);
    for(var i=0;i<attackedStateBlack.length;i++){
        attackedStateBlack[i] = new Array(8);
    }

   

    updateBoardState(boardState);
    updateAttackState(boardState, attackedStateWhite, attackedStateBlack);
    console.table(attackedStateBlack);
    console.table(attackedStateWhite);
    highlightAttackedSquaresAroundKing(board, boardState, attackedStateWhite, attackedStateBlack);
}

setInterval(mainFunction, 350);


