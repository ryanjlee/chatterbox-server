/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

exports.requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/
  var http = require('http');
  var url = require('url');
  var wesdata = require('./data.js').wesdata;
  var qs = require('querystring');

  // console.log(url.parse('file:///Users/student/hr/ryan/2014-12-chatterbox-client/client/index.html?username=anonymous', true));
  var everything = '';
  for (var key in wesdata) {
    everything+=wesdata[key].name + ': ' + wesdata[key].message + '\n';
  }
  var totalUrl = request.headers.host + request.url;
  console.log(totalUrl);
  var strung = JSON.stringify(wesdata);

  // console.log(request);

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  // The outgoing status.
  var statusCode = 200;

  var defaultCorsHeaders = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10000 // Seconds.
  };

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // 


  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  if (request.method === 'GET') {
    headers['Content-Type'] = "application/json";
    response.writeHead(statusCode, headers);
    response.write(strung);  
    response.end();
  } else if (request.method === 'OPTIONS') {
    headers['Content-Type'] = "application/json";
    response.writeHead(statusCode, headers);
    response.end();
  } else if (request.method === "POST") {
    if (request.url === "/classes/chatterbox/") {
      var requestBody = '';
      request.on('data', function(data) {
        requestBody += data;
        if(requestBody.length > 1e7) {
          response.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
          response.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
        }
      });
      request.on('end', function() {
        var body = JSON.parse(requestBody);
        var username = body.username;
        var text = body.text;
        console.log(username + ':' + text);
        response.writeHead(200, headers);
        // response.write('<!doctype html><html><head><title>response</title></head><body>');
        // response.write('Thanks for the data!<br />User Name: '+formData.UserName);
        // response.write('<br />Repository Name: '+formData.Repository);
        // response.write('<br />Branch: '+formData.Branch);
        response.write(username + ': ' + text);
        response.end();
      });
    } else {
      response.writeHead(404, 'Resource Not Found', {'Content-Type': 'text/html'});
      response.end('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
    }
  }

  



};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


