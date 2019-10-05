const express = require('express');
const Houndify = require('houndify');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());
//parse arguments
const argv = require('minimist')(process.argv.slice(2));

//config file
const configFile = argv.config || 'config.json';
const config = require(path.join(__dirname, configFile));

app.get('/houndifyAuth', Houndify.HoundifyExpress.createAuthenticationHandler({ 
  clientId:  config.clientId, 
  clientKey: config.clientKey
}));

