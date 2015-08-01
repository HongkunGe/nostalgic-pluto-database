// public/models/GeoData.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var geoDataSchema = new Schema({
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
});

module.exports = mongoose.model('geoData', geoDataSchema);