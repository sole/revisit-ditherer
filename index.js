var nconf = require('nconf');
var bodyParser = require('body-parser');
var dataUriToBuffer = require('data-uri-to-buffer'); // Maybe not
var readimage = require('readimage');
var writegif = require('writegif');
var express = require('express');
var dither = require('./dither'); // TODO extract
var makeGIF = require('./makeGIF'); // TODO extract
var publicDir = '/public';
var app = express();

nconf.argv().env().file({ file: 'local.json'});

app.use(bodyParser.json({ limit: '2mb' }));
app.use(express.static(__dirname + publicDir));

app.get('/', function(req, res) {
  res.sendFile( __dirname + publicDir + '/index.html');
});


app.post('/service', function(req, res) {
  
  var postData = req.body.content;
  var imageType = postData.type;
  var imageData = postData.data;

  console.log('BODY', Object.keys(req.body.content));
  console.log('image type', imageType);
  console.log('image data length', imageData.length);
  console.log(imageData);

  var imageDataBinary = dataUriToBuffer(imageData);

  var imgBuff = readimage(imageDataBinary, function(err, imgBuff) {

    if(err) {
      console.log('muerte', err);
    }

  });

  /*dither(imgBuff, function(err, processedFrame) {
    if(err) {
      console.log(err);
      res.end(500);
    }

    // processed: pixels + palette
    var frames = [ processedFrame ];

    // make gif
    makeGIF(frames, width, height, function(err, gif) {
      // convert to string (base64)
      var dataURI = 'data:' + 'image/gif' + ';base64,' + gif.toString('base64');
      req.body.content.data = dataURI;
      res.json(req.body);
    });
    
  });*/
  
});

var port = nconf.get('port');
port = port !== undefined ? port : 8000;
app.listen(port);
console.log('server running on port:', port);
