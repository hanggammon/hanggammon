// adds extra logging into the state/queueDiv
var verbose = 0;

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
