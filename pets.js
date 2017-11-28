
let fs = require('fs');
let command = process.argv[2];
let subcommand = process.argv[3];
let age = parseInt(process.argv[3]);
let kind = process.argv[4];
let name = process.argv[5];

function createFile() {
  if(!isNaN(age) && kind && name) {
    let entry = {
      "age": age,
      "kind": kind,
      "name": name
    };

    console.log(entry);

    fs.readFile('./pets.json', 'utf8', function (err, data) {
      if (err) throw err;
      let dataArray = JSON.parse(data);
      dataArray.push(entry)
      fs.writeFile('./pets.json', JSON.stringify(dataArray), function (err) {
        if (err) throw err;
        //console.log(entry);
      })
    });
  } else {
    console.error('Usage: node pets.js create AGE KIND NAME');
    process.exit(1);
  }
}

function printOutput(data) {
  if (isNaN(subcommand)) {
    console.log(data);
  } else if (parseInt(subcommand) < 0 || parseInt(subcommand) > data.length - 1){
    console.error('Usage: node pets.js read INDEX');
    process.exit(1);
  } else {
    console.log(data[parseInt(subcommand)]);
  }
}

function readFile() {
  fs.readFile('./pets.json', function (err, data) {
    if (err) throw err;
    printOutput(JSON.parse(data));
  });
}

switch (command) {
  case 'read':
    readFile();
    break;
  case 'create':
    createFile();
    break;
  default:
    console.error('Usage: node pets.js [read | create | update | destroy]');
    process.exit(1);
}
