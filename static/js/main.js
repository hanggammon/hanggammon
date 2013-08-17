function rollDiceTest()
{
   rollDice();
}
function flipBoardClicked()
{
   flipBoard();
   updateDisplayState();
}
function rollDiceEnable()
{
   totalMovesLeft = 0;
   document.getElementById('rollDiceButton').disabled = false;
}

// Sync state update coming from the server
function onStateChange(changeEvent)
{
   var needRedraw = false;

   LogStateClear('Change:');

   // The state in changeEvent contains the complete game state. Using the
   // timestamps we stored in stateMetaData find the entries we need to
   // update.
   for (var key in changeEvent.metadata) {
      LogState(key + ' (' + changeEvent.metadata[key].timestamp + ')');
      if (key in stateMetaData) {
         LogState('(' + stateMetaData[key].timestamp + ')');
      }
      LogState(',');
      if (!(key in stateMetaData) ||
         changeEvent.metadata[key].timestamp != stateMetaData[key].timestamp) {
         LogState('overwriting,');
         if (key == getDiceValueKey(0)) {
            // Disable the roll dice button if there was a dice roll
            document.getElementById('rollDiceButton').disabled = true;
         }
         if (key == getHistoryUpdateKey()) {
            // only update if we haven't seen this exact update
            if (changeEvent.state[key] != gameState[key]) {
               onHistoryUpdate(changeEvent.state[key]);
            }
         } else {
            needRedraw = true;
         }

         gameState[key] = changeEvent.state[key];
      }
   }
   stateMetaData = changeEvent.metadata;
   LogState('Change End<br');

   if (needRedraw) {
      updateDisplayState();
   }
}

function onMessageReceived(messageReceivedEvent)
{
   var message = messageReceivedEvent.message;
   var keyval = message.split(':');

   if (keyval[0] == getMoveDeltaKey()) {
      totalMovesLeft = totalMovesLeft - parseInt(keyval[1], 10);
   } else if (keyval[0] == getTotalMoveKey()) {
      totalMovesLeft = keyval[1];
   }
   
   updateDisplayState();
}


function updateDisplayState()
{
   boardStateToDisplay();
   //stateDiv.innerHTML = gameStateToString();

   var diceVal = gameState[getDiceValueKey(0)];
   var diceLeft = document.getElementById('dice1');
   diceLeft.src = "//hanggammon.appspot.com/img/die" + diceVal + ".png";

   diceVal = gameState[getDiceValueKey(1)];
   var diceRight = document.getElementById('dice2');
   diceRight.src = "//hanggammon.appspot.com/img/die" + diceVal + ".png";

   document.getElementById('movesLeft').innerHTML = totalMovesLeft.toString();
   if (totalMovesLeft === 0) {
      document.getElementById('rollDiceButton').disabled = false;
   } else {
      document.getElementById('rollDiceButton').disabled = true;
   }

   playerStateToDisplay();
   scoreStateToDisplay();
}
