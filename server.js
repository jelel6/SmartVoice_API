const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const cors = require('cors');
const Houndify = require('houndify');
const houndifyExpress = require('houndify').HoundifyExpress;
const fs = require('fs');
const path = require('path');


const app = express();

app.use(bodyParser.json());
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.raw({ type: 'audio/wav', limit: '50mb' }));

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
 
const argv = require('minimist')(process.argv.slice(2));

//config file
const configFile = argv.config || 'config.json';
const config = require(path.join(__dirname, configFile));


// app.options('/*', (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3002/houndifyAuth');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin');
//     res.send(HttpStatusCode.OK);
// });

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });


// 
// app.get('/', (req, res) => { res.json(`yea! it's working`)});

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });



app.get('/houndifyAuth', Houndify.HoundifyExpress.createAuthenticationHandler({ 
  clientId:  config.clientId, 
  clientKey: config.clientKey,
}));

 app.post('/textSearchProxy', bodyParser.text({ limit: '1mb' }), Houndify.HoundifyExpress.createTextProxyHandler());

app.get('/', (req, res) => {
  request(
    { url: 'https://apiws.houndify.com/' },
    (error, response, body) => {
      if (error || response) {
        return res.status(500).json({ type: 'error', message: error, response});
      }
      res.json(JSON.parse(body));
    }
  )
});

app.post('/textrequest', (req, res) => { textRequest.houndTextRequest(req, res)});
app.post('/voicerequest', (req, res) => { voiceRequest.houndVoiceRequest(req, res)});
app.get('/voiceinit', (req, res) => { initVoiceRequest.houndifyVoiceRequest(req, res)});

app.post('/form', (req, res) => {
    console.log(req.body.data);
})


app.listen(3002, () => {
    console.log('app is running on port 3002');
})
