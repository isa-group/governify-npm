# Governify-NPM 

> This is BETA module and may have bugs and don't work correctly. 
> It is intended for qualified beta testers only and must not be used in production systems.

The node module to control API using [Governify](http://governify.io) tools. This module is a middleware which you can use on [ExpressJS](http://expressjs.com/es/) or [ConnectJS](https://github.com/senchalabs/connect).

## Intallation
On your application package run next command:

```
$ npm install governify
```

#### Example
To control the api you must use ```governify.control(app, [options])``` see [Options Object](#optionsObject)

```
var governify = require('governify');
var express = require('express');
var app = express();
var port = 9999;

governify.control(app, options = {
	datastore: "http://datastore.governify.io/api/v6.1",
	namespace: "default",
	apiKeyVariable: "apikey",
	path: "/api"
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
app.get("/api/v1/birds", function(req, res){
	res.send(birds);
	res.end();
});

app.listen(port, function(){
	console.log("App listening on port: ", port);
});
```

**NOTE:** You must do requests with ```?apikey=:key```. For example: 
```
curl -X GET http://localhost:9999/api/v1/birds?apikey=proUser1
``` 

## <a name="optionsObject"></a> Options object


| Field Name | Type          | Description  |
| :--------- | :------------:| :------------|
| **datastore** | `string`| **Required** This is the endpoint URL where the service that stores and analyzes the agreement is located. **NOTE:** You can use our [datastore](http://datastore.governify.io/), Using by default datastore.  |
| **namespace**   | `string`| **Optional** This field can be used to make out two type of agreement or two type of service, e.g. if you have two services named "api1" and "api2" you can store, analyze and check by different namespaces. By default: `""` |
| **apiKeyVariable**    | `string` | **Optional** This field defines the name of url param which will be checked and that will contain the key to identify the agreement of current request. By default: `"apikey"`|
| **path** | `string`| **Optional**  This field defines the path from which the filter will be applied. By default: `"/"` |


#### Example

* **Example 1**

```

{
	datastore: "http://datastore.governify.io/api/v6.1",
	namespace: "default",
	apiKeyVariable: "apikey",
	path: "/api"
}

```

 On this example you must do request with ```?apikey=:key```. For example: 

```
curl -X GET http://localhost:9999/api/v1/birds?apikey=proUser1
``` 

And the URL that will be used to check if *"key"* is authorized is:

```
http://datastore.governify.io/api/v6.1/default/agreements/proUser1
``` 

* **Example 2**

```

{
	datastore: "http://datastore.governify.io/api/v6.1",
	namespace: "service1",
	apiKeyVariable: "user",
	path: "/api"
}

```

 On this example you must do request with ```?user=:key```. For example: 

```
curl -X GET http://localhost:9999/api/v1/birds?user=proUser1
``` 

And the URL that will be used to check if *"key"* is authorized is:

```
http://datastore.governify.io/api/v6.1/service1/agreements/proUser1
``` 