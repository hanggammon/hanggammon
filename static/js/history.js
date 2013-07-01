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

function onHistoryUpdate(updateStr)
{
   // Split updateStr into lines
   var lines = updateStr.split("\n");
   for (var i = 0; i < lines.length - 1; i++) {
      var line = lines[i];
      var board = line.substring(0, 1)
      var team = line.substring(1, 2)
      var message = line.substring(2)
      histdiv_add(board, team, message);
   }
}

function history_buffer(boardId, teamId, msg)
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
   hist += " " + gapi.hangout.getLocalParticipant().person.displayName;

   // finally the actual message
   hist += " " + msg + "<br>\n";

   bufferedHistoryUpdates += (boardId + teamId + hist);
}

function history_queue()
{
   queueStateUpdate(getHistoryUpdateKey(), bufferedHistoryUpdates);
   bufferedHistoryUpdates = "";
}
