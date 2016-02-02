'use strict'
var request = require('request');
var url = require('url');

var governify = Object();

governify.control = function(opt){

	//default options.
	var options = {
		datastore : "http://datastare.governify.io/api/v5/"
	}

	//modify default options.
	if(options)
		options = opt;

	// return middleware function
	return function (req, res, next){
		if(!req.query){
			req.query = url.parse(req.url, true).query;
		}
		if(!req.query.user){
			sendErrorResponse('Unauthorized! please check the user query param', res);
		}else{
			isPermitedRequest(options, req, res, next, addRequest);
		}		
	}

}

function isPermitedRequest(options, req, res, next, callback){
	console.log("Checking if isPermitedRequest...");
	var propertyUrl = options.datastore +  "agreements/" + req.query.user + "/guarantees/RequestTerm";
	request(propertyUrl, function(error, response, body){
		if(!error && response.statusCode == 200 ){
			console.log(body);
			if(body === "true"){
				addRequest(options, req, res, next);
			}else{
				sendErrorResponse('Unauthorized! please check your SLA.', res);
				
			}			
		}else{
			sendErrorResponse('Unauthorized! please check your SLA.', res)
		}
	});

}

function addRequest(options, req, res, next){
	var propertyUrl = options.datastore +  "agreements/" + req.query.user + "/properties/Requests";

	request(propertyUrl, function(error, response, body){
		if(!error && response.statusCode == 200 ){
			var property = JSON.parse(body);
			property.value = (parseInt(property.value) + 1) + '';

			request.post({url: propertyUrl, body : JSON.stringify(property), headers:{'Content-Type':'application/json'}}, function(error, response, body){
				if(!error){
					console.log("Requests property has been updated.");
					next();
				}else{
					console.log("Has occurred an error while it tried update Requests property");
				}
			});

		}else{
			console.log("No data, please check your SLA.");
		}
	});
}

//add suppot to Connect modify returned options
function sendErrorResponse(message, res){
	try{
		res.status(401)
		res.send(message);
	}catch(err){
		res.statusCode = 401;
		res.end(message);
	}
}

module.exports = governify;