const express = require('express')
const app = express();
const fs = require('fs');
const petsArray = require('./pets.json');

function verifyNumber(string) {
  let number = parseInt(string);
  return (number >= 0 && number < petsArray.length);
}

function getRespond(args) {
  let result = {};
  if (args[0] === 'pets') {
    if (typeof args[1] === 'undefined') {
      result['status'] = 200;
      result['type'] = {'Content-Type': 'application/json'};
      result['body'] = JSON.stringify(petsArray);
    } else if (verifyNumber(args[1])) {
      result['status'] = 200;
      result['type'] = {'Content-Type': 'application/json'};
      result['body'] = JSON.stringify(petsArray[args[1]]);
    } else {
      result['status'] = 404;
      result['type'] = {'Content-Type': 'text/plain'};
      result['body'] = 'Not Found';
    }
  } else {
    result['status'] = 404;
    result['type'] = {'Content-Type': 'text/plain'};
    result['body'] = 'Not Found';
  }

  return result;
}

app.get(/^\/pets/, function (req, res) {
  let result
  let method = req.method;
  let url = req.url;
  let urlSections = url.split('/');
  urlSections.shift();

  switch (method) {
    case 'GET':
      responseParts = getRespond(urlSections);
      res.status(responseParts.status)
      res.set(responseParts.type)
      result = responseParts.body
      break;
  }


  res.send(result);
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

module.exports = app;
