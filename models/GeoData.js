// public/models/GeoData.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var geoDataSchema = new Schema({
	name: String,
	time: String,
	loc: {
		type: { type: String },
		coordinates: [Number, Number]
	}
});

module.exports = mongoose.model('geoData', geoDataSchema);