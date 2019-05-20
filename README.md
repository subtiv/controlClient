# controlClient
This simple CLI app has been made to transform OSC to a Websocket server and back again. It was modified from NDMClient. You

More information: www.controlcontrolcontrol.club; find the current running data-streams.

## install
* make sure you have NPM & Node installed (www.node.org)
* git clone this repo
* when inside local repository: hit "npm i" to install dependencies
* make modifications to "settings.json"  (see below)
* hit "node ." to run the software

## settings.json

* "NAME": "SUBTIV CLIENT" --> !! change this to your personal name
* "OSCINPUT": 46697 --> this is the OSC input port for the client; so forex VDMX should have this as an output port
* "OSCOUTPUT": 12345 --> this is the OSC output port for the client; so forex VDMX should have this as an input port
* "OSCADDRESS": "127.0.0.1"--> (don't change) localhost / osc address
* "SERVERADDRESS" : "http://controlatserver.herokuapp.com/" --> (don't change) server address for sending websocket messages to
* "POLLING": 500 --> (don't change) update speed in milliseconds ; you might want to use some interpolation (easing) in your sofware to allow for more smooth transitions
* "REQUESTSTREAMS" : ["teststream1","teststream2","teststream3"] --> change this into the streams that you want to subscribe to.


## Example : SEND OSC from VDMX to the platform
* create new datastream here: https://github.com/subtiv/ControlATSettings/blob/master/settings.json, lets call it "newstream" and it is a floating point (we can send out floats between [0…1] or have strings. We can also define a group, in order to keep relevant data together on the controlcontrolcontrol.club site.
* update the datastreams here: http://controlcontrolcontrol.club --> hit button "update data stream settings"
* we open VDMX, check that we have an output OSC port that is identical to our "settings.json" input osc port
* we create a new slider (in a control surface forex), and in "UI inspector" we make sure that we have "send" set to OSC, select the port of the controlClient settings (OSCINPUT). The address is identical to the name of the stream BUT with an "/" before, as is common in OSC-protocol
* make sure you have the "controlClient" app running (see install)
* If you change the slider; you should see the valuses change on controlcontrolcontrol.club


## Example : pull OSC from the platform
* check http://controlcontrolcontrol.club and note the name that we want to subscribe to.
* add the name to "REQUESTSTREAMS" in the settings.json
* make sure you have the "controlClient" app running (see install)
* we create a new slider (in a control surface forex), and in "UI inspector" we make sure that we have "receive" set to OSC, select the port of the controlClient settings (OSCOUTPUT). The address is identical to the name of the stream BUT with an "/" before, as is common in OSC-protocol


 

