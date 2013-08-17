Hanggammon
==========

Google Hangout Multiplayer Backgammon

1 Local Development
=================

1.1 Prerequisites
==================
Get a google dev account and register to use the hangout API.

1.2 Run a local https server
============================
The easiest way to do local development is to set up a simple https server in
the local network that serves out of the development repository. There is a
script in static/python/simple-https-server.py that will start an https server
using a cert in static/cert/localhost.cert. Run the following commands to start
it:
$ cd static
$ python python/simple-https-server.py
now you have a https server running serving on all your IPs on port 4443.

1.3 Make sure your browser accepts the localhost.cert certificate
=================================================================
Browse to https://localhost:4443/xml/hangout.xml. Accept all the security
warnings. If you don't see the parsed content of hangout.xml then go back to
step 1.2.

1.4 Ensure that your https server is globally accessible
Find your global IP by googling "what's my ip". Setup your router to forward
port 4443 to your local IP. Browse to https://<your ip>:4443/xml/hangout.xml to
verify that your setup works.

1.5 Configure your private hangout project to point to your IP
==============================================================
Brows to https://code.google.com/apis/console and change the Application URL to
https://<your ip>:4443/xml/hangout.xml. Don't forget to click save.

1.5 Patch up xml/hangout.xml
============================
Since you'll have to make those changes every time it's best to stash them away
in a branch in your git tree somewhere. Search and replace all occurrences of
hangout.appspot.com with <your ip>:4443 i.e. localhost:4443.

1.6 Making sure everything works
================================
With master checked out and up to date use the "Enter a hangout" link in the
google API console to start a development hangout. You should see the game come
up and be completely functional. Use the chrome development console to verify
that the js sources were pulled from your IP.


2 Syntax Checking
===============

2.1 Prerequisites
=================
- gnu make toolchain installation
- nodejs installation for jshint

2.2 Running the syntax checker
==============================
Run 'make check' from the static/ directory to check all .js files in js/ for
syntax issues and coding style compliance.
