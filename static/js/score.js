// Function to update the score for the given team
function updateScore(teamId, increment)
{
   var scoreKey = getTeamScoreKey(teamId);

   var newScore = parseInt(gameState[scoreKey], 10) + increment;

   // Don't drop below 0
   if (newScore < 0) {
      return;
   }

   // Commit score update
   queueStateUpdate(scoreKey, newScore.toString());
   commitQueuedStateUpdates();
}

// Increment the score of a team
function incScore(teamId)
{
   return updateScore(teamId, 1);
}

// Decrement the score of a team
function decScore(teamId)
{
   return updateScore(teamId, -1);
}

function topTeamScoreInc()
{
   if (!boardFlipped) {
      incScore(1);
   } else {
      incScore(0);
   }
}

function bottomTeamScoreInc()
{
   if (!boardFlipped) {
      incScore(0);
   } else {
      incScore(1);
   }
}

function topTeamScoreDec()
{
   if (!boardFlipped) {
      decScore(1);
   } else {
      decScore(0);
   }
}

function bottomTeamScoreDec()
{
   if (!boardFlipped) {
      decScore(0);
   } else {
      decScore(1);
   }
}

function scoreStateToDisplay()
{
   var scoreTopDiv = document.getElementById('topTeamScore');
   var scoreBottomDiv = document.getElementById('bottomTeamScore');

   if (!boardFlipped) {
      scoreTopDiv.innerHTML = wrapTextWithTeamColors(1, gameState[getTeamScoreKey(1)]);
      scoreBottomDiv.innerHTML = wrapTextWithTeamColors(0, gameState[getTeamScoreKey(0)]);
   } else {
      scoreTopDiv.innerHTML = wrapTextWithTeamColors(0, gameState[getTeamScoreKey(0)]);
      scoreBottomDiv.innerHTML = wrapTextWithTeamColors(1, gameState[getTeamScoreKey(1)]);
   }
}
