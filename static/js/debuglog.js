// adds extra logging into the state/queueDiv
var verbose = 1;
// debug logs for the message box
var verboseMB = 1;
var verboseMovePiece = 0;

function AppendToElement(element, str)
{
   var obj = document.getElementById(element);
   obj.innerHTML += str;
}

function SetElement(element, str)
{
   var obj = document.getElementById(element);
   obj.innerHTML = str;
}

function LogState(str)
{
   if (verbose > 0) {
      AppendToElement('stateDiv', str);
   }
}

function LogStateClear(str)
{
   if (verbose > 0) {
      SetElement('stateDiv', str);
   }
}

function LogQueue(str)
{
   if (verbose > 0) {
      AppendToElement('queueDiv', str);
   }
}

function LogQueueClear(str)
{
   if (verbose > 0) {
      SetElement('queueDiv', str);
   }
}

function LogMB(str)
{
   if (verboseMB > 0) {
      AppendToElement('debugLogDiv', str + '<br>');
   }
}

function LogMBClear(str)
{
   if (verboseMB > 0) {
      SetElement('debugLogDiv', str);
   }
}

function LogMovePiece(str)
{
   if (verboseMovePiece > 0) {
      AppendToElement('debugLogDiv', str + '<br>');
   }
}
