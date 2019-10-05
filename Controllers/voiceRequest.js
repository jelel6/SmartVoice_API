const Houndify = require('houndify');
const wav = require('wav');
const fs = require('fs');
const path = require('path');

//parse arguments
const argv = require('minimist')(process.argv.slice(2));

//config file
const configFile = argv.config || 'config.json';
const config = require(path.join(__dirname, configFile));

const compressAndStreamWAV = () => {
  let voiceRequest;
  const reader = new wav.Reader();

  reader.on('format', function (format) {
    voiceRequest = new Houndify.VoiceRequest({
      clientId:  config.clientId, 
      clientKey: config.clientKey,

      sampleRate: format.sampleRate,
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
  });

  reader.on('data', function (chunk) {
    var arrayBuffer = new Uint8Array(chunk).buffer;
    var view = new Int16Array(arrayBuffer);
    voiceRequest.write(view);
  });

  reader.on('end', function() { 
    voiceRequest.end(); 
  });

  file.pipe(reader);
}


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


const houndVoiceRequest = (req, res) => {

  if (audioFile.endsWith(".wav") || audioFile.endsWith(".wave")) {
    compressAndStreamWAV(file);
  } 
  else {
    streamAudioFile(file);
  }
}


module.exports = {
  houndVoiceRequest
}