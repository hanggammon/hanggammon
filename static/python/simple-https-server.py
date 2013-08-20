#!/usr/bin/python

import BaseHTTPServer, SimpleHTTPServer
import ssl

httpd = BaseHTTPServer.HTTPServer(('', 4443), SimpleHTTPServer.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket (httpd.socket, certfile='./cert/localhost.pem', server_side=True)
httpd.serve_forever()
