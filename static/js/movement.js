function movePiece(boardId, teamId, fromSlot, toSlot)
{
   var movePiece = '';

   // Search gameState to see if teamId has a piece in fromSlot
   for (curPiece = 0; curPiece < numPiecesPerBoard; curPiece++) {
      var state = gameState[getPieceKeyOnBoard(boardId, teamId, curPiece)];
      if (state === fromSlot) {
         movePiece = curPiece;
         break;
      }
   }

   if (movePiece === '') {
      // No piece found XXX: throw exception?
      return;
   }

   // Only let team X pieces to move to HIT_X and PICKED_UP_X
   if (toSlot == pieceState.HIT_0 || toSlot == pieceState.PICKED_UP_0) {
      if (teamId == 1) {
         return;
      }
   }
   if (toSlot == pieceState.HIT_1 || toSlot == pieceState.PICKED_UP_1) {
      if (teamId == 0) {
         return;
      }
   }

   // Queue update the move the piece to its new location
   queueStateUpdate(getPieceKeyOnBoard(boardId, teamId, parseInt(movePiece)),
                    toSlot);

   /*
    * Auto hit detection. Count the number of opposing pieces in toSlot
    * and if there's only one hit it. We don't do this for the HIT* and
    * PICKED_UP* states.
    */
   var opposingTeam = 1 - parseInt(teamId);
   var numOpposingPieces = 0;
   var pieceToHit = -1;
   if (toSlot != pieceState.HIT_0 && toSlot != pieceState.HIT_1 &&
       toSlot != pieceState.PICKED_UP_0 && toSlot != pieceState.PICKED_UP_1) {
      for (var opposingPiece = 0; opposingPiece < numPiecesPerBoard;
           opposingPiece++) {
         state = gameState[getPieceKeyOnBoard(boardId, opposingTeam,
                                              opposingPiece)];
         if (state === toSlot) {
            numOpposingPieces++;
            pieceToHit = opposingPiece;
         }
      }
   }

   if (numOpposingPieces == 1) {
      // Hit the piece
      if (opposingTeam === 0) {
         queueStateUpdate(getPieceKeyOnBoard(boardId, opposingTeam,
                                             parseInt(pieceToHit)),
                          pieceState.HIT_0.toString());
      } else {
         queueStateUpdate(getPieceKeyOnBoard(boardId, opposingTeam,
                                             parseInt(pieceToHit)),
                          pieceState.HIT_1.toString());
      }
   }

   // show movement delta in history
   var deltaStr = "";
   var takeBackStr = "";
   var delta = 0;
   if ((parseInt(fromSlot) >= pieceState.IN_SLOT_0) &&
       (parseInt(fromSlot) <= pieceState.IN_SLOT_23) &&
       (parseInt(toSlot) >= pieceState.IN_SLOT_0) &&
       (parseInt(toSlot) <= pieceState.IN_SLOT_23)) {
      // Move from a regular slot to a regular slot
      delta = Math.abs(fromSlot - toSlot);

      var dice0Val = parseInt(gameState[getDiceValueKey(0)]);
      var dice1Val = parseInt(gameState[getDiceValueKey(1)]);

      if ((delta != dice0Val) && (delta != dice1Val)) {
         // Need to break down the move into sub-dice moves
         if (delta == dice0Val + dice1Val) {
            // Playing the total
            deltaStr = " [" + dice0Val + " + " + dice1Val + "] ";
         } else if (dice0Val == dice1Val) {
            // Doubles, see if the play is 3x or 4x
            if (delta == dice0Val * 3) {
               deltaStr = " [" + dice0Val + " + " + dice0Val + " + " +
                          dice0Val + "]";
            } else if (delta == dice0Val * 4) {
               deltaStr = " [" + dice0Val + " + " + dice0Val + " + " +
                          dice0Val + " + " + dice0Val + "]";
            } else {
               deltaStr = " [" + delta + "] ";
            }
         }
      } else {
         // Simply moving a dice value
         deltaStr = " [" + delta + "] ";
      }

      // Determine if the move is a takeback
      if (getCurrentPlayerTeam() == 0) {
         if (parseInt(fromSlot) > parseInt(toSlot)) {
            takeBackStr = " > Take back < ";
	    delta = delta * -1;
         }
      } else {
         if (parseInt(toSlot) > parseInt(fromSlot)) {
            takeBackStr = " > Take back < ";
	    delta = delta * -1;
         }
      }
   } else if ((parseInt(toSlot) == pieceState.PICKED_UP_0) ||
              (parseInt(toSlot) == pieceState.PICKED_UP_1)) {
      // Pickup move, display base slot number
      if (teamId == 0) {
         if ((parseInt(fromSlot) <= pieceState.IN_SLOT_23) &&
             (parseInt(fromSlot) >= pieceState.IN_SLOT_18)) {
	    delta = 24 - parseInt(fromSlot);
            deltaStr = " [" + delta + "] ";
         }
      } else {
         if ((parseInt(fromSlot) <= pieceState.IN_SLOT_5) &&
             (parseInt(fromSlot) >= pieceState.IN_SLOT_0)) {
	    delta = parseInt(fromSlot) + 1;
            deltaStr = " [" + delta + "] ";
         }
      }
   } else if ((parseInt(fromSlot) == pieceState.HIT_0) ||
              (parseInt(fromSlot) == pieceState.HIT_1)) {
      // Bringing a hit piece back in, display base slot number
      if (teamId == 0) {
         if ((parseInt(toSlot) <= pieceState.IN_SLOT_5) &&
             (parseInt(toSlot) >= pieceState.IN_SLOT_0)) {
	    delta = parseInt(toSlot) + 1;
            deltaStr = " [" + delta + "] ";
         }
      } else {
         if ((parseInt(toSlot) <= pieceState.IN_SLOT_23) &&
            (parseInt(toSlot) >= pieceState.IN_SLOT_18)) {
	    delta = 24 - parseInt(toSlot);
            deltaStr = " [" + delta + "] ";
         }
      }
   }

   totalMovesLeft = totalMovesLeft - delta;
   if (totalMovesLeft === 0) {
      updateDisplayState();
   }
   gapi.hangout.data.sendMessage(constructMoveDeltaMessage(delta));

   // show hits in history
   var hitStr;
   if (numOpposingPieces == 1) {
      hitStr = " (HIT) ";
   } else {
      hitStr = "";
   }

   history_buffer(boardId, getCurrentPlayerTeam(), " from " +
                  slotToString(fromSlot) + " to " + slotToString(toSlot) +
                  hitStr + deltaStr + takeBackStr);
   history_queue();

   // send state update to the server
   commitQueuedStateUpdates();
}
