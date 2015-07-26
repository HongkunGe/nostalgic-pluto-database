/*jshint node:true*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var express = require('express');

var app = express();

var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

var geoDataModel = require('./models/GeoData');

var fs = require('fs');
// connect to mongDB and test if the connection is successful.
var url = 'mongodb://hongkunMongo:passw0rd@ds061112.mongolab.com:61112/IbmCloud_p05ramqi_l8oojj16';

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

mongoose.connect(url, function(err, res){
	if (err){
		console.log('ERROR connecting to mongoDB!');
		fs.appendFile('./consoleLog', 'ERROR connecting to mongoDB!\r\n');
	}else{
		console.log("Successfully Connected!");
		fs.appendFile('./consoleLog', 'Successfully Connected!\r\n');
	}
}); // connect to our database


// configure app to use bodyParser()
// this will get the data from a POST for us.
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//var port = process.env.PORT || 9080;

//ROUTE FOR OUR API

var router = express.Router(); // get an instance of the express Router
//middleware to use for all requests.
router.use(function(request, response, next) {
	console.log('API call is happening...');
	fs.appendFile('./consoleLog', 'API call is happening...\r\n');
	next();  // make sure we go to the next routes and don't stop here.
});

//test route to make sure everything is workingd
// accessed at GET http://localhost:8888/api
router.get('/', function(request, response){
	response.json({message: 'Mongo API for GeoData of nostalgic-pluto'});
});


router.route('/image')

	// Upload a new image info (accessed at POST http://localhost:8888/api/image)
	.post(function(request, response) {

		var geo_data = new geoDataModel();  // create a new instance of the geoDataModel

		console.log(request.body) // populated!

		geo_data.latitude = request.body.latitude; // set the geo_data (comes from the request)
		geo_data.longitude = request.body.longitude;
		geo_data.time = request.body.time;
		geo_data.name = request.body.name;

		// console.log(request.raw.req);

		//save the geo_data and check for errors.		
		geo_data.save(function(err){
			if (err)
				response.send(err);

			// if file is saved successfully, return the message and doc id.
			response.json({message: 'Image info Saved Successfully!', _id: geo_data._id}); 
			fs.appendFile('./consoleLog', 'POST: Image info Saved Successfully!\r\n');
		});
	})
	
	// get all the geo_data (accessed at GET http://localhost:8888/api/image)
	.get(function(request, response){
		geoDataModel.find(function(err, geo_data){
			if (err)
				request.send(err);
			response.json(geo_data);
			fs.appendFile('./consoleLog', 'GET: Image info got Successfully!\r\n');
		});
	});


router.route('/image/:images_id')

	// get the image info with that id (accessed at GET http://localhost:8888/api/image/:images_id )
	.get(function(request, response) {
		geoDataModel.findById(request.params.images_id, function(err, geo_data) {
			if (err)
				response.send(err);
			response.json(geo_data);
			fs.appendFile('./consoleLog', 'GET: Image info with id got Successfully!\r\n');
		});
	})

	// update the bear with that id( accessed at PUT http://localhost:8888/api/image/:images_id )
	.put(function(request, response){
		// use the bear model to find the bear we want.
		geoDataModel.findById(request.params.images_id, function(err, geo_data){
			if(err)
				response.send(err);

			geo_data.latitude = request.body.latitude; // set the geo_data (comes from the request)
			geo_data.longitude = request.body.longitude;
			geo_data.time = request.body.time;
			geo_data.name = request.body.name;

			//save the geo_data
			geo_data.save(function(err){
				if (err)
					res.send(err);

				// if file is updated successfully, return the message and doc id.
				response.json({message: 'Image info updated!', _id: geo_data._id});
			});

		});
	})

	// delete the bear with the id (accessed at DELETE http://localhost:8888/api/image/:images_id)
	.delete(function (request, response) {
		geoDataModel.remove({
			_id: request.params.images_id
		}, function(err, image){
			if (err)
				response.send(err);
			response.json({message: 'Successfully deleted!'});
		});
	});

//REGISTER OUR routes
//all the routes will be prefixed with /api
app.use('/api', router);

//STAER THE SERVER 
fs.appendFile('./consoleLog', 'Test Begin now!\r\n');


// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

