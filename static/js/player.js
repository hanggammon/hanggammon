function board0TakeTopSeat()
{
   var curPlayer = gapi.hangout.getLocalParticipantId();

   if (!boardFlipped) {
      queueStateUpdate(getPlayerNameKey(1, 0), curPlayer);
   } else {
      queueStateUpdate(getPlayerNameKey(0, 0), curPlayer);
   }

   commitQueuedStateUpdates();
}

function board0TakeBottomSeat()
{
   var curPlayer = gapi.hangout.getLocalParticipantId();

   if (!boardFlipped) {
      queueStateUpdate(getPlayerNameKey(0, 0), curPlayer);
   } else {
      queueStateUpdate(getPlayerNameKey(1, 0), curPlayer);
   }

   commitQueuedStateUpdates();
}

function board1TakeTopSeat()
{
   var curPlayer = gapi.hangout.getLocalParticipantId();

   if (!boardFlipped) {
      queueStateUpdate(getPlayerNameKey(1, 1), curPlayer);
   } else {
      queueStateUpdate(getPlayerNameKey(0, 1), curPlayer);
   }

   commitQueuedStateUpdates();
}

function board1TakeBottomSeat()
{
   var curPlayer = gapi.hangout.getLocalParticipantId();

   if (!boardFlipped) {
      queueStateUpdate(getPlayerNameKey(0, 1), curPlayer);
   } else {
      queueStateUpdate(getPlayerNameKey(1, 1), curPlayer);
   }

   commitQueuedStateUpdates();
}

function getPlayerTeam(playerId) {
   for (var curBoard = 0; curBoard < numBoards; curBoard++) {
      for (var curTeam = 0; curTeam < numTeams; curTeam++) {
         if (playerId.toString() === gameState[getPlayerNameKey(curTeam, curBoard)]) {
            return curTeam;
         }
      }
   }

   // No team
   return 2;
}

function getCurrentPlayerTeam()
{
   return getPlayerTeam(gapi.hangout.getLocalParticipantId());
}

function getTeamColor(teamId)
{
   if (teamId == '0') {
      return '#aa0000';
   } else if (teamId == '1') {
      return '#00aa00';
   }

   return '#000000';
}

function wrapTextWithTeamColors(teamId, msg)
{
   return '<font color=' + getTeamColor(teamId) + '>' + msg + '</font>';
}

function getNameOrEmpty(localID) {
   participant = gapi.hangout.getParticipantById(localID);
   if (participant) {
      return participant.person.displayName;
   }
   return "Empty";
}

function playerStateToDisplay()
{
   var board0TopDiv = document.getElementById('board0TopSeatName');
   var board0BottomDiv = document.getElementById('board0BottomSeatName');
   var board1TopDiv = document.getElementById('board1TopSeatName');
   var board1BottomDiv = document.getElementById('board1BottomSeatName');
   var topStats0Player = document.getElementById('topStats0Player');
   var bottomStats0Player = document.getElementById('bottomStats0Player');
   var topStats1Player = document.getElementById('topStats1Player');
   var bottomStats1Player = document.getElementById('bottomStats1Player');

   var team0Player1 = gameState[getPlayerNameKey(1, 0)];
   var team1Player1 = gameState[getPlayerNameKey(0, 0)];
   var team0Player2 = gameState[getPlayerNameKey(1, 1)];
   var team1Player2 = gameState[getPlayerNameKey(0, 1)];

   if (team0Player1 === undefined || team0Player1 === "undefined") {
      team0Player1 = "Empty";
   } else if (team0Player1 !== "Empty") {
      team0Player1 = getNameOrEmpty(team0Player1).split(" ")[0];
   }
   if (team1Player1 === undefined || team1Player1 === "undefined") {
      team1Player1 = "Empty";
   } else if (team1Player1 !== "Empty")  {
      team1Player1 = getNameOrEmpty(team1Player1).split(" ")[0];
   }
   if (team0Player2 === undefined || team0Player2 === "undefined") {
      team0Player2 = "Empty";
   } else if (team0Player2 !== "Empty")  {
      team0Player2 = getNameOrEmpty(team0Player2).split(" ")[0];
   }
   if (team1Player2 === undefined || team1Player2 === "undefined") {
      team1Player2 = "Empty";
   } else  if (team1Player2 !== "Empty") {
      team1Player2 = getNameOrEmpty(team1Player2).split(" ")[0];
   }

   if (!boardFlipped) {
      board0TopDiv.innerHTML = wrapTextWithTeamColors(1, team0Player1);
      board0BottomDiv.innerHTML = wrapTextWithTeamColors(0, team1Player1);
      board1TopDiv.innerHTML = wrapTextWithTeamColors(1, team0Player2);
      board1BottomDiv.innerHTML = wrapTextWithTeamColors(0, team1Player2);
      topStats0Player.innerHTML = wrapTextWithTeamColors(1, team0Player1 + " Stats");
      bottomStats0Player.innerHTML = wrapTextWithTeamColors(0, team1Player1 + " Stats");
      topStats1Player.innerHTML = wrapTextWithTeamColors(1, team0Player2 + " Stats");
      bottomStats1Player.innerHTML = wrapTextWithTeamColors(0, team1Player2 + " Stats");
   } else {
      board0TopDiv.innerHTML = wrapTextWithTeamColors(0, team1Player1);
      board0BottomDiv.innerHTML = wrapTextWithTeamColors(1, team0Player1);
      board1TopDiv.innerHTML = wrapTextWithTeamColors(0, team1Player2);
      board1BottomDiv.innerHTML = wrapTextWithTeamColors(1, team0Player2);
      topStats0Player.innerHTML = wrapTextWithTeamColors(0, "Stats");
      bottomStats0Player.innerHTML = wrapTextWithTeamColors(1, "Stats");
      topStats1Player.innerHTML = wrapTextWithTeamColors(0, "Stats");
      bottomStats1Player.innerHTML = wrapTextWithTeamColors(1, "Stats");
   }
}
