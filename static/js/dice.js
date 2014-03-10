function rollDice() {
   client.rollDice(getCurrentPlayerTeam().toString());
}

function diceRolled(team, diceOne, diceTwo) {

   LogDebug("Got " + team + " " + diceOne + " " + diceTwo);
   var totalMove = diceOne + diceTwo;
   if (diceOne == diceTwo) {
      totalMove = diceOne * 4;
   }
   // There are two players so double the total moves available
   totalMove = totalMove * 2;

   // Grab the key values for dice 1 and 2
   var diceOneKey = getDiceValueKey(0);
   var diceTwoKey = getDiceValueKey(1);

   document.getElementById('rollDiceButton').disabled = true;

   // Queue update to dice1
   queueStateUpdate(diceOneKey, diceOne.toString());

   // Queue update to dice2
   queueStateUpdate(diceTwoKey, diceTwo.toString());

   // Queue update to dice owning team
   queueStateUpdate(getDiceTeamKey(), team);

   // add to both boards' history
   history_buffer("0", getCurrentPlayerTeam(), "rolled " + diceOne.toString() +
                  " " + diceTwo.toString());
   history_buffer("1", getCurrentPlayerTeam(), "rolled " + diceOne.toString() +
                  " " + diceTwo.toString());
   history_queue();

   // send state update to the server
   commitQueuedStateUpdates();

   setTotalMovesLeft(totalMove);
}
rmi.Register('DiceRolled', diceRolled);