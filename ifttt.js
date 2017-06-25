const request = require('request');

module.exports = function(eventId, key, value) {
  const url = `https://maker.ifttt.com/trigger/${eventId}/with/key/${key}`;

  const headers = {
    'Content-Type': 'application/json'
  };

  var options = {
    url,
    method: 'POST',
    headers,
    json: true,
    form: {
      value1: value[0],
      value2: value[1],
      value3: value[2]
    }
  };

  request(options, function(error, response, body) {
    if(!error && response.statusCode == 200) {
      console.log(body);
    } else {
      console.log(`error: ${response.statusCode}`);
    }
  });
}
