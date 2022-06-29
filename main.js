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
    "ORANGE":"(255,127,0)",
    "RED": "(0,0,255)",
    "VIOLET": "(255,0,255)"
}
// returns a highlight square and pushes it into the used elements global(to be changed) variable.
function createHighlightSquare(color, row, column){
    var highlightsq = document.createElement("div");
    highlightsq.classList.add("highlight");
    var classString = "square-"+row+column;
    
    highlightsq.classList.add(classString);
    highlightsq.style = "background-color: rgb"+color+"; opacity: 0.4;";
    this.addedElements.push(highlightsq);
    return highlightsq;
}

// clears all states and highlights
function clearBoard(Logic){
    for(var x=0;x<Logic["boardState"].length;x++){
        for(var y=0; y< Logic["boardState"][x].length; y++){
            Logic["boardState"][x][y] = null;
        }
    }

    for(var x=0;x<Logic["attackedStateWhite"].length;x++){
        for(var y=0; y< Logic["attackedStateWhite"].length; y++){
            Logic["attackedStateWhite"][x][y] = false;
        }
    }

    for(var x=0;x<Logic["attackedStateBlack"].length;x++){
        for(var y=0; y< Logic["attackedStateBlack"][x].length; y++){
            Logic["attackedStateBlack"][x][y] = false;
        }
    }

    for(var i=0;i<addedElements.length;i++){
        addedElements[i].remove();
    }
    addedElements.length = 0;
}
// maps the css piece classes to the Pieces enum
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

// Clears all pieces and highlights from the board and saves the client state of the chessboard into proper arrays.
function updateBoardState(Logic){
    clearBoard(Logic);
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
            Logic["boardState"][parseInt(squareXY[0])-1][parseInt(squareXY[1])-1] = pieceType
        }
        catch(err){
            console.log(err);
        } 
    }
    
    if(VERBOSE)console.table(Logic["boardState"]);
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

function markSquare(column, row, isWhite, Logic){
    if(isInBounds(column,row)){
        if(isWhite){
            Logic["attackedStateWhite"][column][row] = true;
        }
        else
        {
            Logic["attackedStateBlack"][column][row] = true;
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

function attackSquares(column,row,Logic){
    var piece = Logic["boardState"][column][row]; 
    if(piece == null) return;
    var attackDirections = getPieceAttackDirections(piece);
    var isWhite = piece%2 == 0;

    for(var i=0; i<attackDirections.length; i++){
        var attackColumn = column + attackDirections[i][0];
        var attackRow = row + attackDirections[i][1];

        while(true){
            if(isInBounds(attackColumn,attackRow)){
                markSquare(attackColumn, attackRow, isWhite, Logic);
                // if the square is non-empty(king excluded) OR its a single move piece, break the loop.
                const isKing = Logic["boardState"][attackColumn][attackRow] == Pieces.WKing || Logic["boardState"][attackColumn][attackRow] == Pieces.BKing;
                const isEmpty = Logic["boardState"][attackColumn][attackRow] == null;
                if( (!isEmpty && !isKing) || isSingleMovePiece(piece)){
                    break;
                }
                attackColumn += attackDirections[i][0];
                attackRow += attackDirections[i][1];
            }
            else{break;}
            }
        } 
}

function updateAttackState(Logic){
    for(var x=0;x<Logic["boardState"].length;x++){
        for(var y=0; y< Logic["boardState"][x].length; y++){
            if(Logic["boardState"][x][y] != null){
                attackSquares(x,y,Logic);
            }
        }
    }
}

function getKingPosition(Logic,isWhite){
    var kingPos = Array(2);
    for(var x=0;x<Logic["boardState"].length;x++){
        for(var y=0; y< Logic["boardState"][x].length; y++){
            if(Logic["boardState"][x][y] == Pieces.WKing && isWhite){
                kingPos[0] = x;
                kingPos[1] = y;
                return kingPos;
            }
            if(Logic["boardState"][x][y] == Pieces.BKing && !isWhite){
                kingPos[0] = x;
                kingPos[1] = y;
                return kingPos;
            }
        }
    }
}

function highlightAttackedSquaresAroundKing(Logic){
    var whiteKingPosition = getKingPosition(Logic, true);
    var blackKingPosition = getKingPosition(Logic, false);
    if(VERBOSE) console.log("Highlighting king squares");

    // mark sq around white king
    markSquaresAroundKing(whiteKingPosition[0], whiteKingPosition[1], true, Logic)
    // mark sq around black king
    markSquaresAroundKing(blackKingPosition[0], blackKingPosition[1], false, Logic)
}

function markSquaresAroundKing(row, col, isWhite, Logic){
    var kingDirections = getPieceAttackDirections(Pieces.WKing);
    for(var j=0;j<kingDirections.length;j++){
        var attackColumn = row + kingDirections[j][0];
        var attackRow =col + kingDirections[j][1];
        if(attackColumn >= 0 && attackColumn < 8 && attackRow >= 0 && attackRow < 8){
            if(!isWhite && Logic["attackedStateWhite"][attackColumn][attackRow]){
                Logic["boardElement"][0].prepend(createHighlightSquare(colors.BLUE,attackColumn+1,attackRow+1));
            }
            else if(isWhite && Logic["attackedStateBlack"][attackColumn][attackRow]){
                Logic["boardElement"][0].prepend(createHighlightSquare(colors.BLUE,attackColumn+1,attackRow+1));
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

function addCheckbox(gameSettings, settingHandle, checkBoxText, checked=false){
    var label = document.createElement("LABEL");
    label.innerHTML = checkBoxText;
    var khoCheckBox = document.createElement("INPUT");
    khoCheckBox.setAttribute("type", "checkbox");
    if(checked) khoCheckBox.setAttribute("checked",true);
    khoCheckBox.setAttribute("name",checkBoxText);
    khoCheckBox.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
          gameSettings[settingHandle] = true;
        } else {
            gameSettings[settingHandle] = false;
        }
      });
    var playerBottom = document.getElementById("board-layout-player-bottom");
    label.append(khoCheckBox);
    playerBottom.prepend(label);
}

function addKingHighlightsCheckbox(gameSettings){
    var label = document.createElement("LABEL");
    label.innerHTML = "King Highlights";
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
    label.append(khoCheckBox);
    playerBottom.prepend(label);
}

function highlightPinnedPieces(Logic){
    for(var col=0; col<8; col++){
        for(var row=0;row<8;row++){
            const isWhite = Logic["boardState"][col][row]%2 == 0;
            const isKing = Logic["boardState"][col][row] == Pieces.WKing || Logic["boardState"][col][row] == Pieces.BKing;

            var kingPos = getKingPosition(Logic, isWhite);
            const kingAlreadyAttacked = isWhite ? Logic["attackedStateBlack"][kingPos[0]][kingPos[1]] : Logic["attackedStateWhite"][kingPos[0]][kingPos[1]];
            if(Logic["boardState"][col][row] == null || isKing || kingAlreadyAttacked) continue;

            var logicCopy = {
                boardState: makeArray(8,8),
                attackedStateWhite: makeArray(8,8),
                attackedStateBlack: makeArray(8,8)
            }; // temporary logic for calculation
  
            logicCopy["boardState"] = structuredClone(Logic["boardState"]);
            
            logicCopy["boardState"][col][row] = null;
            updateAttackState(logicCopy);

            if(logicCopy["attackedStateBlack"][kingPos[0]][kingPos[1]] && isWhite)  {
                Logic["boardElement"][0].prepend(createHighlightSquare(colors.RED,col+1,row+1));
            }
            if(logicCopy["attackedStateWhite"][kingPos[0]][kingPos[1]] && !isWhite){
                Logic["boardElement"][0].prepend(createHighlightSquare(colors.RED,col+1,row+1));
            }  

        }
    }
}

function highlightHangingPieces(Logic){
    for(var col=0; col<8; col++){
        for(var row=0;row<8;row++){
            const isWhite = Logic["boardState"][col][row]%2 == 0;
            const isKing = Logic["boardState"][col][row] == Pieces.WKing || Logic["boardState"][col][row] == Pieces.BKing;
            const isQueen = Logic["boardState"][col][row] == Pieces.WQueen || Logic["boardState"][col][row] == Pieces.BQueen;
            if(Logic["boardState"][col][row] == null || isKing) continue;
            
            //logic if white piece attacked and undefended or attacked and queen.
            if(isWhite && Logic["attackedStateBlack"][col][row] && (!Logic["attackedStateWhite"][col][row] || isQueen)){
                Logic["boardElement"][0].prepend(createHighlightSquare(colors.VIOLET,col+1,row+1));
                continue;
            }
            if(!isWhite && Logic["attackedStateWhite"][col][row] && (!Logic["attackedStateBlack"][col][row] || isQueen)){
                Logic["boardElement"][0].prepend(createHighlightSquare(colors.VIOLET,col+1,row+1));
                continue;
            }

        }
    }
}

// contains the main looping logic
function mainLoop(gameSettings){
   var Logic = {
    boardElement: document.getElementsByClassName("board"),
    boardState: makeArray(8,8),
    attackedStateWhite: makeArray(8,8),
    attackedStateBlack: makeArray(8,8)
   }

    // update where the pieces are on board and clear previous states and highlights if they exist
    updateBoardState(Logic);

    // update of whether a square is attacked by a white or a black piece
    updateAttackState(Logic);

    if(gameSettings["pinIndicationOn"]) { highlightPinnedPieces(Logic); }
    if(gameSettings["kingHighlightsOn"]){ highlightAttackedSquaresAroundKing(Logic); }
    if(gameSettings["hangingPieceIndication"]){ highlightHangingPieces(Logic);}

    if(VERBOSE) {console.table(Logic["attackedStateWhite"]); console.table(Logic["attackedStateBlack"]);}
    
}

function main(){
    var gameSettings = {
        hangingPieceIndication : true,
        kingHighlightsOn : false,
        pinIndicationOn : true
    }
    addCheckbox(gameSettings, "kingHighlightsOn", "King safety");
    addCheckbox(gameSettings, "pinIndicationOn", "Pins", true);
    addCheckbox(gameSettings, "hangingPieceIndication", "Hanging pieces", true);
    // run the main loop at set interval(in ms)
    setInterval(function () {mainLoop(gameSettings)}, 350);
}


// script start
main();
