const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const uuid = require('uuid');
const crypto = require('crypto');
const request = require('request');
const Houndify = require('houndify');
const axios = require('axios');


const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const clientID = "GDphGQ3HonLiBJlAK_bKZg==";
const clientKey = "QbRXbiJP9ZSVg13bXa0a3xeD9wz-Tu5ft2afYUYc0zWYHnFlnEW7EFpMWDaFd4Va25mVajfVvjewul_P-7ZoXw==";
const userId = uuid.v1();
const requestId = uuid.v1();
const timestamp = Math.floor(Date.now() / 1000);


function generateAuthHeaders(clientId, clientKey, userId, requestId) {

    if (!clientId || !clientKey) {
        throw new Error('Must provide a ClientID and a ClientKey');
    }

    // Generate a unique UserId and RequestId.
    userId = userId;
    // console.log("userId",userId);

    // keep track of this requestId, you will need it for the RequestInfo Object
    requestId = requestId;

    var requestData = userId + ';' + requestId;

    // keep track of this timestamp, you will need it for the RequestInfo Object
    const timestamp = Math.floor(Date.now() / 1000),


        unescapeBase64Url = function(key) {
            return key.replace(/-/g, '+').replace(/_/g, '/');
        },

        escapeBase64Url = function(key) {
            return key.replace(/\+/g, '-').replace(/\//g, '_');
        },


        signKey = function(clientKey, message) {
            var key = new Buffer(unescapeBase64Url(clientKey), 'base64');
            var hash = crypto.createHmac('sha256', key).update(message).digest('base64');
            return escapeBase64Url(hash);
        },



        encodedData = signKey(clientKey, requestData + timestamp),
        headers = {
            'Hound-Request-Authentication': requestData,
            'Hound-Client-Authentication': clientId + ';' + timestamp + ';' + encodedData,

        };

    console.log("userId", userId);
    console.log("requestId", requestId);
    // console.log("timesta",timestamp);

    return headers;
};



const headers = generateAuthHeaders(clientID, clientKey, userId, requestId);

const HoundAuth = headers["Hound-Client-Authentication"];
const HoundRequest = headers["Hound-Request-Authentication"];
console.log(`'${HoundAuth}'`);
console.log(`'${HoundRequest}'`);

var houndRequest = {
    Latitude: 48,
    Longitude: 35,
    Street: '',
    City: '',
    State: '',
    Country: '',
    ClientID: clientID,
    RequestID: requestId,
    DeviceID: '8333687f040f3d88',
    ClientVersion: '1.0',
    SessionID: uuid.v1(),
    TimeZone: '',
    TimeStamp: timestamp,
    Language: 'en_US'
};


let searchKeyword = "who is the president of niger";

const askAnything = async (searchKeyword) => {

    const response = await axios.get('https://api.houndify.com/v1/audio', {
        params: {
            query: searchKeyword
        },
        headers: {
            'Hound-Request-Authentication': HoundRequest,
            'Hound-Client-Authentication': HoundAuth,
            'Hound-Request-Info': JSON.stringify(houndRequest),
        },
    });

     return response.data;
  }


  app.post('/', async (req, res) => {
  const { searchKeyword } = req.body;
  console.log(searchKeyword);
  const ReactData = await askAnything(searchKeyword); 
  console.log(ReactData);
  res.json(ReactData);
});

app.post('/audio',async (req, res) => {

    const { jelel } = req.body;
    console.log(jelel);
    const response = await axios.get('https://api.houndify.com/v1/text', {
        
        params:{
            query:jelel
        },
        headers: {
            'Hound-Request-Authentication': HoundRequest,
            'Hound-Client-Authentication': HoundAuth,
            'Hound-Request-Info': JSON.stringify(houndRequest),
        },
    });
  
     res.json(response.data);
});


  app.get('/response', (req, res) => {
    res.json('getting response');
  })


app.listen(3002, () => {
    console.log('app is running on port 3002');
})
