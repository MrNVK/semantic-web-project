var express    = require('express'),
	handlebars = require('handlebars'),
	n3         = require('n3'),
	app        = express();
	
	
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', '.handlebars');

app.get('/', function(request, response) {
	response.render('index');
});
	
app.listen(3000);