function board0TakeTopSeat()
{
   var curPlayer = gapi.hangout.getLocalParticipant().person.displayName;

   if (!boardFlipped) {
      queueStateUpdate(getPlayerNameKey(1, 0), curPlayer);
   } else {
      queueStateUpdate(getPlayerNameKey(0, 0), curPlayer);
   }

   commitQueuedStateUpdates();
}

function board0TakeBottomSeat()
{
   var curPlayer = gapi.hangout.getLocalParticipant().person.displayName;

   if (!boardFlipped) {
      queueStateUpdate(getPlayerNameKey(0, 0), curPlayer);
   } else {
      queueStateUpdate(getPlayerNameKey(1, 0), curPlayer);
   }

   commitQueuedStateUpdates();
}

function board1TakeTopSeat()
{
   var curPlayer = gapi.hangout.getLocalParticipant().person.displayName;

   if (!boardFlipped) {
      queueStateUpdate(getPlayerNameKey(1, 1), curPlayer);
   } else {
      queueStateUpdate(getPlayerNameKey(0, 1), curPlayer);
   }

   commitQueuedStateUpdates();
}

function board1TakeBottomSeat()
{
   var curPlayer = gapi.hangout.getLocalParticipant().person.displayName;

   if (!boardFlipped) {
      queueStateUpdate(getPlayerNameKey(0, 1), curPlayer);
   } else {
      queueStateUpdate(getPlayerNameKey(1, 1), curPlayer);
   }

   commitQueuedStateUpdates();
}

function getCurrentPlayerTeam()
{
   var curPlayer = gapi.hangout.getLocalParticipant().person.displayName;

   for (var curBoard = 0; curBoard < numBoards; curBoard++) {
      for (var curTeam = 0; curTeam < numTeams; curTeam++) {
         if (curPlayer === gameState[getPlayerNameKey(curTeam, curBoard)]) {
             return curTeam;
         }
      }
   }

   // No team
   return 2;
}

function getTeamColor(teamId)
{
   if (teamId == 0) {
      return '#aa0000';
   } else if (teamId == 1) {
      return '#00aa00';
   }

   return '#000000';
}

function wrapTextWithTeamColors(teamId, msg)
{
   return '<font color=' + getTeamColor(teamId) + '>' + msg + '</font>';
}

function playerStateToDisplay()
{
   var board0TopDiv = document.getElementById('board0TopSeatName');
   var board0BottomDiv = document.getElementById('board0BottomSeatName');
   var board1TopDiv = document.getElementById('board1TopSeatName');
   var board1BottomDiv = document.getElementById('board1BottomSeatName');

   var team0Player1 = gameState[getPlayerNameKey(1, 0)];
   var team1Player1 = gameState[getPlayerNameKey(0, 0)];
   var team0Player2 = gameState[getPlayerNameKey(1, 1)];
   var team1Player2 = gameState[getPlayerNameKey(0, 1)];

   if (team0Player1 == undefined || team0Player1 == "undefined") {
      team0Player1 = "Empty";
   }
   if (team1Player1 == undefined || team1Player1 == "undefined") {
      team1Player1 = "Empty";
   }
   if (team0Player2 == undefined || team0Player2 == "undefined") {
      team0Player2 = "Empty";
   }
   if (team1Player2 == undefined || team1Player2 == "undefined") {
      team1Player2 = "Empty";
   }

   if (!boardFlipped) {
      board0TopDiv.innerHTML = wrapTextWithTeamColors(1, team0Player1);
      board0BottomDiv.innerHTML = wrapTextWithTeamColors(0, team1Player1);
      board1TopDiv.innerHTML = wrapTextWithTeamColors(1, team0Player2);
      board1BottomDiv.innerHTML = wrapTextWithTeamColors(0, team1Player2);
   } else {
      board0TopDiv.innerHTML = wrapTextWithTeamColors(0, team1Player1);
      board0BottomDiv.innerHTML = wrapTextWithTeamColors(1, team0Player1);
      board1TopDiv.innerHTML = wrapTextWithTeamColors(0, team1Player2);
      board1BottomDiv.innerHTML = wrapTextWithTeamColors(1, team0Player2);
   }
}
