const express = require('express');
const cors = require('cors');
const app = express();
const Houndify = require('houndify');
const houndifyExpress = require('houndify').HoundifyExpress;
var path = require('path');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3010);
app.use(cors());

// app.use(express.static('public'));

// Request all dreams
app.get('/api/v1/dreams', (req, res) => {
  database('dreams')
    .select()
    .then(dreams => {
      res.status(200).json(dreams);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

// Post new dream
app.post('/api/v1/dreams', (req, res) => {
  let newDream = req.body;
  for (let requiredParameter of ['date', 'dream']) {
    if (!newDream[requiredParameter]) {
      return res
        .status(422)
        .send({ error: `You are missing a ${requiredParameter} property.` });
    }
  }
  database('dreams')
    .insert(newDream, 'id')
    .then(dreamId => {
      res.status(201).json({ dreamId });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

//Houndify

// // //parse arguments
var argv = require('minimist')(process.argv.slice(2));

// // // // //config file
var configFile = argv.config || 'config';
var config = require(path.join(__dirname, configFile));
// // //express app
// // var app = express();
// // var port = config.port || 8446;
// var publicFolder = argv.public || 'public';
// app.use(express.static(path.join(__dirname, publicFolder)));

// authenticates requests
app.get(
  '/houndifyAuth',
  houndifyExpress.createAuthenticationHandler({
    clientId: config.clientId,
    clientKey: config.clientKey
  })
);

app.post(
  '/textSearchProxy',
  bodyParser.text({ limit: '1mb' }),
  houndifyExpress.createTextProxyHandler()
);

const server = app.listen(app.get('port'), () => {
  console.log(`The Dreaming running on port ${app.get('port')}`);
});

module.exports = { server, database };
