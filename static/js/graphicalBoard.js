function gameStateToDisplay()
{
  // This is the main configurable option... All other sizes based on the piece size.
  var piece = 40;

  var triangleBase = piece + 1;
  var boardMiddle = triangleBase + 2;
  var boardMiddleMargin = boardMiddle / 2;
  var boardWidth = triangleBase * 12 + boardMiddle;
  var boardHeight = triangleBase * 7;

  var boards = new Array();
  boards[0] = document.getElementById('board0');
  boards[1] = document.getElementById('board1');

  for (var i = 0; i < 2; i++) { 
    
    var context = boards[i].getContext("2d");
    if (context) {  
      boards[i].width = boardWidth;
      boards[i].height = boardHeight;
      boards[i].setAttribute('style', 'border:1px solid #000000;');
  
      // Set the style properties.
      context.strokeStyle = '#000000';
      context.lineWidth = 1;
  
      // top triangles 
      for (var i = 0; i < 12; i++) {
  
        // alternate black and white
        if (i % 2 == 0) { 
          context.fillStyle = '#ffffff';
        } else {
          context.fillStyle = '#000000';
        }
  
        // middle of board offset
        var middleOffset = Math.floor(i / 6) * boardMiddle;
  
        context.beginPath();
    
          context.moveTo(piece * i + middleOffset + i, 0);
          context.lineTo(piece * (i + 1) + middleOffset + i, 0);
          context.lineTo(piece * i + piece / 2 + middleOffset + i, piece * 3);
          context.lineTo(piece * i + middleOffset + i, 0);
          
          context.fill();
          context.stroke();
    
        context.closePath();
      }
  
      // bottom triangles
      for (var i = 0; i < 12; i++) {
  
        // alternate black and white
        if (i % 2 == 1) { 
          context.fillStyle = '#ffffff';
        } else {
          context.fillStyle = '#000000';
        }
  
        // middle of board offset
        var middleOffset = Math.floor(i / 6) * boardMiddle;
  
        context.beginPath();
    
          context.moveTo(piece * i + middleOffset + i, boardHeight);
          context.lineTo(piece * (i + 1) + middleOffset + i, boardHeight);
          context.lineTo(piece * i + piece / 2 + middleOffset + i, boardHeight - piece * 3);
          context.lineTo(piece * i + middleOffset + i, boardHeight);
          
          context.fill();
          context.stroke();
    
        context.closePath();
      }
  
      // middle
      context.fillStyle = '#000000';
      context.fillRect(boardWidth / 2 - boardMiddle / 2 + boardMiddleMargin / 2, 0, boardMiddle - boardMiddleMargin, boardHeight);
    }
  }

  var returnStr = '';

  for (var i = 0; i < numBoards; i++) {
     for (var j = 0; j < numSlotsPerBoard; j++) {
        returnStr += getSlotKeyOnBoard(i, j) + ' = "' +
                     gameState[getSlotKeyOnBoard(i, j)] + '"\n';
     }

     for (var j = 0; j < numTeams; j++) {
        returnStr += getTeamCollectedKeyOnBoard(i,j) + ' = "' +
                     gameState[getTeamCollectedKeyOnBoard(i,j)] + '"\n';
        returnStr += getTeamHitKeyOnBoard(i,j) + ' = "' +
                     gameState[getTeamHitKeyOnBoard(i,j)] + '"\n';
     }
  }

  for (var i = 0; i < numPlayers; i++) {
     returnStr += getPlayerNameKey(i) + ' = "' +
                  gameState[getPlayerNameKey(i)] + '"\n';
  }

  for (var i = 0; i < numDice; i++) {
     returnStr += getDiceValueKey(i) + ' = "' +
                  gameState[getDiceValueKey(i)] + '"\n';
  }

  for (var i = 0; i < numDice; i++) {
     returnStr += getTeamScoreKey(i) + ' = "' +
                  gameState[getTeamScoreKey(i)] + '"\n';
  }
}
