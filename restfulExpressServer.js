const express = require('express')
const app = express();
let fs = require('fs');
const bodyParser = require('body-parser')
const path = require('path')
const jsonParser = bodyParser.json()
const basicauth = require('basicauth-middleware');
const basicAuth = require('express-basic-auth')

app.use(bodyParser.json())
app.use(basicauth('admin', 'meowmix', '"Required"'));



app.get('/pets/:index?', function(req, res) {
  fs.readFile('./pets.json', 'UTF8', function (err, data) {
    let index = req.params.index;
    let petsArray = JSON.parse(data);
    if (typeof index === 'undefined') {
      res.status(200);
      res.set({'Content-Type': 'application/json'});
      res.send(petsArray);
    } else if (index >= 0 && index < petsArray.length) {
      res.status(200);
      res.set({'Content-Type': 'application/json'});
      res.send(JSON.stringify(petsArray[index]));
    } else {
      res.status(404);
      res.set({'Content-Type': 'text/plain'});
      res.send('Not Found');
    }
  })
})

app.post('/pets', function(req, res) {
  fs.readFile('./pets.json', 'UTF8', function (err, data) {
    let petsArray = JSON.parse(data);
    let pet = req.body;
    let validPet = pet.name && parseInt(pet.age) > 0 && pet.kind && Object.keys(pet).length === 3;
    if (validPet) {
      petsArray.push(pet)
      fs.writeFile('./pets.json', JSON.stringify(petsArray), function (err) {
        if (err) {
          res.status(500);
          res.set({'Content-Type': 'text/plain'});
          res.send('Internal Server Error');
        }
        res.status(200);
        res.set({'Content-Type': 'application/json'});
        res.send(pet);
      });
    } else {
      res.status(400);
      res.set({'Content-Type': 'text/plain'});
      res.send('Bad Request');
    }
  })
})

app.patch('/pets/:index', function(req, res)
{
  fs.readFile('./pets.json', 'UTF8', function (err, data) {
    let petsArray = JSON.parse(data);
    let index = req.params.index;
    let pet = req.body;
    let validIndex = index >= 0 && index < petsArray.length;
    if (validIndex) {
      if (!pet.name && !pet.kind && !(parseInt(pet.age) >= 0)) {
        res.status(400);
        res.set({'Content-Type': 'text/plain'});
        res.send('Bad Request');
      }
      if (pet.name) {
        petsArray[index]['name'] = pet.name;
      }
      if (pet.kind) {
        petsArray[index]['kind'] = pet.kind;
      }
      if (parseInt(pet.age) >= 0) {
        petsArray[index]['age'] = pet.age;
      }
      fs.writeFile('./pets.json', JSON.stringify(petsArray), function (err) {
        if (err) {
          res.status(500);
          res.set({'Content-Type': 'text/plain'});
          res.send('Internal Server Error');
        }
        res.status(200);
        res.set({'Content-Type': 'application/json'});
        fs.readFile('./pets.json', 'UTF8', function (err, data) {
          res.send(petsArray[index]);
        })
      })
    } else {
      res.status(404);
      res.set({'Content-Type': 'text/plain'});
      res.send('Not Found');
    }
  })
})

app.delete('/pets/:index', function (req, res) {
  fs.readFile('./pets.json', 'UTF8', function (err, data) {
    let petsArray = JSON.parse(data);
    let index = req.params.index;
    let validIndex = index >= 0 && index < petsArray.length;
    if (validIndex) {
      let destroyedPet = petsArray.splice(index, 1)[0];
      fs.writeFile('./pets.json', JSON.stringify(petsArray), function (err) {
        if (err) {
          res.status(500);
          res.set({'Content-Type': 'text/plain'});
          res.send('Internal Server Error');
        }
        res.status(200);
        res.set({'Content-Type': 'application/json'});
        res.send(destroyedPet);
      })
    } else {
      res.status(404);
      res.set({'Content-Type': 'text/plain'});
      res.send('Not Found');
    }
  })
})

app.use(function (req, res) {
  res.status(404);
  res.set({'Content-Type': 'text/plain'});
  res.send('Not Found');
})

app.listen(3000, () => console.log('App listening'));

module.exports = app;
