const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Houndify = require('houndify');
const houndifyExpress = require('houndify').HoundifyExpress;
const path = require('path');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

const db = knex({
    client: 'pg',    
    connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'jelel',
    database : 'SmartVoice'
  },
});

db.select('*').from('users').then(data => {
  console.log(data);
})


const app = express();

app.use(bodyParser.json());
app.use(cors());

const argv = require('minimist')(process.argv.slice(2));
const configFile = argv.config || 'config.json';
const config = require(path.join(__dirname, configFile));


app.get('/', (req, res) => {
  res.json(database.users);
})


app.post('/signin', (req, res) => {
  const { email1, name} = req.body.email;
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
       return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
         res.status(400).json('wrong credentials')
        }
    }) 
    .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password); 
  db.transaction(trx => { 
    trx.insert({
      hash: hash,
      email: email,
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
     return trx('users')
       .returning('*')
       .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0]);
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })     
    .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
 const { id } = req.params;
 db.select('*').from('users').where({id
 })
  .then(user => {
    if (user.length) {
      res.json(user[0]);
    } else {
       res.status(400).json('Not found')
      }
 })
  .catch(err => res.status(400).json('error getting user')) 
}) 

app.get('/history/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('history').where({
  id: id
  })
  .then(saved => {
    if(saved) {
      res.json(saved);
    } else {
      res.status(400).json('No Saved Queries')
    }     
  })
   .catch(err => res.status(400).json('not found'))
})


app.post('/saveResponse', (req, res) => {
  const { id, query, writtenResponse } = req.body;
 db('history')
   .returning('*')
   .insert({
      id: id,
      query: 'who is de bests',
      response: 'Thanks to a fellow student, Rodrigo, who pointed out that there are a few changes in the code from the last video. Make sure you take note of these so you don\'t get an error in your code as you move on to this next part'
  })
    .then(response => {
      res.json(response[0]);
    })
    .catch(err => res.status(400).json('unable to save duplicate query')) 
})

app.put('/queryCount', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
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