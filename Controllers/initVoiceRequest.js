const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Houndify = require('houndify');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(bodyParser.json());
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.raw({ type: 'audio/wav', limit: '50mb' }));
app.use(cors());

//parse arguments
const argv = require('minimist')(process.argv.slice(2));

//config file
const configFile = argv.config || 'config.json';
const config = require(path.join(__dirname, configFile));

const houndifyVoiceRequest = (req, res, sampleRate) => {

    let voiceRequest = new Houndify.VoiceRequest({

        clientId: config.clientId,
        clientKey: config.clientKey,

        sampleRate: sampleRate,
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
        
    })
}

app.get('/', (req, res) => {
	res.json(houndifyVoiceRequest);
})

module.exports = {
	houndifyVoiceRequest
}

app.listen(3005, () => {
    console.log('app is running on port 3005');
})