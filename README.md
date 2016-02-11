#Governify-NPM 

The node module to control API using [Governify](http://governify.io) tools. This module is a middleware which you can use on [ExpressJS](http://expressjs.com/es/) or [ConnectJS](https://github.com/senchalabs/connect).

##Intallation
On your application package run next command:

```
$ node npm install governify
```

##Example
To control the api you must use ```governify.control(app, [options])```

```
var governify = require('governify');
var express = require('express');

var app = express();

var options = {
	datastore: "http://datastore.governify.io/api/v6/default/"
};

governify.control(app, options);

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
	res.send(birds);
	res.end();
});

app.listen(9999, function(){
	console.log("App listening on port: ", 9999);
});
```

**NOTE:** You must do requests with ```?user=:client_id```. For example: 
```
curl -X GET http://localhost:9999/api/v1/birds?user=ppm
``` 
