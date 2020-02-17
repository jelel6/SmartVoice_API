const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Houndify = require('houndify');
const houndifyExpress = require('houndify').HoundifyExpress;
const path = require('path');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const history = require('./controllers/history');
const queryCount = require('./controllers/queryCount');
const saveResponse = require('./controllers/saveResponse');

const db = knex({
    client: 'pg',    
    connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'jelel',
    database : 'SmartVoice'
  },
});


const app = express();

app.use(bodyParser.json());
app.use(cors());

const argv = require('minimist')(process.argv.slice(2));
const configFile = argv.config || 'config.json';
const config = require(path.join(__dirname, configFile));


app.get('/', (req, res) => { 
  db.select('*').from('users').then(users => {
    res.json(users);
  })
  .catch(err => res.status(400).json('unable to get users'))
});

app.post('/signin', (req, res) => { signin.handleSignin(req,res, db, bcrypt)});
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)}); 
app.get('/history/:id', (req, res) => { history.handleHistory(req, res, db)});
app.post('/saveResponse', (req, res) => { saveResponse.handleSaveResponse(req, res, db)});
app.put('/queryCount', (req, res) => { queryCount.handleQueryCount(req, res, db)});

app.get('/houndifyAuth', Houndify.HoundifyExpress.createAuthenticationHandler({
  clientId: config.clientId,
  clientKey: config.clientKey,
}));

app.post('/textSearchProxy', bodyParser.text({ limit: '1mb' }), Houndify.HoundifyExpress.createTextProxyHandler());

app.listen(process.env.PORT || 3002, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});

