
function printProjectVersion() {

  var pjson = require('../package.json');
  console.log(pjson.version);
}

function printUsage() {

  console.error('Usage: ./www [OPTIONS]');
  console.error('-v print project version');
}

if (process.argv.indexOf('-v') != -1) {
  printProjectVersion();
}
else {
  var server = require(__dirname + '/server');

  server.start();
}