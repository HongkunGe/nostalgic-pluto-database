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
		console.log("Connected to mongolab.");
		fs.appendFile('./consoleLog', 'Connected to mongolab.\r\n');
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

router.route('/geoquery').get(function(request, response){
	var lon = parseFloat(request.query.lon);
	var lat = parseFloat(request.query.lat);
	var max = parseFloat(request.query.max);
	// lon = -78.8564711; lat = 35.9050158; max = 8046.72;

	if(!lat || !lon || !max) {
		response.send("Missing lat, lon, or max params");
		console.log("Missing lat, lon, or max params");
		return;
	}

	geoDataModel
		.find({
		    loc:{ 
		        $near : {
		            $geometry: { type: "Point",  coordinates: [ lon, lat ] },
		            $maxDistance: max // 5 miles
		        }
		    }
		})
		.exec(function(err,list){
			console.log("There are",list.length,"posts within", max, "meters of "+lon+", "+lat);
			response.json(list);
		});
});

router.route('/image')

	// Upload a new image info (accessed at POST http://localhost:8888/api/image)
	.post(function(request, response) {

		var geo_data = new geoDataModel();  // create a new instance of the geoDataModel

		var b = request.body;
		var errorCheck = validateRequest(b);
		if(errorCheck){
			console.log(errorCheck);
			response.send(errorCheck)
			return;
		}

		geo_data.name = b.name;
		geo_data.time = b.time;
		geo_data.description = b.description;
		geo_data.loc = {
			"type": "Point",
			"coordinates": [b.loc.coordinates[0], b.loc.coordinates[1]]
		}
// TODO: Prototype: assign the different levels with random number. Will implement the functionality later. 
		geo_data.level.ok = Math.floor((Math.random() * 100) + 1);
		geo_data.level.poor = Math.floor((Math.random() * 100) + 1);
		geo_data.level.crit = Math.floor((Math.random() * 100) + 1);

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

			var b = request.body;
			var errorCheck = validateRequest(b);
			if(errorCheck){
				console.log(errorCheck);
				response.send(errorCheck)
				return;
			}

			geo_data.name = b.name;
			geo_data.time = b.time;
			geo_data.description = b.description;
			geo_data.loc = {
				"type": "Point",
				"coordinates": [b.loc.coordinates[0], b.loc.coordinates[1]]
			}

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


// re
function validateRequest(b) {
	console.log("Request body:", b);
	if(!b.name) {
		return "Missing 'name' attribute";
	} else if(!b.time) {
		return "Missing 'time' attribute";
	} else if(!b.loc) {
		return "Missing 'loc' attribute";
	} else if(b.loc && !b.loc.type) {
		return "Missing 'loc.type' attribute";
	} else if(b.loc && !b.loc.coordinates) {
		return "Missing 'loc.coordinates' attribute";
	}
	else return 0;
}

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

