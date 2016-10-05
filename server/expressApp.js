//--------------Initialization--------------
  //------------Modules-------------
var express = require('express');
var cors = require('cors');
var fs = require('fs');

var app = express();
app.use(cors());
var _cache = {};
_cache.results = [];

var headers = {
  // 'access-control-allow-origin': '*',
  // 'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  // 'access-control-allow-headers': 'content-type, accept',
  // 'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

fs.readFile('server/input.txt', function(err, messages) {
  if (err) {
    console.log(err);
    return;
  }

  _cache = JSON.parse(messages.toString());
});


//--------------Routing--------------
  //------------Route Directory---------
// app.get('/', function (req, res) {

//   res.send('jkasdjasdk');
// });




  //---------URL: /classes/messages-----------------
app.route('/classes/messages')
  .get(function(req, res) {
    console.log('Handling GET Request');
    res.writeHead(200, headers);

    res.end(JSON.stringify(_cache));
  })
  .post(function(req, res) {
    res.writeHead(200, headers);

    req.on('data', function(data) {
      data = data.toString();
      var incomingMessage = JSON.parse(data);

      _cache.results.push(incomingMessage);

      fs.writeFile('server/input.txt', JSON.stringify(_cache), function(err, messages) {
        if (err) {
          console.log(err);
          return;
        }
        res.end(data);
      });
    });
  });



//--------------Start Server--------------

app.listen(1337, function () {
  console.log('Example app listening on port 1337!');
});