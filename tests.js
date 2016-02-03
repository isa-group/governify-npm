var governify = require('./index.js');
var express = require('express');

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
app.get("/api/v1/birds", function(req, res){
	setTimeout( function(){
		res.send(birds);
		res.end();	
	},200);
});

app.listen(9999, function(){
	console.log("App listening on port: ", 9999);
});