var bufferedHistoryUpdates = "";

function histdiv_add(boardId, teamId, msg)
{
   var histDiv = document.getElementById('historyDiv' + boardId);

   // Team color
   var newContent = wrapTextWithTeamColors(teamId, msg);

   // prepend msg
   newContent += histDiv.innerHTML;

   histDiv.innerHTML = newContent;
}
rmi.Register('HistoryAppend', histdiv_add);

function history_buffer(boardId, rollerId, msg, remote)
{
   // first part of history is the timestamp
   var currentdate = new Date();

   var hours = currentdate.getHours();
   if (hours < 10) {
      hours = "0" + hours;
   }

   var seconds = currentdate.getSeconds();
   if (seconds < 10) {
      seconds = "0" + seconds;
   }

   var minutes = currentdate.getMinutes();
   if (minutes < 10) {
      minutes = "0" + minutes;
   }

   var datetime = hours + ":" + minutes + ":" + seconds;
   var hist = "[" + datetime + "]";

   // append user name
   hist += " " + gapi.hangout.getParticipantById(rollerId).person.displayName;

   // finally the actual message
   hist += " " + msg + "<br>\n";

   if (!remote) {
      histdiv_add(boardId, getPlayerTeam(rollerId), hist);
   } else {
      rmi.SendBroadcast('HistoryAppend', boardId, getPlayerTeam(rollerId), hist);
   }

}
