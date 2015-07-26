// public/models/GeoData.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var geoDataSchema = new Schema({
	latitude: Number,
	longitude: Number,
	Time: String,
	url: String
});

module.exports = mongoose.model('geoData', geoDataSchema);