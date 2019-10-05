var fs = require('fs');
var wav = require('wav');
var Speaker = require('speaker');
 
var file = fs.createReadStream('track01.wav');
var reader = new wav.Reader();
 
// the "format" event gets emitted at the end of the WAVE header
reader.on('format', function (format) {
 
  // the WAVE header is stripped from the output of the reader
  reader.pipe(new Speaker(format));
});
 
// pipe the WAVE file to the Reader instance
file.pipe(reader);



// Stream full WAV/Opus/Speex audio file to Houndify backend
const streamAudioFile = (file) => {
  const voiceRequest = new Houndify.VoiceRequest({
      clientId:  config.clientId, 
      clientKey: config.clientKey,

      convertAudioToSpeex: false,
      enableVAD: true,

      //REQUEST INFO JSON
      //see https://houndify.com/reference/RequestInfo
      requestInfo: {
        UserID: "test_user",
        Latitude: 37.388309, 
        Longitude: -121.973968
      },

      onResponse: function(response, info) {
        console.log(response);
      },

      onTranscriptionUpdate: function(trObj) {
        console.log("Partial Transcript:", trObj.PartialTranscript);
      },

      onError: function(err, info) {
        console.log(err);
      }
  });

  file.on('data', function (chunk) {
    voiceRequest.write(chunk);
  });

  file.on('end', function() { 
    voiceRequest.end(); 
  });
}



const audioFile = argv.audio || path.join('testAudio', 'whatistheweatherthere.wav');
const audioFilePath = path.join(__dirname, audioFile);
const file = fs.createReadStream(audioFilePath);


if (audioFile.endsWith(".wav") || audioFile.endsWith(".wave")) {
  compressAndStreamWAV(file);
} 
else {
  streamAudioFile(file);
}

