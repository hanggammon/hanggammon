function zeroFillArray(arr, length) {
   for (var i=0; i<length; i++) {
      if (arr[i] === undefined) {
         arr[i] = 0;
      }
   }
}

// Creates a shallow clone of an array
function cloneArray(arr) {
   return arr.slice(0);
}

function diceStringToNumberArray(dices) {
   var arr = dices.split(",");
   for (var i=0; i<arr.length; i++) {
      arr[i] = parseInt(arr[i], 10);
   }

   return arr;
}

function mergeSet(destination, source) {
   for (var element in source) {
      if (source.hasOwnProperty(element)) {
         destination[element] = source[element];
      }
   }
}

// Returns a list of possible dice combinations that add up to number
function getDiceCombinations(number, singleOnly) {

   var combos = { };
   for (var dice0=1; dice0<7; dice0++) {
      for (var dice1=1; dice1<7; dice1++) {
         // 1 - 1 2 3 4 5 6
         // 2 - 1 2 3 4 5 6
         // 3 - 1 2 3 4 5 6
         // 4 - 1 2 3 4 5 6
         // 5 - 1 2 3 4 5 6
         // 6 - 1 2 3 4 5 6
         if (dice0 === number) {
            combos[dice0 + "," + dice1] = true;
         }
         if (dice1 === number) {
            combos[dice0 + "," + dice1] = true;
         }
         if (singleOnly) {
            continue;
         }
         if (dice0 + dice1 === number) {
            combos[dice0 + "," + dice1] = true;
         }
         if (dice0 === dice1) {
            // generate double rolls
            if (3 * dice0 === number) {
               combos[dice0 + "," + dice1 + "," + dice0] = true;
            }
            if (4 * dice0 === number) {
               combos[dice0 + "," + dice1 + "," + dice0 + "," + dice1] = true;
            }
         }
      }
   }
   return combos;
}

function movePossible(hitteeBoard, dice, startingPosition, range, team0) {
   // dice is a string "<dice0>,<dice1>,..."
   var dices = diceStringToNumberArray(dice);

   // Could be a single hitter let's check.
   if (dices[0] === range || dices[1] === range) {
      //console.log("true for single " + dices);
      return true;
   }

   var hop = startingPosition
   for (var i=0; i<dices.length; i++) {
      //console.log("start " + startingPosition + " hop + " + hop + " dice roll " + dices[i] + " board " +
      //            hitteeBoard[hop]);
      if (team0) {
         hop -= dices[i];
      } else {
         hop += dices[i];
      }
      if (hitteeBoard[hop] > 1) {
         //console.log("No hit for " + dices + " because of " + hop);
         break;
      }
   }

   if (i === dices.length) {
      // Didn't break so we found a winning combo
      //console.log("true for " + dices);
      return true;
   }
   // Try dices the other way around
   hop = startingPosition
   for (var i=0; i<dices.length; i++) {
      //console.log("start " + startingPosition + " hop + " + hop + " dice roll " + dices[i] + " board " +
      //            hitteeBoard[hop]);
      if (team0) {
         hop -= dices[dices.length - 1 - i];
      } else {
         hop += dices[dices.length - 1 - i];
      }
      if (hitteeBoard[hop] > 1) {
         //console.log("No hit for " + dices + " because of " + hop);
         return false;
      }
   }
   //console.log("True for " + dices);
   return true;
}


// Find possible hitting dice combinations
function findHitsForPosition(hitteeBoard, hitterBoard, position, team0) {
   var allCombos = {};

   //console.log("Looking at " + position);
   for (var i=1; i<24; i++) {
      var field;

      if (team0) {
         field = position + i;
      } else {
         field = position - i;
      }
      //console.log("Checking field " + field);
      if (field >= 24 || field <= -1) {
         //console.log("Out of bounds, breaking");
         break;
      }
      if (hitterBoard[field] > 0) {
         var combos = getDiceCombinations(i);
         for (var c in combos) {
            if (combos.hasOwnProperty(c)) {
               if (movePossible(hitteeBoard, c, field, i, team0)) {
                  allCombos[c] = combos[c];
               }
            }
         }
      }
   }

   return allCombos;
}

function findHitsInHouse(hitteeBoard, team0) {
   var allCombos = {};

   if (team0) {
      for (var i=0; i<6; i++) {
         if (hitteeBoard[23 - i] === 1) {
            //console.log("Found Getting In hitter at " + (23 - i))
            mergeSet(allCombos, getDiceCombinations(i+1, true));
         }
      }
   } else {
      for (var i=0; i<6; i++) {
         if (hitteeBoard[i] === 1) {
            mergeSet(allCombos, getDiceCombinations(i+1, true));
         }
      }
   }

   return allCombos;
}

// Generate all dice combinations that have fixed dice in them. Don't generate alternatives i.e. (1,2) (2,1).
function generateDiceCombosFixed(fixedDice) {
   var combos = { };

   for (var i=1; i<=6; i++) {
      combos[fixedDice + "," + i] = true;
      if (i === fixedDice) {
         // generate double hops
         combos[i + "," + i + "," + i] = true;
         combos[i + "," + i + "," + i + "," + i] = true;
      }
   }

   return combos;
}

// find all dice combinations that can enter the house
// XXX: take more than one hit piece into account
function findGettingInDices(board, team0) {
   var combos = { };

   if (team0) {
      for (var i=0; i<6; i++) {
         if (board[23 - i] < 2) {
            mergeSet(combos, generateDiceCombosFixed(i+1));
         }
      }
   } else {
      for (var i=0; i<6; i++) {
         if (board[i] < 2) {
            mergeSet(combos, generateDiceCombosFixed(i+1));
         }
      }
   }

   return combos;
}

function eliminateNonDoubles(combos, numHit) {
   for (var c in combos) {
      if (combos.hasOwnProperty(c)) {
         var dices = c.split(",");
         if (dices[0] != dices[1] || dices.length < numHit) {
            delete combos[c];
         }
      }
   }
}

// Find the biggest dice sum in combos
function findMaxDice(combos) {
   var sum = 0;

   for (var c in combos) {
      if (combos.hasOwnProperty(c)) {
         var dices = diceStringToNumberArray(c);
         var localSum = 0;
         for (var i=0; i<dices.length; i++) {
            localSum += dices[i];
         }
         if (localSum > sum) {
            sum = localSum;
         }
      }
   }

   return sum;
}


// starting at slot. Find all pieces that can hit slot after pieces are in the house.
function findHitsForPositionWithHitPieces(hitteeBoard, hitterBoard, slot, team0, gettingInCombos, hitterHit)
{
   var hittingCombos = {};

   //console.log("Hitter board:")
   //console.log(hitterBoard);
   // For each dice combination
   for (var hc in gettingInCombos) {
      if (gettingInCombos.hasOwnProperty(hc)) {
         var dices = diceStringToNumberArray(hc);
         var newHitterBoard = cloneArray(hitterBoard);
         var pos = slot;
         var hittingDice = "";
         // Set pieces in hitter board assuming they get in
         for (var i=0; i<hitterHit; i++) {
            if (i < dices.length) {
               if (team0) {
                  newHitterBoard[23 - (dices[i] - 1)] += 1;
               } else {
                  newHitterBoard[dices[i] - 1] += 1;
               }

            }
         }
         //console.log("Checking dice " + hc + " for slot " + slot);
         //console.log(newHitterBoard);
         for (var i=hitterHit; i<dices.length; i++) {
            hittingDice += dices[i] + ",";
            if (team0) {
               pos += dices[i];
            } else {
               pos -= dices[i];
            }
            //console.log("hittingDice=" + hittingDice + " pos=" + pos);
            if (pos >= 0 && pos <= 23) {
               if (newHitterBoard[pos] > 0) {
                  // potential hit, see if move is possible
                  //console.log("potential hit at " + pos + " checking dice " + hittingDice);
                  if (movePossible(hitteeBoard, hittingDice, pos, team0 ? pos - slot : pos + slot, team0)) {
                     hittingCombos[hc] = true;
                     if (dices.length === 2) {
                        // Add reverse combo too
                        hittingCombos[dices[1] + "," + dices[0]] = true;
                     }
                  }
               }
            }
         }
      }
   }

   return hittingCombos;
}


function findAllHits(hitteeBoard, hitterBoard, team0) {
   var mergedCombinations = {};
   var hitterHit = 0;
   var GettingInCombos = {};

   if (team0) {
      if (hitterBoard[pieceState.HIT_1] > 0) {
         // special case, opponent has pieces hit
         hitterHit = hitterBoard[pieceState.HIT_1];
         //console.log("team 1 has " + hitterHit + " hit pieces");
      }
   } else {
      if (hitterBoard[pieceState.HIT_0] > 0) {
         // special case, opponent has pieces hit
         hitterHit = hitterBoard[pieceState.HIT_0];
         //console.log("team 0 has " + hitterHit + " hit pieces");
      }
   }
   if (hitterHit != 0) {
      mergeSet(GettingInCombos, findGettingInDices(hitteeBoard, team0));
   }
   if (hitterHit > 1) {
      // Eliminate all but double dice combos that are enough to cover all hit pieces
      eliminateNonDoubles(GettingInCombos, hitterHit);
   }
   if (hitterHit > 0) {
      //console.log("potential GettingIn dice");
      //console.log(GettingInCombos);
   }
   for (var i=0; i<hitteeBoard.length; i++) {
      // Array with all possible hits
      //console.log("team0? " + team0 + " hitteeBoard[" + i + "]=" + hitteeBoard[i]);
      if (hitteeBoard[i] == 1) {
         //console.log("Position " + i + " can get hit");
         if (hitterHit === 0) {
            mergeSet(mergedCombinations, findHitsForPosition(hitteeBoard, hitterBoard, i, team0));
         } else {
            mergeSet(mergedCombinations,
                     findHitsForPositionWithHitPieces(hitteeBoard, hitterBoard, i, team0, GettingInCombos, hitterHit));
         }

      }
   }

   //console.log("Forward: " + team0 + " HIT_0 " + hitterBoard[pieceState.HIT_0] + " HIT_1 " +
   //            hitterBoard[pieceState.HIT_1]);
   if (team0) {
      // check GettingIn for hits on team 0
      if (hitterBoard[pieceState.HIT_1] > 0) {
         // team 1 has one or more pieces out
         mergeSet(mergedCombinations, findHitsInHouse(hitteeBoard, team0));
      }
   } else {
      // check GettingIn for hits on team 1
      if (hitterBoard[pieceState.HIT_0] > 0) {
         // team 1 has one or more pieces out
         mergeSet(mergedCombinations, findHitsInHouse(hitteeBoard, team0));
      }
   }

   //console.log("Returning mergedCombos: ");
   //console.log(mergedCombinations);
   return mergedCombinations;
}

// Find all combinations that lead to team0 getting back into the game
function getGettingInPercentage(hitteeBoard, hitterBoard, team0)
{
   var combos = {};

   if (team0) {
      if (hitteeBoard[pieceState.HIT_0] > 0) {
         // team 0 has a piece hit on this board
         for (var i=0; i<6; i++) {
            if (hitterBoard[i] < 2) {
               mergeSet(combos, getDiceCombinations(i+1, true));
            }
         }
      }
   } else {
      if (hitteeBoard[pieceState.HIT_1] > 0) {
         // team 1 has a piece hit on this board
         for (var i=0; i<6; i++) {
            if (hitterBoard[23 - i] < 2) {
               mergeSet(combos, getDiceCombinations(i+1, true));
            }
         }
      }
   }

   //console.log("Found these combos");
   //console.log(combos);
   return combinationPercentage(combos);
}

// Return how a percentage number of how likely the given dice combinations are
function combinationPercentage(combos) {
   var numCombinations = 0;

   for (var c in combos) {
      if (combos.hasOwnProperty(c)) {
         var dices = c.split(",");
         if (dices.length === 3) {
            // Don't count 3 hops if a simple double is already in the set
            if (!combos.hasOwnProperty(dices[0] + "," + dices[0])) {
               numCombinations += 1;
               //console.log("Counting " + dices[0] + "," + dices[1] + " sum=" + numCombinations);
            } else {
               //console.log("Not counting 3 way " + dices[0]);
            }
         } else if (dices.length === 4) {
            // Don't count 4 hops if a simple double or triple double is already in the set
            if (!combos.hasOwnProperty(dices[0] + "," + dices[0]) &&
                !combos.hasOwnProperty(dices[0] + "," + dices[0] + "," + dices[0])) {
               numCombinations += 1;
               //console.log("Counting " + dices[0] + "," + dices[1] + " twice sum=" + numCombinations);
            } else {
               //console.log("Not counting 4 way " + dices[0]);
            }
         } else {
            numCombinations += 1;
            //console.log("Counting " + dices[0] + "," + dices[1] + " sum=" + numCombinations);
         }
      }
   }

   //console.log(numCombinations + " combinations found");
   if (numCombinations === 0) {
      // Sigh imprecise javascript math says hi
      return 0;
   } else {
      return Math.floor((numCombinations / 36) * 10000) / 100;
   }
}

function updateHittingStats(team0Board, team1Board, boardNum) {
   //console.log("board " + boardNum + " Team 0 find all hits");
   var team0Combinations = findAllHits(team0Board, team1Board, true);
   //console.log("board " + boardNum + " Team 1 find all hits");
   var team1Combinations = findAllHits(team1Board, team0Board, false);
   var team0GettingHitPercentage = combinationPercentage(team0Combinations);
   var team1GettingHitPercentage = combinationPercentage(team1Combinations)
   var team0HitPercentage = team1GettingHitPercentage;
   var team1HitPercentage = team0GettingHitPercentage;
   var team0GettingInPercentage = getGettingInPercentage(team0Board, team1Board, true);
   var team1GettingInPercentage = getGettingInPercentage(team1Board, team0Board, false);

   console.log("board " + boardNum + " team 0");
   console.log(team0Combinations);
   console.log("Probability: " + team0GettingHitPercentage);
   console.log("board " + boardNum + " team 1");
   console.log(team1Combinations);
   console.log("Probability: " + team1GettingHitPercentage);

   var team0String = "bottom";
   var team1String = "top";
   if (boardFlipped) {
      team0String = "top";
      team1String = "bottom";
   }

   document.getElementById(team0String + "Board" + boardNum + "GettingHit").innerHTML = team0GettingHitPercentage + "%";
   document.getElementById(team1String + "Board" + boardNum + "GettingHit").innerHTML = team1GettingHitPercentage + "%";
   document.getElementById(team0String + "Board" + boardNum + "Hit").innerHTML = team0HitPercentage + "%";
   document.getElementById(team1String + "Board" + boardNum + "Hit").innerHTML = team1HitPercentage + "%";
   document.getElementById(team0String + "Board" + boardNum + "GettingIn").innerHTML = team0GettingInPercentage + "%";
   document.getElementById(team1String + "Board" + boardNum + "GettingIn").innerHTML = team1GettingInPercentage + "%";
}

function updateStatsPage() {
   var boards = [];

   var numPiecesPerSlot = makeZeroFilledIntArray(pieceState.NUM_STATES);
   
   // Iterate over both boards and map pieces to board positions
   for (var j=0; j<2; j++) {
      // Iterate over both teams
      boards[j] = [];
      for (var i=0; i<2; i++) {
         boards[j][i] = [];
   
         // Iterate over all pieces
         for (var k=0; k < numPiecesPerSlot.length; k++) {
            var gs = (gameState[getPieceKeyOnBoard(j, i, k)]);
            if (gs !== undefined) {
               var val = parseInt(gs, 10);
               if (boards[j][i][val] !== undefined) {
                  boards[j][i][val] += 1;
               } else {
                  boards[j][i][val] = 1;
               }
            }
         }
   
         zeroFillArray(boards[j][i], 25);
      }
   }

   for (var j=0; j<2; j++) {
      updateHittingStats(boards[j][0], boards[j][1], j);
   }
}