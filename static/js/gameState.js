// Global game state array
var gameState = [];
var stateMetaData;
var totalMovesLeft = 0;

// Board definitions
var numPiecesPerBoard = 15;
var numBoards = 2;
var numPlayersPerTeam = 2;
var numDice = 2;

// Team definitions
var numTeams = 2;

// State definitions
var pieceState = {
   IN_SLOT_0   : 0,
   IN_SLOT_1   : 1,
   IN_SLOT_2   : 2,
   IN_SLOT_3   : 3,
   IN_SLOT_4   : 4,
   IN_SLOT_5   : 5,
   IN_SLOT_6   : 6,
   IN_SLOT_7   : 7,
   IN_SLOT_8   : 8,
   IN_SLOT_9   : 9,
   IN_SLOT_10  : 10,
   IN_SLOT_11  : 11,
   IN_SLOT_12  : 12,
   IN_SLOT_13  : 13,
   IN_SLOT_14  : 14,
   IN_SLOT_15  : 15,
   IN_SLOT_16  : 16,
   IN_SLOT_17  : 17,
   IN_SLOT_18  : 18,
   IN_SLOT_19  : 19,
   IN_SLOT_20  : 20,
   IN_SLOT_21  : 21,
   IN_SLOT_22  : 22,
   IN_SLOT_23  : 23,
   HIT_0       : 24,
   HIT_1       : 25,
   PICKED_UP_0 : 26,
   PICKED_UP_1 : 27,
   NUM_STATES  : 28
};

// Return the string representation of a slot
function slotToString(slotId)
{
   if (slotId <= pieceState.IN_SLOT_23) {
      return slotId;
   } else if (slotId <= pieceState.HIT_1) {
      return "HIT";
   } else if (slotId <= pieceState.PICKED_UP_1) {
      return "PICKUP";
   }
}

// Return the state key for a piece on the given board with the given team
function getPieceKeyOnBoard(boardId, teamId, pieceId)
{
   return 'board' + boardId + '_team' + teamId + '_piece' + pieceId;
}

// Initialize the given board to be empty
function clearBoard(boardId)
{
   for (var team = 0; team < numTeams; team++) {
      for (var piece = 0; piece < numPiecesPerBoard; piece++) {
         gameState[getPieceKeyOnBoard(boardId, team, piece)] = '';
      }
   }
}

// Add standard piece configuration to a board
function movePiecesToStandardLocations(boardId)
{
   // Team 0
   gameState[getPieceKeyOnBoard(boardId, 0, 0)] = pieceState.IN_SLOT_0.toString();
   gameState[getPieceKeyOnBoard(boardId, 0, 1)] = pieceState.IN_SLOT_0.toString();
   gameState[getPieceKeyOnBoard(boardId, 0, 2)] = pieceState.IN_SLOT_11.toString();
   gameState[getPieceKeyOnBoard(boardId, 0, 3)] = pieceState.IN_SLOT_11.toString();
   gameState[getPieceKeyOnBoard(boardId, 0, 4)] = pieceState.IN_SLOT_11.toString();
   gameState[getPieceKeyOnBoard(boardId, 0, 5)] = pieceState.IN_SLOT_11.toString();
   gameState[getPieceKeyOnBoard(boardId, 0, 6)] = pieceState.IN_SLOT_11.toString();
   gameState[getPieceKeyOnBoard(boardId, 0, 7)] = pieceState.IN_SLOT_16.toString();
   gameState[getPieceKeyOnBoard(boardId, 0, 8)] = pieceState.IN_SLOT_16.toString();
   gameState[getPieceKeyOnBoard(boardId, 0, 9)] = pieceState.IN_SLOT_16.toString();
   gameState[getPieceKeyOnBoard(boardId, 0, 10)] = pieceState.IN_SLOT_18.toString();
   gameState[getPieceKeyOnBoard(boardId, 0, 11)] = pieceState.IN_SLOT_18.toString();
   gameState[getPieceKeyOnBoard(boardId, 0, 12)] = pieceState.IN_SLOT_18.toString();
   gameState[getPieceKeyOnBoard(boardId, 0, 13)] = pieceState.IN_SLOT_18.toString();
   gameState[getPieceKeyOnBoard(boardId, 0, 14)] = pieceState.IN_SLOT_18.toString();

   // Team 1
   gameState[getPieceKeyOnBoard(boardId, 1, 0)] = pieceState.IN_SLOT_23.toString();
   gameState[getPieceKeyOnBoard(boardId, 1, 1)] = pieceState.IN_SLOT_23.toString();
   gameState[getPieceKeyOnBoard(boardId, 1, 2)] = pieceState.IN_SLOT_12.toString();
   gameState[getPieceKeyOnBoard(boardId, 1, 3)] = pieceState.IN_SLOT_12.toString();
   gameState[getPieceKeyOnBoard(boardId, 1, 4)] = pieceState.IN_SLOT_12.toString();
   gameState[getPieceKeyOnBoard(boardId, 1, 5)] = pieceState.IN_SLOT_12.toString();
   gameState[getPieceKeyOnBoard(boardId, 1, 6)] = pieceState.IN_SLOT_12.toString();
   gameState[getPieceKeyOnBoard(boardId, 1, 7)] = pieceState.IN_SLOT_7.toString();
   gameState[getPieceKeyOnBoard(boardId, 1, 8)] = pieceState.IN_SLOT_7.toString();
   gameState[getPieceKeyOnBoard(boardId, 1, 9)] = pieceState.IN_SLOT_7.toString();
   gameState[getPieceKeyOnBoard(boardId, 1, 10)] = pieceState.IN_SLOT_5.toString();
   gameState[getPieceKeyOnBoard(boardId, 1, 11)] = pieceState.IN_SLOT_5.toString();
   gameState[getPieceKeyOnBoard(boardId, 1, 12)] = pieceState.IN_SLOT_5.toString();
   gameState[getPieceKeyOnBoard(boardId, 1, 13)] = pieceState.IN_SLOT_5.toString();
   gameState[getPieceKeyOnBoard(boardId, 1, 14)] = pieceState.IN_SLOT_5.toString();
}

// Return state key for player name
function getPlayerNameKey(teamId, playerId)
{
   return 'team' + teamId + '_player' + playerId;
}

// Clear player state
function clearPlayers()
{
   for (var i = 0; i < numTeams; i++) {
      for (var j = 0; j < numPlayersPerTeam; j++) {
         gameState[getPlayerNameKey(i, j)] = 'Empty';
      }
   }
}

function getTotalMoveKey()
{
   return 'totalMoveLeft';
}

function constructTotalMoveMessage(val)
{
   return getTotalMoveKey() + ':' + val.toString();
}

// Return state key for dice value
function getDiceValueKey(diceId)
{
   return 'dice' + diceId + '_value';
}

function getDiceTeamKey()
{
   return 'diceTeam';
}

// Initialize dice state
function initDiceState()
{
   gameState[getDiceValueKey(0)] = '6';
   gameState[getDiceValueKey(1)] = '6';
}

// Return state key for team score
function getTeamScoreKey(teamId)
{
   return 'team' + teamId + '_score';
}

// Initialize team scores
function initTeamScores()
{
   gameState[getTeamScoreKey(0)] = '0';
   gameState[getTeamScoreKey(1)] = '0';
}

// Push all game state to the server
function pushAllGameState()
{
   for (var key in gameState) {
      queueStateUpdate(key, gameState[key]);
   }

   commitQueuedStateUpdates();
}

// Pull all game state from the server
function pullAllGameState()
{
   var all_state = gapi.hangout.data.getState();
   for (var key in all_state) {
      if (key != "started" && key != "history") {
         gameState[key] = all_state[key];
      }
   }
   stateMetaData = gapi.hangout.data.getStateMetadata();
}

// Get key for history updates
function getHistoryUpdateKey()
{
   return 'historyUpdate';
}

// Get the started variable
function getStarted()
{
   return gapi.hangout.data.getValue("started");
}

// Set started variable to 1
function setStarted()
{
   gapi.hangout.data.setValue("started", "started");
}


// Reset the game state
function resetGameState()
{
   for (var board = 0; board < numBoards; board++) {
      clearBoard(board);
      movePiecesToStandardLocations(board);
   }

   initDiceState();
   pushAllGameState();
   var histDiv0 = document.getElementById('historyDiv0');
   var histDiv1 = document.getElementById('historyDiv1');
   histDiv0.innerHTML = histDiv1.innerHTML = ""; 
}

// Initialize the game state to default values
function initGameState()
{
   var started = getStarted();
   if (started != "started") {
      setStarted();
      initTeamScores();
      resetGameState();
      stateMetaData = gapi.hangout.data.getStateMetadata();
   } else {
      pullAllGameState();
   }
}

// Return a string corresponding to the game state
function gameStateToString()
{
   var returnStr = '';

   for (var board = 0; board < numBoards; board++) {
      for (var team = 0; team < numTeams; team++) {
         for (var piece = 0; piece < numPiecesPerBoard; piece++) {
            returnStr += getPieceKeyOnBoard(board, team, piece) + ' = "' +
                         gameState[getPieceKeyOnBoard(board, team, piece)] +
                         '"\n';
         }
      }
   }

   for (var i = 0; i < numTeams; i++) {
      for (var j = 0; j < numPlayersPerTeam; j++) {
         returnStr += getPlayerNameKey(i,j) + ' = "' +
                      gameState[getPlayerNameKey(i, j)] + '"\n';
      }
   }

   for (i = 0; i < numDice; i++) {
      returnStr += getDiceValueKey(i) + ' = "' +
                   gameState[getDiceValueKey(i)] + '"\n';
   }

   for (i = 0; i < numDice; i++) {
      returnStr += getTeamScoreKey(i) + ' = "' +
                   gameState[getTeamScoreKey(i)] + '"\n';
   }

   return returnStr;
}

// Test code
//initGameState();
//print(gameStateToString());
