var governify = require('./index.js');
var express = require('connect');

var app = express();

var options = {
	datastore: "http://datastore.governify.io/api/v5/"
};

app.use(governify.control(options));

var birds = [
	{
		"id" : "234h235buh45bhy456",
		"specie" : "Halcon",
		"place" : "Doñana",
		"legDiameter" : 1.0,
		"wingSize" : 10.0,
		"eggs" : 10,
		"hatches" : 2
	}
]
app.use("/api/v1/birds", function(req, res){
	res.send(birds);
	res.end();
});

app.listen(9999, function(){
	console.log("App listening on port: ", 9999);
});