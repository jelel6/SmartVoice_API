const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Houndify = require('houndify');
const houndifyExpress = require('houndify').HoundifyExpress;
const path = require('path');

const app = express();

app.use(bodyParser.json());

app.use(cors());

const argv = require('minimist')(process.argv.slice(2));

//config file
const configFile = argv.config || 'config.json';
const config = require(path.join(__dirname, configFile));


app.get('/houndifyAuth', Houndify.HoundifyExpress.createAuthenticationHandler({
    clientId: config.clientId,
    clientKey: config.clientKey,
}));

app.post('/textSearchProxy', bodyParser.text({ limit: '1mb' }), Houndify.HoundifyExpress.createTextProxyHandler());


app.listen(3002, () => {
    console.log('app is running on port 3002');
})