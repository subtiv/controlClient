var fs = require('fs');
var osc = require("osc");
var io = require('socket.io-client');
let SETTINGS = JSON.parse(fs.readFileSync('settings.json'));
let socket = io.connect(SETTINGS.SERVERADDRESS);

let outgoing = {};

socket.emit("hello", {
    name: SETTINGS.NAME
});

socket.on("message", (data) => {
    console.log(data);
})

/**
 * Init the open sound control connection
 */
var udpPort = new osc.UDPPort({
    localAddress: SETTINGS.OSCADDRESS,
    localPort: SETTINGS.OSCINPUT,
    remoteAddress: SETTINGS.OSCADDRESS,
    remotePort: SETTINGS.OSCOUTPUT
});



/**
 * Open up the UDP port
 */
udpPort.open();

function OSC2WEBADDRESS(val) {
    return val.slice(1);
}

function WEB2OSCADDRESS(val) {
    return "/" + val;
}

/**
 * Handle incoming OSC messages by sending them over SOCKET.IO/websocket to the server
 */
udpPort.on("message", function (oscMessage) {
    outgoing[oscMessage.address] = {name: OSC2WEBADDRESS(oscMessage.address), value: oscMessage.args[0]};    
    console.log("Received OSC Message ", oscMessage);
});

/**
 * Request certain datastreams
 */
setInterval(() => {
    SETTINGS.REQUESTSTREAMS.forEach((addr) => {
        socket.emit("gimme", addr);
    })

    for (var prop in outgoing) {
        let out = outgoing[prop];
        if (out && out.value){
            socket.emit("voila", out);
            out = {};
        } 
    }

    
}, SETTINGS.POLLING);

/**
 * Handle incoming data streams
 */
socket.on("voila", (data) => {
    let address = WEB2OSCADDRESS(data.name);
    let val = data.value;
    var msg = {
        address,
        args: val
    };
    //console.log("Sending OSC message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);
});



/**
 * Aux function to make sure we listen to all events
 */
// (function initAllEvents(){
//   var onevent = socket.onevent;
//   socket.onevent = function (packet) {
//       var args = packet.data || [];
//       onevent.call (this, packet);    // original call
//       packet.data = ["*"].concat(args);
//       onevent.call(this, packet);      // additional call to catch-all
//   };
// })();


/**
 * Thanks the the initAllEvents function we can map all incoming SOCKET.IO/websocket messages
 * || maps them to OSC
 */
// socket.on("*",function(event,data) {
//     var msg = {
//         address: "/"+event.description,
//         args: data.__v
//     };
//     console.log("Sending OSC message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
//     udpPort.send(msg);
// });