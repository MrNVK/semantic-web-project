var express    = require('express'),
	handlebars = require('express-handlebars'),
	n3         = require('n3'),
	app        = express();	
	
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
	res.render('index');
});
	
app.listen(3000);