var express    = require('express'),
    handlebars = require('express-handlebars'),
    rdfstore   = require('rdfstore'),
    n3         = require('n3'),
    fs         = require('fs'),
    app        = express();	

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var rdf = fs.readFileSync('app/rdf.n3').toString();

app.get('/', function(req, res) {
  rdfstore.create(function(err, store) {
    store.load('text/turtle', rdf, function(s,d) {
      store.execute("SELECT * { ?s ?p ?o }", function(err, results) {
        if (!err) {
          var objects = [];
          results.forEach(function(item) {
            function getValue(complexString) {
              return complexString.substr(complexString.indexOf('#') + 1);
            }
            
            objects.push({s: getValue(item.s.value), 
                          p: getValue(item.p.value), 
                          o: getValue(item.o.value)});
          });
          console.log(objects);
        }
      });
      
    });
  });
  res.render('index');
});
	
app.listen(3000);