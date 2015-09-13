var express    = require('express'),
    handlebars = require('express-handlebars'),
    jsonld     = require('jsonld'),
    fs         = require('fs'),
    app        = express();	

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var rdfJSON = JSON.parse(fs.readFileSync('app/json-ld.json').toString());

function clearJson(jsonldArray) {
  var results = [];
  for (var i = 0; i < jsonldArray.length; i += 1) {
    var node = jsonldArray[i];
    var clearedObject = {};
    for (var prop in node) {
      var clearedProp = prop.substr(prop.indexOf('#') + 1);
      if (prop[0] == '@') {
        clearedProp = clearedProp.substr(1);
      }
      var clearedValue = "";
      if (Array.isArray(node[prop])) {
        clearedValue = clearJson(node[prop]);
      } else if (typeof prop == 'string') {
        clearedValue = node[prop].substr(node[prop].indexOf('#') + 1);
      }
      clearedObject[clearedProp] = clearedValue;
    }
    results.push(clearedObject);
  }
  return results;
}

app.get('/', function(req, res) {
  jsonld.expand(rdfJSON, function(err, results) {
    var wrapper = {};
    wrapper.processors = clearJson(results);
    res.render('index', wrapper);
  });
});

function find(jsonArray, model, socket) {
  var results = [];
  for (var i = 0; i < jsonArray.length; i += 1) {
    var node = jsonArray[i];
    if (node.model[0].value == model && node.series[0].value == socket) {
      results.push(node);
    }
  }
  return results;
}

app.get('/reviews/:id', function(req, res) {
  jsonld.expand(rdfJSON, function(err, results) {
    var param = req.params.id;
    var clearedJson = clearJson(results);
    var splitedpRequest = param.split('_');

    var findedJson = find(clearedJson, splitedpRequest[0], splitedpRequest[1]);
    res.render('reviews', findedJson[0]);
  });
});

app.listen(3000);