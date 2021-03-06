// This is the main configurable option... All other sizes based on the piece size.
var piece = 30;

var triangleBase = piece + 1;
var boardMiddle = triangleBase + 2;
var boardMiddleMargin = boardMiddle / 2;
var boardWidth = triangleBase * 12 + boardMiddle;
var boardHeight = triangleBase * 15;

// X coordinate where the left half begins
var leftHalfMinXCoord = piece + 1;
// X coordinate where the left half ends
var leftHalfMaxXCoord = leftHalfMinXCoord + (boardWidth / 2) - (boardMiddle / 2);
// X coordinate where the right half begins
var rightHalfMinXCoord = leftHalfMaxXCoord + boardMiddle;
// X coordinate where the right half ends
var rightHalfMaxXCoord = rightHalfMinXCoord + (boardWidth / 2) - (boardMiddle / 2);

// Locally selected board/slot number (-1 means nothing is selected)
var selectedBoard = -1;
var selectedSlot = -1;

// Whether the board is flipped or not
var boardFlipped = false;

// Transformation table for going from slots to their flipped equivalents
var flippedSlots = [pieceState.IN_SLOT_12,  // IN_SLOT_0
                    pieceState.IN_SLOT_13,  // IN_SLOT_1
                    pieceState.IN_SLOT_14,  // IN_SLOT_2
                    pieceState.IN_SLOT_15,  // IN_SLOT_3
                    pieceState.IN_SLOT_16,  // IN_SLOT_4
                    pieceState.IN_SLOT_17,  // IN_SLOT_5
                    pieceState.IN_SLOT_18,  // IN_SLOT_6
                    pieceState.IN_SLOT_19,  // IN_SLOT_7
                    pieceState.IN_SLOT_20,  // IN_SLOT_8
                    pieceState.IN_SLOT_21,  // IN_SLOT_9
                    pieceState.IN_SLOT_22,  // IN_SLOT_10
                    pieceState.IN_SLOT_23,  // IN_SLOT_11
                    pieceState.IN_SLOT_0,   // IN_SLOT_12
                    pieceState.IN_SLOT_1,   // IN_SLOT_13
                    pieceState.IN_SLOT_2,   // IN_SLOT_14
                    pieceState.IN_SLOT_3,   // IN_SLOT_15
                    pieceState.IN_SLOT_4,   // IN_SLOT_16
                    pieceState.IN_SLOT_5,   // IN_SLOT_17
                    pieceState.IN_SLOT_6,   // IN_SLOT_18
                    pieceState.IN_SLOT_7,   // IN_SLOT_19
                    pieceState.IN_SLOT_8,   // IN_SLOT_20
                    pieceState.IN_SLOT_9,   // IN_SLOT_21
                    pieceState.IN_SLOT_10,  // IN_SLOT_22
                    pieceState.IN_SLOT_11,  // IN_SLOT_23
                    pieceState.HIT_1,       // HIT_0
                    pieceState.HIT_0,       // HIT_1
                    pieceState.PICKED_UP_1, // PICKED_UP_0
                    pieceState.PICKED_UP_0];// PICKED_UP_1

function initGraphicalBoardEventHandlers()
{
  var board0 = document.getElementById('board0');
  var board1 = document.getElementById('board1');

  board0.addEventListener("mousedown", mouseDownListenerZero, false);
  board1.addEventListener("mousedown", mouseDownListenerOne, false);
}

function makeZeroFilledIntArray(length)
{
  var arr = [], i = length;
  while (i--) {
    arr[i] = 0;
  }
  return arr;
}

/*
 * Given (x,y) coordinates, map it to a slot. We divide each half of the
 * board to 12 sections (6 on top and 6 in the bottom)
 */
function getSlotFromCoordinates(x, y)
{
   if (x > rightHalfMinXCoord && x < rightHalfMaxXCoord) { // Right half
      if (y < (boardHeight / 2)) { // Top side
         // 6, 7, 8, 9, 10, 11
         return 6 + Math.floor((x - rightHalfMinXCoord) / triangleBase);
      } else if (y >= (boardHeight / 2)) { // Bottom side
         // 17, 16, 15, 14, 13, 12
         return 12 + 5 - Math.floor((x - rightHalfMinXCoord) / triangleBase);
      }
   } else if (x > leftHalfMinXCoord && x < leftHalfMaxXCoord) { // Left half
      if (y < (boardHeight / 2)) { // Top side
         // 0, 1, 2, 3, 4, 5
         return Math.floor((x - leftHalfMinXCoord) / triangleBase);
      } else if (y >= (boardHeight / 2)) { // Bottom side
         // 23, 22, 21, 20, 19, 18
         return 18 + 5 - Math.floor((x - leftHalfMinXCoord) / triangleBase);
      }
   }

   if (x > leftHalfMaxXCoord && x < rightHalfMinXCoord) {
      // Click is on the middle margin, select the HIT pieces
      if (y < boardHeight / 2) {
         return pieceState.HIT_0;
      } else {
         return pieceState.HIT_1;
      }
   }

   // Outside margins, pieces that are picked up
   if (x <= leftHalfMinXCoord) {
      return pieceState.PICKED_UP_0;
   } else if (x >= rightHalfMaxXCoord) {
      return pieceState.PICKED_UP_1;
   }
}

/*
 * Given a slot number, get the (x1,y1,x2,y2) coordinates of the bounding box(es)
 * for the slot. Most slots have a single bounding box, whereas PICKED_UP has
 * two.
 */
function getCoordinatesFromSlot(slot)
{
   var retArr = [];
   var ret1 = {x1: -1, y1: -1, x2: -1, y2: -1};
   retArr.push(ret1);

   if (slot < 12) { // top side
      if (slot < 6) { // left side
         ret1.x1 = leftHalfMinXCoord + triangleBase * slot;
         ret1.x2 = leftHalfMinXCoord + triangleBase * (slot + 1);
      } else { // right side
         ret1.x1 = rightHalfMinXCoord + triangleBase * (slot - 6);
         ret1.x2 = rightHalfMinXCoord + triangleBase * (slot - 6 + 1);
      }

      ret1.y1 = 0;
      ret1.y2 = boardHeight / 2;
   } else if (slot < 24) { // bottom side
      if (slot > 17) { // left side
         ret1.x1 = leftHalfMinXCoord + triangleBase * (23 - slot);
         ret1.x2 = leftHalfMinXCoord + triangleBase * (23 - slot + 1);
      } else { // right side
         ret1.x1 = rightHalfMinXCoord + triangleBase * (17 - slot);
         ret1.x2 = rightHalfMinXCoord + triangleBase * (17 - slot + 1);
      }

      ret1.y1 = boardHeight / 2;
      ret1.y2 = boardHeight;
   } else if (slot == pieceState.HIT_0) {
      // bouding box of the middle/top section
      ret1.x1 = leftHalfMaxXCoord;
      ret1.x2 = rightHalfMinXCoord;
      ret1.y1 = 0;
      ret1.y2 = boardHeight / 2;
   } else if (slot == pieceState.HIT_1) {
      // bouding box of the middle/bottom section
      ret1.x1 = leftHalfMaxXCoord;
      ret1.x2 = rightHalfMinXCoord;
      ret1.y1 = boardHeight / 2;
      ret1.y2 = boardHeight;
   } else if (slot == pieceState.PICKED_UP_0) {
      // bounding box of the left collection area
      ret1.x1 = 0;
      ret1.x2 = leftHalfMinXCoord;
      ret1.y1 = 0;
      ret1.y2 = boardHeight;
   } else if (slot == pieceState.PICKED_UP_1) {
      // bounding box of the right collection area
      ret1.x1 = rightHalfMaxXCoord;
      ret1.x2 = rightHalfMaxXCoord + piece;
      ret1.y1 = 0;
      ret1.y2 = boardHeight;
   }

   return retArr;
}

function drawPiece(context, middleX, middleY)
{
   context.beginPath();
   context.arc(middleX, middleY, piece * 0.5, 0, 2 * Math.PI, false);
   context.fill();
   context.stroke();
   context.closePath();
}

function drawTriangle(context, baseX, baseY, upwards)
{
   context.beginPath();

   context.moveTo(baseX, baseY);
   context.lineTo(baseX + piece, baseY);
   if (upwards === true) {
      context.lineTo(baseX + piece / 2, baseY - piece * 5);
   } else {
      context.lineTo(baseX + piece / 2, baseY + piece * 5);
   }
   context.lineTo(baseX, baseY);

   context.fill();
   context.stroke();

   context.closePath();
}

function drawSlotNumber(context, baseX, baseY, upwards, slotNumber, width, height) {
   var tipX, tipY;

   context.save();

   if (boardFlipped) {
      context.translate(width, height);
      context.rotate(Math.PI);

      if (boardFlipped) {
         if (slotNumber <= 11) {
            slotNumber += 12;
         } else {
            slotNumber = (slotNumber + 12) % 24;
         }
      }
   }
   context.fillStyle = '#000000';

   if (upwards === true) {
      tipX = baseX + piece / 2 - 2;
      tipY = baseY - piece * 5 - 2;
   } else {
      tipX = baseX + piece / 2 - 2;
      tipY = baseY + piece * 5 + 10;
   }

   context.fillText("" + slotNumber, tipX, tipY);
   context.restore();
}


// Show a dice guide with the given offset to selectedSlot
function showDiceGuide(context, guideOffset)
{
   var guideSlot;

   if (getCurrentPlayerTeam() === 0) {
      guideSlot = selectedSlot + guideOffset;
   } else {
      guideSlot = selectedSlot - guideOffset;
   }

   if (guideSlot >= pieceState.IN_SLOT_0 && guideSlot <= pieceState.IN_SLOT_23) {
      var coords = getCoordinatesFromSlot(guideSlot);
      for (var j = 0; j < coords.length; j++) {
         context.strokeRect(coords[j].x1,
                            coords[j].y1,
                            coords[j].x2 - coords[j].x1,
                            coords[j].y2 - coords[j].y1);
      }
   }
}

function boardStateToDisplay()
{
   var boards = [];
   boards[0] = document.getElementById('board0');
   boards[1] = document.getElementById('board1');
   var j, middleOffset;

   for (var i = 0; i < boards.length; i++) {

      var context = boards[i].getContext("2d");
      if (context) {
         boards[i].width = boardWidth + 2 * piece + 2; // leave "piece + 1" on each side
         boards[i].height = boardHeight;

         // Set the style properties.
         context.strokeStyle = '#000000';
         context.lineWidth = 1;

         // Flip the board if configured to do so
         if (boardFlipped === true) {
            /*
             * Since rotation happens around origin (0,0) ie. top left corner,
             * we need to translate the context to the bottom right corner of
             * the canvas first, so the rotation will bring the context back
             * into the canvas.
             */
            context.translate(boards[i].width, boards[i].height);
            context.rotate(Math.PI);
         }

         // Draw board borders
         context.strokeRect(leftHalfMinXCoord, 0, boardWidth, boardHeight);

         // Fill red pickup zone
         context.fillStyle = '#ffe5e5';
         context.fillRect(0, 0, leftHalfMinXCoord, boardHeight);

         // Fill green pickup zone
         context.fillStyle = '#e5ffe5';
         context.fillRect(rightHalfMaxXCoord, 0, boards[i].width, boardHeight);

         // top triangles
         for (j = 0; j < 12; j++) {

            // alternate black and white
            if (j % 2 === 0) {
               context.fillStyle = '#ffffff';
            } else {
               context.fillStyle = '#000000';
            }

            // middle of board offset
            middleOffset = Math.floor(j / 6) * boardMiddle;

            drawTriangle(context,
                         leftHalfMinXCoord + piece * j + middleOffset + j, // baseX
                         0,                                                // baseY
                         false);                                           // downwards

            drawSlotNumber(context,
                           leftHalfMinXCoord + piece * j + middleOffset + j, // baseX
                           0,                                                // baseY
                           false, j,                                         // downwards
                           boards[i].width, boards[i].height);
         }

         // bottom triangles and slot #
         for (j = 0; j < 12; j++) {

            // alternate black and white
            if (j % 2 === 1) {
               context.fillStyle = '#ffffff';
            } else {
               context.fillStyle = '#000000';
            }

            // middle of board offset
            middleOffset = Math.floor(j / 6) * boardMiddle;

            drawTriangle(context,
                         leftHalfMinXCoord + piece * j + middleOffset + j, // baseX
                         boardHeight,                                      // baseY
                         true);                                            // upwards

            drawSlotNumber(context, leftHalfMinXCoord + piece * j + middleOffset + j,
                           boardHeight, true, 23 - j, boards[i].width, boards[i].height);
         }

         // middle
         context.fillStyle = '#000000';
         context.fillRect(leftHalfMinXCoord + boardWidth / 2 - boardMiddle / 2 + boardMiddleMargin / 2,
                          0,
                          boardMiddle - boardMiddleMargin,
                          boardHeight);

         var numPiecesPerSlot = makeZeroFilledIntArray(pieceState.NUM_STATES);

         // draw pieces
         for (j = 0; j < 2; j++) {
            context.fillStyle = getTeamColor(j);

            for (var k = 0; k < numPiecesPerBoard; k++) {
               var stateString = gameState[getPieceKeyOnBoard(i, j, k)];
               if (stateString !== undefined) {
                  var stateInt = parseInt(stateString, 10);
                  if (stateInt <= 11) { // one side of board
                     middleOffset = Math.floor(stateInt / 6) * boardMiddle;
                     drawPiece(context,
                               leftHalfMinXCoord + piece * (stateInt + 0.5) + middleOffset + stateInt,
                               piece * (numPiecesPerSlot[stateInt] + 0.5));
                     numPiecesPerSlot[stateInt]++;
                  } else if (stateInt <= 23) { // other side of board
                     var remapped = Math.abs(stateInt - 23);
                     middleOffset = Math.floor(remapped / 6) * boardMiddle;
                     drawPiece(context,
                               leftHalfMinXCoord + piece * (remapped + 0.5) + middleOffset + remapped,
                               boardHeight - piece * (numPiecesPerSlot[stateInt] + 0.5));
                     numPiecesPerSlot[stateInt]++;
                  } else if (stateInt === pieceState.HIT_0) {
                     drawPiece(context,
                               leftHalfMinXCoord + boardWidth / 2,
                               (boardHeight / 2) - piece * (numPiecesPerSlot[stateInt] + 1));
                     numPiecesPerSlot[stateInt]++;
                  } else if (stateInt === pieceState.HIT_1) {
                     drawPiece(context,
                               leftHalfMinXCoord + boardWidth / 2,
                               (boardHeight / 2) + piece * (numPiecesPerSlot[stateInt] + 1));
                     numPiecesPerSlot[stateInt]++;
                  } else if (stateInt === pieceState.PICKED_UP_0) { // left team
                     drawPiece(context,
                               piece * 0.5,
                               piece * (numPiecesPerSlot[stateInt] + 0.5));
                     numPiecesPerSlot[stateInt]++;
                  } else if (stateInt === pieceState.PICKED_UP_1) { // right team
                     drawPiece(context,
                               rightHalfMaxXCoord + piece * 0.5,
                               piece * (numPiecesPerSlot[stateInt] + 0.5));
                     numPiecesPerSlot[stateInt]++;
                  }
               }
            }
         }

         // bounding box around selected slot(s)
         if (selectedSlot >= 0) {
            if (selectedBoard == i) {
               context.strokeStyle = '#ff0000';
               var coords = getCoordinatesFromSlot(selectedSlot);
               for (j = 0; j < coords.length; j++) {
                  context.strokeRect(coords[j].x1,
                                     coords[j].y1,
                                     coords[j].x2 - coords[j].x1,
                                     coords[j].y2 - coords[j].y1);
               }

               // Show guides for the current dice values
               if (selectedSlot != pieceState.HIT_0 && selectedSlot != pieceState.HIT_1 &&
                   selectedSlot != pieceState.PICKED_UP_0 && selectedSlot != pieceState.PICKED_UP_1) {
                  context.strokeStyle = '#7694bd';
                  var dice0Val = parseInt(gameState[getDiceValueKey(0)], 10);
                  var dice1Val = parseInt(gameState[getDiceValueKey(1)], 10);

                  // Dice guides for dice 0 and 1
                  showDiceGuide(context, dice0Val);
                  showDiceGuide(context, dice1Val);

                  // Dice guide for the total
                  showDiceGuide(context, dice0Val + dice1Val);

                  // If the roll is a double show guides for 3x and 4x as well
                  if (dice0Val == dice1Val) {
                     showDiceGuide(context, 3 * dice0Val);
                     showDiceGuide(context, 4 * dice0Val);
                  }
               }
            }
         }
      }
   }
}

// Flip the board
function flipBoard()
{
   boardFlipped = !boardFlipped;
}

// Returns true if the game state change requires a redraw
function handleSelectedSlot(boardId, newSlot)
{
   if (newSlot == selectedSlot) {
      if (selectedBoard == boardId) { // this board was already selected
         // Same slot selected, clear selections
         selectedBoard = -1;
         selectedSlot = -1;
         return true;
      } else { // other board was selected, switch to this board
         selectedBoard = boardId;
         return true;
      }
   } else { // different slot selected
      if (selectedBoard == boardId) { // this board was already selected
         if (selectedSlot == -1) { // First time selection
            selectedBoard = boardId;
            selectedSlot = newSlot;
            return true;
         } else { // movement!
            /*
             * XXX: this is super lame - try moving for both teams. This needs
             *      to be fixed when we know the current player's teamId
             */
            movePiece(boardId.toString(), "0", selectedSlot.toString(),
                      newSlot.toString());
            movePiece(boardId.toString(), "1", selectedSlot.toString(),
                      newSlot.toString());

            // Clear selections
            selectedBoard = -1;
            selectedSlot = -1;

            // No need for redraw, game state update from server will trigger it
            // if necessary
            return false;
         }
      } else { // other board was selected, switch to this board
         selectedBoard = boardId;
         selectedSlot = newSlot;
         return true;
      }
   }

   return false;
}

function mouseDownListenerZero(e)
{
   if (getCurrentPlayerTeam().toString() != gameState[getDiceTeamKey()]) {
      /* Not this player's turn, ignore any move attempts */
      return;
   }

   var newSlot = getSlotFromCoordinates(e.offsetX, e.offsetY);

   if (boardFlipped === true) {
      newSlot = flippedSlots[newSlot];
   }

   if (handleSelectedSlot(0, newSlot)) {
      boardStateToDisplay();
   }
}

function mouseDownListenerOne(e)
{
   if (getCurrentPlayerTeam().toString() != gameState[getDiceTeamKey()]) {
      /* Not this player's turn, ignore any move attempts */
      return;
   }

   var newSlot = getSlotFromCoordinates(e.offsetX, e.offsetY);

   if (boardFlipped === true) {
      newSlot = flippedSlots[newSlot];
   }

   if (handleSelectedSlot(1, newSlot)) {
      boardStateToDisplay();
   }
}
