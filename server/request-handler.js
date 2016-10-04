/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/



// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var fs = require('fs');

var cache = [];

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/
  //{"username":"Jono","message":"Do my bidding!","objectId":"13"}
  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  var statusCode = 200;
  var requestType = request.method;
  if (request.method === 'OPTIONS') {
    requestType = request.headers['access-control-request-method'];
  }

  if (request.url !== '/classes/messages') {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end('Invalid URL');

  } else if (requestType === 'GET') {
    statusCode = 200;
    response.writeHead(statusCode, headers);

    fs.readFile('server/input.txt', function(err, data) {
      var obj = {};
      var result = JSON.parse(data.toString());
      // result = JSON.stringify(obj);
      obj.results = result;
      response.end(JSON.stringify(obj));
    });
    
  } else if (requestType === 'POST') {
    statusCode = 201;
    response.writeHead(statusCode, headers);

    request.on('data', function(newData) {
      fs.readFile('server/input.txt', function(err, data) {
        // turn data into a manipulatable format
        var content = JSON.parse(data.toString());
        var newContent = JSON.parse(newData.toString());
        // manipulate the data, i.e. insert the POST newData
        content.unshift(newContent);
          // convert the data back into txt format
          // write the transformed data
        fs.writeFile('server/input.txt', JSON.stringify(content));
      });
    //   var oldArray = JSON.parse(oldData.toString());
    //   var newObj = JSON.parse(newData.toString());
    //   newObj.objectId = oldArray.length.toString();
    //   oldArray.unshift(newObj);
    //   var resultString = JSON.stringify(oldArray);


    //   fs.writeFileSync('server/input.txt', resultString);
    });
    request.on('end', function(data) {
      console.log('ended');
      response.end('data modifed');
    });
  }


  console.log('Serving request type ' + requestType + ' for url ' + request.url);

  // The outgoing status.

  // See the note below about CORS headers.

  // Tell the client we are sending them plain text.

  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end('{"results": []}');
};


// module.exports = requestHandler;
module.exports.requestHandler = requestHandler;


