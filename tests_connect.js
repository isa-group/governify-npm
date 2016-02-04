var governify = require('./index.js');
var connect = require('connect');

var app = connect();

var options = {
	datastore: "http://datastore.governify.io/api/v5/"
};

governify.control(options, function(terms){
	
	app.use(terms.Requests);

	app.use(terms.ResponseTime);

});


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
	res.end(JSON.stringify(birds, true));
});

app.listen(9999, function(){
	console.log("App listening on port: ", 9999);
});