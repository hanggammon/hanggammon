/* client side code to talk to the hanggammon server */

var client = {};

client.socket = null;
client.ident = null;

client.init = function () {
   this.socket = io.connect('https://67.169.101.121:8000', {'force new connection': true});

   function Announce(socket) {
      var myID = gapi.hangout.getLocalParticipant().person.id;
      client.socket.emit('init', { "ident": myID });
      LogDebug("Ident: " + myID);
   }
   this.socket.on('connect', function () {
      Announce();
   });

   this.socket.on('reconnect', function () {
      Announce();
   })

   this.socket.on('broadcast', function (payload) {
      if (!payload.hasOwnProperty('type')) {
         LogDebug("Malformed message without a type");
      }
      if (payload.type === 'rmi') {
         rmi.Process(payload);
      } else {
         LogDebug("Unknown message type " + payload.type);
      }
   });
}

client.broadcast = function (payload) {
   this.socket.emit('broadcast', payload);
}


/* Simple Remote Interface Invocation */
var rmi = {};

rmi.op = {}
rmi.Register = function(op, func) {
   rmi.op[op] = func;
}

rmi.SendBroadcast = function(op) {
   if (!rmi.op.hasOwnProperty(op)) {
      alert("Wrong property " + op + " to sendBroadcastRMI");
   }

   /* Marshall all arguments */
   var msg = {};
   msg.type = 'rmi';
   msg.op = op;
   msg.args = [];
   for (var i = 1; i < arguments.length; i++) {
      LogDebug("arg[" + (i-1) + "] = " + arguments[i]);
      msg.args[i-1] = arguments[i];
   }
   client.broadcast(msg);
   LogDebug("Local call " + op);
   rmi.op[op].apply(rmi.op[op], msg.args);
}

rmi.Process = function(payload) {
   LogDebug("Remote call " + payload.op);
   if (!rmi.op.hasOwnProperty(payload.op)) {
      LogDebug("Unknown op from remote call " + payload.op);
   }
   rmi.op[payload.op].apply(rmi.op[payload.op], payload.args);
}

