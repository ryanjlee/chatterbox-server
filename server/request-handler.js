var url = require('url');
var wesdata = require('./data.js').wesdata;

var objectId = wesdata.results.length;

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10000, // Seconds.
  'Content-Type' : 'application/json'
};

var sendResponse = function(response, statusCode, data) {
  response.writeHead(statusCode, headers);
  response.end(data);
};

var actions = {
  'GET': function (request, response) {
    sendResponse(response, 200, JSON.stringify(wesdata));
  },
  'OPTIONS': function(request, response) {
    sendResponse(response, 200);
  },
  'POST': function (request, response) {
    var requestBody = '';
    request.on('data', function(chunk) {
      requestBody += chunk;
    });
    request.on('end', function() {
      var body = JSON.parse(requestBody);
      body.objectId = ++objectId;
      wesdata.results.push(body);
      sendResponse(response, 201, JSON.stringify(body));
    });
  }
};

exports.requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var parts = url.parse(request.url);

  if (parts.pathname === '/classes/messages' || parts.pathname === '/classes/room1') {
    actions[request.method](request, response);
  } else {
    sendResponse(response, 404);
  }
};

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/


  // Request and Response come from node's http module.
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  // The outgoing status.


  // See the note below about CORS headers.

  //


  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
