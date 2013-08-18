/*
 * messagebox.js --
 *
 *    Lossless messagebox on top of the google hangout API state object. The
 *    messagebox is based on 'private' state fields for each participant. As an
 *    example if there are four participants A, B, C, D then we will create a
 *    messagebox for each connection A->B, A->C, A->D, B->A, B->C, and so on.
 *    We maintain two states for each messagebox in the global state. The first
 *    state is the messages state itself. It is only written to by the source
 *    of a message. The second state serves as an acknowledge transmit. Each
 *    message gets tagged with a continuously increasing sequence number. A
 *    message will not get deleted out of the message state queue until the ack
 *    field contains a sequence number of equal or higher value. Finally in
 *    order properly announce participants each participant writes a special
 *    key into the game state. Upon discovering the key the message box in the
 *    other participants browser will create new connections.
 */

/* This file uses eval, suppress the jshint complaints about it */
/*jshint evil:true */

var localParticipant;
var mbNewKey = 'mb_new_participant'; // const
var mbMessageKey = 'mb_message';
var mbAckKeyPrefix = 'mb_ack';

// Array of participants to sequence numbers
var knownParticipants = [];
// Array of participants indexing to an array of messages queued for each
// participant
var messages = [];
// Array of participants with latest sequence seen
var lastSequenceSeen = [];

/*
 * mbCreate --
 *
 *    Create a new mailbox for the given participant.
 */
function mbCreate(participant)
{
   lastSequenceSeen[participant] = -1;
   knownParticipants[participant] = 0;
   messages[participant] = [];
}


/*
 * mbAckKey --
 *
 *    Create a message box acknowledgement key for the given parameters.
 */
function mbAckKey(to)
{
   return mbAckKeyPrefix + ':' + to + ':' + localParticipant;
}


/*
 * mbAck --
 *
 *    Send an ack to participant to for the given seq no.
 */
function mbAck(to, seq)
{
   /* Send ack back with the latest seq no received */
   var msg = seq.toString();
   LogMB('Queueing ' + mbAckKey(to) + '=' + seq.toString());
   queueStateUpdate(mbAckKey(to), seq.toString());
   commitQueuedStateUpdates();
}


/*
 * mbProcessMessage --
 *
 *    Process the payload of a message.
 */
function mbProcessMessage(str)
{
   var msg = JSON.parse(str);

   if (msg.op == 'mb_rpc') {
      LogMB('Evaluating: "' + msg.call + '"');
      eval(msg.call);
   } else {
      LogMB('Unknown message op: ' + msg.op);
   }
}


/*
 * mbProcessKey --
 *
 *    Called during onStateChange. Determines whether the given key is a
 *    messagebox key and processes the key if it is.
 *
 * Return Value:
 *    true if the key should get stored in gameState, false otherwise.
 */
function mbProcessKey(key, data)
{
   var keyval = key.split(':');
   var participant;
   var latestSeq;
   var to, from, m, p;

   if (keyval[0] == mbNewKey) {
      participant = keyval[1];

      if (participant != localParticipant &&
          !(participant in knownParticipants)) {
         LogMB('New participant: ' + participant);
         mbCreate(participant);
      }
      return false;
   } else if (keyval[0] == mbMessageKey) {
      to = keyval[1];
      
      if (to == localParticipant) {
         /* Message is for us */
         
         from = keyval[2];
         //LogMB('Got: ' + data + ' from ' + from);
         var msgArray = JSON.parse(data);

         latestSeq = -1;
         for (m in msgArray) {
            p = JSON.parse(msgArray[m]);
            if (p !== null) {
               if (p.sequence > lastSequenceSeen[from]) {
                  mbProcessMessage(p.str);
                  if (latestSeq < p.sequence) {
                     latestSeq = p.sequence;
                  }
               }
            }
         }
         if (latestSeq != -1 && latestSeq > lastSequenceSeen[from]) {
            lastSequenceSeen[from] = latestSeq;
            /* Send ack back with the latest seq no received */
            mbAck(from, latestSeq);
            LogMB('New lastSequence[' + from + ']=' + lastSequenceSeen[from].toString());
         }
      }
      return false;
   } else if (keyval[0] == mbAckKeyPrefix) {
      to = keyval[1];

      if (to == localParticipant) {
         from  = keyval[2];
         latestSeq = parseInt(data, 10);
         var newArray = [];

         for (m in messages[from]) {
            p = JSON.parse(messages[from][m]);
            if (p.sequence > latestSeq) {
               newArray[m] = messages[from][m];
            } else {
               LogMB("Deleting " + m + ' from message array');
            }
         }
         messages[from] = newArray;
      }
      return false;
   }

   return true;
}


/*
 * mbMessage --
 *
 *    Serialize the given message after embedding it into a message object and
 *    send it to the given participant.
 */
function mbMessage(participant, str, commit)
{
   var seq;
   var message;
   commit = typeof commit !== 'undefined' ? commit : true;

   // Hopefully the race between reading sequence and incrementing
   // knownParticipants is small enough to not matter
   key = mbMessageKey + ':' + participant + ':' + localParticipant;
   seq = knownParticipants[participant];
   knownParticipants[participant]++;

   message = { 'sequence':seq, 'str':str };
   messages[participant][seq.toString()] = JSON.stringify(message);
   queueStateUpdate(key, JSON.stringify(messages[participant]));
   LogMB('Queued message: ' + key + '=' +
         JSON.stringify(messages[participant]));
   if (commit) {
      commitQueuedStateUpdates();
   }
}


/*
 * mbMessageBC --
 *
 *    Send the given message to all known participants.
 */
function mbMessageBC(str)
{
   for (var participant in knownParticipants) {
      mbMessage(participant, str, false);
   }
   commitQueuedStateUpdates();
}


/*
 * mbBroadcastRPC --
 *
 *    Remotely execute 'str' on all available participants.
 */
function mbBroadcastRPC(str, evalLocal)
{
   var msg = { 'op':'mb_rpc', 'call':str };
   evalLocal = typeof evalLocal !== 'undefined' ? evalLocal : false;

   if (evalLocal) {
      eval(str);
   }
   mbMessageBC(JSON.stringify(msg));
}


/*
 * mbRPC --
 *
 *    Remotely execute 'str' on the given participant.
 */
function mbRPC(to, str)
{
   var msg = { 'op':'mb_rpc', 'call':str };

   mbMessage(to, JSON.stringify(msg), true);
}


/*
 * mbAnnounce --
 *
 *    Write the given participant ID into the global state as a new key.
 */
function mbAnnounce(participantID)
{
   var key = mbNewKey + ':' + participantID;
   queueStateUpdate(key, 'true');
   commitQueuedStateUpdates();
   LogMB('Announced ' + key);
}


/*
 * mbInit --
 *
 *    Initialize global messagebox state and announce ourselves.
 */
function mbInit()
{
   localParticipant = gapi.hangout.getLocalParticipant().person.id;
   LogMB('localParticipant=' + localParticipant);
   mbAnnounce(localParticipant);
}


/* Test Code */
var maxTestMessage = 10;
var messagesReceived = [];

/*
 * mbTestRPC --
 *
 *    Called by mbTest. Record the number of times mbTestRPC was called for a
 *    given source. If the count reaches maxTestMessage then send a reply back.
 */
function mbTestRPC(from)
{
   LogMB('mbTestRPC: ' + from);
   if (from in messagesReceived) {
      messagesReceived[from]++;
   } else {
      messagesReceived[from] = 1;
   }
   if (messagesReceived[from] == maxTestMessage) {
      if (!(from in knownParticipants)) {
         alert(from + ' not in knownParticipants');
      }
      messagesReceived[from] = 0;
      mbRPC(from, 'alert("got em");');
   }
}


/*
 * mbTest --
 *
 *    Send a message to all participants.
 */
function mbTest()
{
   for (var i = 0; i < maxTestMessage; i++) {
      mbBroadcastRPC('mbTestRPC("' + localParticipant.toString() + '");');
   }
}
