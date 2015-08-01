
# nostalgic-pluto-database

Back end for nostalgic-pluto project.

## Files

The nostalgic-pluto-database has files as below:

* server.js

	This file contains the server side main code for your application
	written using the express server package.
* app.js

	This file contains the server side start code for application
	written using the express server package.

* public/

	This directory contains public resources of the application, that will be
	served up by this server

* package.json

	This file contains metadata about your application, that is used by both
	the `npm` program to install packages, but also Bluemix when it's
	staging your application.  For more information, see:
	<https://docs.npmjs.com/files/package.json>
	
## Operations

The API operations include: 

* GET /api/geoquery?lon=-78.8564711&lat=35.9050158&max=1000

	Gets all images within 1000 meters of the given coordinates

* GET 

	http://nostalgic-pluto-image-api.mybluemix.net/api/image/          						Get all images objects.

* POST 

	http://nostalgic-pluto-image-api.mybluemix.net/api/image/  								Create a new object. 

* PUT 
	
	http://nostalgic-pluto-image-api.mybluemix.net/api/image/55b252bfec87e4590e000006          Update items of one specific object.

* GET 

	http://nostalgic-pluto-image-api.mybluemix.net/api/image/55b252bfec87e4590e000006          Get image info of one specific object.

* DELETE 

	http://nostalgic-pluto-image-api.mybluemix.net/api/image/55b252bfec87e4590e000006       Delete one specific object.

## Objects

The format of object in the database is:

	{
		name: String,
		time: String,
		description: String,
		level: {
			ok: Number,
			poor: Number,
			crit: Number
		},
		loc: {
			type: { type: String },
			coordinates: [Number]
		}
	}

Especially, time format is YYYY-MM-DDThh:mm:ssTZD

=======

>>>>>>> 65cb25b0c785f509be55284690722b5f2a52d9b8


