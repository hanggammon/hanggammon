function keypress(event) {
   if (event.keyCode === 102) {
      if (!document.getElementById('enableRollButton').disabled) {
         document.getElementById('enableRollButton').click();
      }
   }
   if (event.keyCode === 114) {
      if (!document.getElementById('rollDiceButton').disabled) {
         document.getElementById('rollDiceButton').click();
      }
   }
}