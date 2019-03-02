"use strict";

const express = require('express');
//const bodyParser = require('body-parser');
const request = require('request-promise-native');
const path = require('path');

const config = require('./config');
const publicRoot = path.join(__dirname, 'public');

const app = express();

app.use('/preview', express.static(path.join(publicRoot, 'preview')));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: publicRoot });
});
app.get('/script.js', (req, res) => {
  res.sendFile('script.js', { root: publicRoot });
});
app.get('/styles.css', (req, res) => {
  res.sendFile('styles.css', { root: publicRoot });
});

app.get('/applications', async (req, res) => {
  let results = await Promise.all(config.APPLICATIONS.map(async (a) => (await queryApplication(a))));
  res.json(results);
});

async function queryApplication(application){
  let statesPromises = application.states.map(async (s) => (await processState(s)));
  return {
    "name": application.name,
    "webLink": application.webLink,
    "preview": application.preview,
    "description": application.description,
    "states": await Promise.all(statesPromises)
  };
}

async function processState(stateRequest){
  //only handle url pings atm
  let status = {};
  try {
    let response = await request.get({ 'uri': stateRequest.url, 'timeout': config.urlTimeout});
    status[stateRequest.status] = true; 
    console.log("true");
  }
  catch (e) {
    status[stateRequest.status] = false; 
    console.log(`attempt to ping ${stateRequest.url} failed`);
    console.log(e);
  }
  console.log(status);
  return status;
}

app.listen(7777, () => {
  console.log(`server started on 7777`);
});
