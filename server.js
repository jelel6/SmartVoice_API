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
const configFile = argv.config || 'config.json';
const config = require(path.join(__dirname, configFile));


const database = {
  users: [
    {
      id: '1',
      password: 'orange',
      name: 'jelel',
      email: 'jelel@gmail.com',
      history: [],
      legend: 0,
      joined: new Date()
    },
     {
      id: '2',
      password: 'pineapple',
      name: 'sally',
      email: 'sally@gmail.com',
      history: [],
      legend: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res) => {
  res.json(database.users);
})


app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email && 
      req.body.password === database.users[0].password) {
    res.json(database.users[0]);
  } else {
     res.status(400).json('error logging in')
    }
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  database.users.push({
      id: '3',
      name: name,
      email: email,
      history: [],
      legend: 0,
      joined: new Date()
  })
  res.json(database.users[database.users.length-1])
})

app.get('/profile/:id', (req, res) => {
 const { id } = req.params;
 let found = false;
 database.users.forEach(user => {
  if (user.id === id) {
    found = true
    return res.json(user)
  } 
 })
  if (!found) {
    res.status(400).json('found No');
  }
})

app.get('/history/:id', (req, res) => {
 const { id } = req.params;
 let found = false;
 database.users.forEach(user => {
  if (user.id === id) {
    found = true
    return res.json(user.history)
  } 
 })
  if (!found) {
    res.status(400).json('found No');
  }
})

app.post('/saveResponse', (req, res) => {
  const { id, query, commandKind, writtenResponse, status } = req.body;
  database.users.forEach(user => {
    if (user.id === id) {
      console.log(+id);
      database.users[+id-1].history.push({
        // query: query,
        // commandKind: commandKind,
        // status: status,
        writtenResponse: writtenResponse,
      })
         res.json('Saved Successfully');
      // return res.json(database.users[+id-1].history[database.users[+id-1].history.length-1]);
    } 
  })
})

app.put('/queryCount', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.legend++;
      return res.json(user.legend);
    } 
 })
   if (!found) {
    res.status(400).json('Not found');
  }
})

app.get('/houndifyAuth', Houndify.HoundifyExpress.createAuthenticationHandler({
    clientId: config.clientId,
    clientKey: config.clientKey,
}));

app.post('/textSearchProxy', bodyParser.text({ limit: '1mb' }), Houndify.HoundifyExpress.createTextProxyHandler());


app.listen(3002, () => {
    console.log('app is running on port 3002');
})


/* 
/  res--> it's working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId get = user --> 
/search
/history
/authentication
/textSearchProxy

*/