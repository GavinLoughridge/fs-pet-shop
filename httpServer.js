const http = require('http');
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

const server = http.createServer(function (request, response) {
  let responseParts;
  let method = request.method;
  let url = request.url;
  let urlSections = url.split('/');
  urlSections.shift();

  switch (method) {
    case 'GET':
      responseParts = getRespond(urlSections);
      response.writeHead(responseParts.status, responseParts.type, responseParts.message);
      response.write(responseParts.body);
      break;
  }

  console.log(response.statusCode);
  console.log(response.statusMessage);

  response.end();
})

server.listen(8000)

module.exports = server;
