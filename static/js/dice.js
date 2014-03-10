function rollDice() {
   client.rollDice(gapi.hangout.getLocalParticipantId());
}

function diceRolled(roller, diceOne, diceTwo) {

   LogDebug("Got " + roller + " " + diceOne + " " + diceTwo);
   var totalMove = diceOne + diceTwo;
   if (diceOne == diceTwo) {
      totalMove = diceOne * 4;
   }
   // There are two players so double the total moves available
   totalMove = totalMove * 2;

   // Grab the key values for dice 1 and 2
   var diceOneKey = getDiceValueKey(0);
   var diceTwoKey = getDiceValueKey(1);
   var team = getPlayerTeam(roller);

   document.getElementById('rollDiceButton').disabled = true;
   if (getCurrentPlayerTeam() !== team) {
      document.getElementById('enableRollButton').disabled = true;
   } else {
      document.getElementById('enableRollButton').disabled = false;
   }

   // add to both boards' history
   history_buffer("0", roller, "rolled " + diceOne.toString() +
                  " " + diceTwo.toString(), false);
   history_buffer("1", roller, "rolled " + diceOne.toString() +
                  " " + diceTwo.toString(), false);

   if (roller === gapi.hangout.getLocalParticipantId()) {
      // send state update to the server
      // Queue update to dice1
      queueStateUpdate(diceOneKey, diceOne.toString());

      // Queue update to dice2
      queueStateUpdate(diceTwoKey, diceTwo.toString());

      // Queue update to dice owning team
      queueStateUpdate(getDiceTeamKey(), getPlayerTeam(roller).toString());

      commitQueuedStateUpdates();
   }

   setTotalMovesLeft(totalMove);
}
rmi.Register('DiceRolled', diceRolled);