var nconf = require('nconf');
var bodyParser = require('body-parser');
var dataUriToBuffer = require('data-uri-to-buffer'); // Maybe not
var readimage = require('readimage');
var express = require('express');
var dither = require('./dither');
var publicDir = '/public';
var app = express();

nconf.argv().env().file({ file: 'local.json'});

app.use(bodyParser.json({ limit: '2mb' }));
app.use(express.static(__dirname + publicDir));

app.get('/', function(req, res) {
  res.sendFile( __dirname + publicDir + '/index.html');
});


app.post('/service', function(req, res) {
  var imgBuff = readimage(req.body.content.data);
  dither(imgBuff, function(err, processed) {
	  if(err) {
		  console.log(err);
		  res.end(500);
	  }

	  var dataURI = 'data:' + imgBuff.type + ';base64,' + processed.toString('base64');
	  req.body.content.data = dataURI;
	  res.json(req.body);
  });
  
});

var port = nconf.get('port');
port = port !== undefined ? port : 8000;
app.listen(port);
console.log('server running on port:', port);
