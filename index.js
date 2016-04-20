'use strict'
var request = require('request');
var express = require('express');

var logger = require('winston');
logger.default.transports.console.timestamp = true;

var url = require('url');
var responseTime = require('response-time');

var governify = new Object();

governify.control = function(app, opt){

	//default options.
	var options = {
		datastore : "http://datastore.governify.io/api/v6.1/",
		namespace: "default",
		apiKeyVariable: "apikey",
		path: "/",
		terms: {
			requests: "RequestTerm"
		},
		properties: {
			requests: "Requests",
			responseTime: "AVGResponseTime"
		}
	}

	//update good options
	applyOptionsPolicy(options, opt);

	//return middleware function
	try{

		app.use(options.path, responseTime( function(req, res, time){
			addResponseTime(options, req, res, time);										
		}));

		app.use(options.path, function (req, res, next){
			if(!req.query){
				req.query = url.parse(req.url, true).query;
			}
			if(!req.query[options.apiKeyVariable]){
				sendErrorResponse(401, 'Unauthorized! please check the user query param', res);
			}else{
				isPermitedRequest(options, req, res, next, addRequest);
			}		
		});

	}catch(e){

		throw "The app param must be an expressJS or connectJS middleware app.";

	}
	
}

function addResponseTime(options, req, res, time){
	var propertyUrl = options.datastore + options.namespace +  "agreements/" + req.query[options.apiKeyVariable] + "/properties/" + options.properties.responseTime;
	var property = {
		id : options.properties.responseTime,
		metric : "int",
		scope : "Global",
		value : time+""
	}

	if(res.statusCode >= 200 && res.statusCode < 300){
		request.post({url: propertyUrl, body : JSON.stringify(property), headers:{'Content-Type':'application/json'}}, function(error, response, body){
			if(!error){
				logger.info(options.properties.responseTime + " property has been updated.");
			}else{
				logger.info("Has occurred an error while it tried update " + options.properties.responseTime + " property");
			}
		});
	}

}

function isPermitedRequest(options, req, res, next, callback){
	logger.info("Checking if isPermitedRequest...");

	var propertyUrl = options.datastore + options.namespace +  "agreements/" + req.query[options.apiKeyVariable] + "/guarantees/" + options.terms.requests;
	request(propertyUrl, function(error, response, body){
		if(!error && response.statusCode == 200 ){
			logger.info(body);

			if(body === "true"){
				next();	
				callback(options, req, res, next);
			}else{
				sendErrorResponse(429, 'Unauthorized! Too many requests.', res);
			}			
		}else{
			sendErrorResponse(402, 'Unauthorized! please check your SLA.', res)
		}
	});

}

function addRequest(options, req, res, next){
	var propertyUrl = options.datastore + options.namespace + "agreements/" + req.query[options.apiKeyVariable] + "/properties/" + options.properties.requests ;

	request(propertyUrl, function(error, response, body){
		if(!error && response.statusCode == 200 ){
			var property = JSON.parse(body);
			property.value = (parseInt(property.value) + 1) + '';

			request.post({url: propertyUrl, body : JSON.stringify(property), headers:{'Content-Type':'application/json'}}, function(error, response, body){
				if(!error){
					logger.info("Requests property has been updated.");							
				}else{
					logger.info("Has occurred an error while it tried update Requests property.");
				}
			});

		}else{
			logger.info("No data, please check your SLA.");
		}
	});
}

//add suppot to Connect, modifing returned options
function sendErrorResponse(code, message, res){
	var error = new Object();
	error.code = code;
	error.message = message;
	try{
		res.status(code);
		res.send(JSON.stringify(error, true));
	}catch(err){
		res.statusCode = code;
		res.end(JSON.stringify(error, true));
	}
}

function applyOptionsPolicy(options, opt){

	//modify default options.
	if(opt){
		if(opt.datastore)
			options.datastore = opt.datastore;
		if(opt.namespace)
			options.namespace = opt.namespace;
		if(opt.path)
			options.path = opt.path;
		if(opt.apiKeyVariable)
			options.apiKeyVariable = opt.apiKeyVariable;
		if(opt.terms){
			for(var term in options.terms){
				if(opt.terms[term])
					options.terms[term] = opt.terms[term];
			}
		}			
		if(opt.properties){
			for(var prop in options.properties){
				if(opt.properties[prop])
					options.properties[prop] = opt.properties[prop];
			}		
		}			
	}

	//add "/" to end url.
	if(options.datastore[options.datastore.length-1] != "/")
		options.datastore += "/";
	if(options.namespace[options.namespace.length-1] != "/")
		options.namespace += "/";

}

module.exports = governify;