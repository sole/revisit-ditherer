GifWriter = require('omggif').GifWriter;


// TODO this should probably be called indexedToGIF or something of the sort
function makeGIF(frames, width, height, callback) {

  // TODO: Weird: using a simple JS array instead of a typed array,
  // the files are WAY smaller o_o. Patches/explanations welcome!
  var buffer = []; // new Uint8Array(width * height * frames.length * 5);
  var globalPalette;
  var gifOptions = { loop: repeat }; // TODO: only if more than one frame
  var delay = 100; // TODO param
  
  // use global palette if only one palette found
  var palettes = frames.map(function(frame) {
    if(frame.palette) {
      return frame.palette;
    }
  });

  if(palettes.length === 1) {
    globalPalette = palettes[0];
    gifOptions.palette = globalPalette;
  }

  var gifWriter = new GifWriter(buffer, width, height, gifOptions);

  frames.forEach(function(frame, index) {

    var framePalette;

    if(!globalPalette) {
      framePalette = frame.palette;
    }

    // TODO onRenderProgressCallback(0.75 + 0.25 * frame.position * 1.0 / frames.length);
    gifWriter.addFrame(0, 0, width, height, frame.pixels, {
      palette: framePalette,
      delay: delay
    });

  });

  gifWriter.end();

  // TODO onRenderProgressCallback(1.0);

  // at this point the encoded GIF is in buffer
  callback(false, buffer);
}


module.exports = makeGIF;
